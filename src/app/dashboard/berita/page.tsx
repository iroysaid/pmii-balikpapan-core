import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions/berita";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function PostsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const params = await searchParams;

    const whereClause: any = {};
    if (params.q) {
        whereClause.title = { contains: params.q };
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "date-asc") orderBy = { createdAt: "asc" };

    const posts = await prisma.post.findMany({
        where: whereClause,
        orderBy: orderBy,
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
                ]}
                dataForExport={postsForExport}
                exportFilename={`Data-Berita-${new Date().toISOString().split('T')[0]}`}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4 text-secondary">Berita</td>
                                    <td className="px-6 py-4 text-secondary">
                                        {new Date(post.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">
                                            Published
                                        </span>
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                            <Link href={`/dashboard/berita/${post.id}/edit`} className="text-blue-600 hover:text-blue-800">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <form action={deletePost.bind(null, post.id)}>
                                                <button type="submit" className="text-red-600 hover:text-red-800">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
