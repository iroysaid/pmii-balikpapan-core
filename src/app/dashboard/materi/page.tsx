import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { deleteMaterial } from "@/app/actions/materi";

export const dynamic = "force-dynamic";

export default async function LearningDashboard() {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;

    const canEdit = userRole === "SUPER_ADMIN" || userRole === "PENGURUS";

    const materials = await prisma.material.findMany({
        orderBy: { createdAt: "desc" },
        include: { chapters: true },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Manajemen E-Learning</h1>
                    <p className="text-secondary">Kelola modul dan materi pembelajaran.</p>
                </div>
                {canEdit && (
                    <Link
                        href="/dashboard/materi/create"
                        className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-900 transition flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Upload Materi Baru
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-sm">
                        <tr>
                            <th className="p-4">Judul Materi</th>
                            <th className="p-4">Bab</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {materials.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="font-bold text-primary">{item.title}</div>
                                    <div className="text-xs text-gray-400 line-clamp-1">{item.description}</div>
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
                                                <button type="submit" className="text-gray-400 hover:text-red-500 p-1" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {materials.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada data materi.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
