import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions/berita";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function PostsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string; status?: string; tag?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const params = await searchParams;

    const whereClause: Prisma.PostWhereInput = {};
    if (params.q) {
        whereClause.title = { contains: params.q };
    }
    if (params.status === "draft") whereClause.published = false;
    if (params.status === "published") whereClause.published = true;
    if (params.tag) {
        whereClause.tags = {
            some: {
                tag: { name: params.tag },
            },
        };
    }

    let orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: "desc" };
    if (params.sort === "date-asc") orderBy = { createdAt: "asc" };
    if (params.sort === "title-asc") orderBy = { title: "asc" };

    const tags = await prisma.tag.findMany({ orderBy: [{ group: "asc" }, { name: "asc" }] });

    const posts = await prisma.post.findMany({
        where: whereClause,
        orderBy: orderBy,
        include: {
            tags: { include: { tag: true } },
        },
    });

    const postsForExport = isSuperAdmin ? posts.map(p => ({
        Judul: p.title,
        Tanggal: new Date(p.createdAt).toLocaleDateString("id-ID"),
        Penulis: p.author || "-",
        Status: p.published ? "Published" : "Draft"
    })) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Manajemen Berita</h1>
                    <p className="text-secondary text-sm">Kelola artikel dan pengumuman website.</p>
                </div>
                {isSuperAdmin && (
                    <Link
                        href="/dashboard/berita/create"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-blue-900 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tulis Berita
                    </Link>
                )}
            </div>

            <DataToolbar
                isSuperAdmin={isSuperAdmin}
                searchPlaceholder="Cari Judul Berita..."
                sortOptions={[
                    { label: "Terbaru", value: "date-desc" },
                    { label: "Terlama", value: "date-asc" },
                    { label: "Judul A-Z", value: "title-asc" },
                ]}
                showKomisariatTools={false}
                filterOptions={[
                    {
                        key: "tag",
                        label: "Kategori / Rubrik",
                        options: tags.map(tag => ({ label: `${tag.group} - ${tag.name}`, value: tag.name })),
                    },
                    {
                        key: "status",
                        label: "Status",
                        options: [
                            { label: "Draft", value: "draft" },
                            { label: "Published", value: "published" },
                        ],
                    },
                ]}
                dataForExport={postsForExport}
                exportFilename={`Data-Berita-${new Date().toISOString().split('T')[0]}`}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-secondary font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Judul</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Status</th>
                            {isSuperAdmin && <th className="px-6 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={isSuperAdmin ? 5 : 4} className="px-6 py-8 text-center text-gray-400">
                                    Belum ada berita yang ditulis.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-primary">
                                        <Link href={`/berita/${post.slug}`} className="hover:text-blue-600 hover:underline">
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {post.tags[0]?.tag.name || "Berita"}
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {new Date(post.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.published ? (
                                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">Published</span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Draft</span>
                                        )}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                            <Link href={`/dashboard/berita/${post.id}/edit`} className="text-blue-600 hover:text-blue-800">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <form action={deletePost.bind(null, post.id)}>
                                                <ConfirmDeleteButton className="text-red-600 hover:text-red-800">
                                                    <Trash2 className="w-4 h-4" />
                                                </ConfirmDeleteButton>
                                            </form>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
