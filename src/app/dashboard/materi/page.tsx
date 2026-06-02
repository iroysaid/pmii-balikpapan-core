import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import { getYouTubeID } from "@/lib/youtube";
import { deleteMaterial } from "@/app/actions/materi";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import DataToolbar from "@/components/dashboard/DataToolbar";

export const dynamic = "force-dynamic";

export default async function LearningDashboard({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string; visibility?: string; sort?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    const params = await searchParams;

    const canEdit = userRole === "SUPER_ADMIN";

    const whereClause: Prisma.MaterialWhereInput = {};
    if (params.q) {
        whereClause.OR = [
            { title: { contains: params.q } },
            { description: { contains: params.q } },
        ];
    }
    if (params.status === "draft") whereClause.isPublished = false;
    if (params.status === "published") whereClause.isPublished = true;
    if (params.visibility === "public") whereClause.visibility = "PUBLIC";
    if (params.visibility === "private") whereClause.visibility = "PRIVATE";

    let orderBy: Prisma.MaterialOrderByWithRelationInput = { createdAt: "desc" };
    if (params.sort === "date-asc") orderBy = { createdAt: "asc" };
    if (params.sort === "title-asc") orderBy = { title: "asc" };

    const materials = await prisma.material.findMany({
        where: whereClause,
        orderBy,
        include: { chapters: true },
    });

    const materialsForExport = canEdit ? materials.map(item => ({
        Judul: item.title,
        Bab: item.chapters.length,
        Status: item.isPublished ? "Published" : "Draft",
        Akses: item.visibility === "PRIVATE" ? "Private" : "Public",
        Tanggal: new Date(item.updatedAt).toLocaleDateString("id-ID"),
    })) : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Manajemen E-Learning</h1>
                    <p className="text-secondary">Kelola modul dan materi pembelajaran.</p>
                </div>
                {canEdit && (
                  <div className="flex flex-wrap gap-2">
                    <Link
                        href="/dashboard/materi/progress"
                        className="bg-blue-50 text-primary px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition flex items-center"
                    >
                        <Eye className="w-4 h-4 mr-2" /> Progress Kader
                    </Link>
                    <Link
                        href="/dashboard/materi/create"
                        className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Upload Materi Baru
                    </Link>
                  </div>
                )}
            </div>

            <DataToolbar
                isSuperAdmin={canEdit}
                showKomisariatTools={false}
                searchPlaceholder="Cari Judul Materi..."
                sortOptions={[
                    { label: "Terbaru", value: "date-desc" },
                    { label: "Terlama", value: "date-asc" },
                    { label: "Judul A-Z", value: "title-asc" },
                ]}
                filterOptions={[
                    {
                        key: "status",
                        label: "Status",
                        options: [
                            { label: "Draft", value: "draft" },
                            { label: "Published", value: "published" },
                        ],
                    },
                    {
                        key: "visibility",
                        label: "Akses",
                        options: [
                            { label: "Public", value: "public" },
                            { label: "Private", value: "private" },
                        ],
                    },
                ]}
                dataForExport={materialsForExport}
                exportFilename={`Data-Materi-${new Date().toISOString().split('T')[0]}`}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-sm">
                        <tr>
                            <th className="p-4">Judul Materi</th>
                            <th className="p-4">Bab</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Akses</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {materials.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden border">
                                            {(() => {
                                                let thumb = item.featuredImage;
                                                if (!thumb && item.chapters.length > 0) {
                                                    const first = item.chapters[0];
                                                    if (first.type === "YOUTUBE" && first.youtubeUrl) {
                                                        const vid = getYouTubeID(first.youtubeUrl);
                                                        if (vid) thumb = `https://img.youtube.com/vi/${vid}/mqdefault.jpg`;
                                                    }
                                                }
                                                return thumb ? (
                                                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div>
                                            <Link href={`/materi/${item.id}`} className="font-bold text-primary hover:text-blue-600 hover:underline line-clamp-1">
                                                {item.title}
                                            </Link>
                                            <div className="text-xs text-gray-400 line-clamp-1">{item.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                                        {item.chapters.length} Bab
                                    </span>
                                </td>
                                <td className="p-4">
                                    {item.isPublished ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Published</span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Draft</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {item.visibility === "PRIVATE" ? (
                                        <span className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-bold">Private</span>
                                    ) : (
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">Public</span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(item.updatedAt).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-4 flex justify-end space-x-2">
                                    <Link href={`/materi/${item.id}`} className="text-gray-400 hover:text-blue-500 p-1" title="Lihat">
                                        <Eye className="w-4 h-4" />
                                    </Link>

                                    {canEdit && (
                                        <>
                                            <Link href={`/dashboard/materi/edit/${item.id}`} className="text-gray-400 hover:text-green-500 p-1" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <form action={deleteMaterial.bind(null, item.id)}>
                                                <ConfirmDeleteButton className="text-gray-400 hover:text-red-500 p-1" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </ConfirmDeleteButton>
                                            </form>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {materials.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada data materi.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
