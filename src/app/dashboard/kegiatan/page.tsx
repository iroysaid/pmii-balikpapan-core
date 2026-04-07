import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { deleteActivity } from "@/app/actions/kegiatan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function ActivitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const params = await searchParams;

    const whereClause: any = {};
    if (params.q) {
        whereClause.OR = [
            { title: { contains: params.q } },
            { description: { contains: params.q } },
        ];
    }

    let orderBy: any = { eventDate: "desc" };
    if (params.sort === "date-asc") orderBy = { eventDate: "asc" };

    const kegiatan = await prisma.activity.findMany({
        where: whereClause,
        orderBy: orderBy,
    });

    const kegiatanForExport = isSuperAdmin ? kegiatan.map(a => ({
        Judul: a.title,
        Tanggal: new Date(a.eventDate).toLocaleDateString("id-ID"),
        Status: new Date(a.eventDate) > new Date() ? "Coming Soon" : "Past Event"
    })) : [];


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Informasi & Kegiatan</h1>
                    <p className="text-secondary text-sm">Kelola agenda dan foto kegiatan untuk slider halaman utama.</p>
                </div>
                {isSuperAdmin && (
                    <Link
                        href="/dashboard/kegiatan/create"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-blue-900 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Kegiatan
                    </Link>
                )}
            </div>

            <DataToolbar
                isSuperAdmin={isSuperAdmin}
                searchPlaceholder="Cari Nama Kegiatan..."
                sortOptions={[
                    { label: "Terdekat/Terbaru", value: "date-desc" },
                    { label: "Terlama", value: "date-asc" },
                ]}
                dataForExport={kegiatanForExport}
                exportFilename={`Data-Kegiatan-${new Date().toISOString().split('T')[0]}`}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-secondary font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Nama Kegiatan</th>
                            <th className="px-6 py-4">Tanggal Event</th>
                            <th className="px-6 py-4">Status</th>
                            {isSuperAdmin && <th className="px-6 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {kegiatan.length === 0 ? (
                            <tr>
                                <td colSpan={isSuperAdmin ? 4 : 3} className="px-6 py-8 text-center text-gray-400">
                                    Belum ada kegiatan yang didaftarkan.
                                </td>
                            </tr>
                        ) : (
                            kegiatan.map((activity) => (
                                <tr key={activity.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {activity.image && (
                                              // eslint-disable-next-line @next/next/no-img-element
                                              <img src={activity.image} alt="" className="w-10 h-10 rounded-md object-cover mr-3" />
                                            )}
                                            <div>
                                                <div className="font-medium text-primary">{activity.title}</div>
                                                <div className="text-xs text-secondary line-clamp-1">{activity.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {new Date(activity.eventDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(activity.eventDate) > new Date() ? (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-accent/20 text-primary">
                                                Coming Soon
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600">
                                                Past Event
                                            </span>
                                        )}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                            <Link href={`/dashboard/kegiatan/${activity.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <form action={deleteActivity.bind(null, activity.id)}>
                                                <button type="submit" className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
