import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Plus, Edit, Trash2, Calendar, Users } from "lucide-react";
import { deleteActivity } from "@/app/actions/kegiatan";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function ActivitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string; status?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const isSuperAdmin = role === "SUPER_ADMIN" || role === "ADMIN_CABANG" || role === "PENGURUS_CABANG";
    const organizationId = session?.user?.organizationId;
    const params = await searchParams;

    const whereClause: Prisma.ActivityWhereInput = {};
    if (!isSuperAdmin && organizationId) {
        whereClause.organizationId = organizationId;
    }

    if (params.q) {
        whereClause.OR = [
            { title: { contains: params.q } },
            { description: { contains: params.q } },
        ];
    }

    let orderBy: Prisma.ActivityOrderByWithRelationInput = { startDate: "asc" };
    if (params.sort === "created-desc") orderBy = { createdAt: "desc" };
    if (params.sort === "date-desc") orderBy = { startDate: "desc" };

    const getActivityStatus = (startDate: Date, endDate: Date | null) => {
        const now = new Date();
        const end = endDate ? new Date(endDate) : new Date(startDate);
        end.setHours(23, 59, 59, 999);
        if (now < new Date(startDate)) return "upcoming";
        if (now <= end) return "ongoing";
        return "past";
    };

    let kegiatan = await prisma.activity.findMany({
        where: whereClause,
        orderBy: orderBy,
        include: {
            _count: {
                select: { rsvps: true }
            }
        }
    });

    if (params.status) {
        kegiatan = kegiatan.filter(activity => getActivityStatus(activity.startDate, activity.endDate) === params.status);
    }

    const kegiatanForExport = isSuperAdmin ? kegiatan.map(a => ({
        Judul: a.title,
        Tanggal: new Date(a.startDate).toLocaleDateString("id-ID"),
        Status: new Date(a.startDate) > new Date() ? "Coming Soon" : "Past Event",
        Published: a.published ? "Yes" : "No"
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
                    { label: "Tanggal Terdekat", value: "date-asc" },
                    { label: "Terbaru", value: "created-desc" },
                    { label: "Terlama", value: "date-desc" },
                ]}
                showKomisariatTools={false}
                filterOptions={[
                    {
                        key: "status",
                        label: "Status Kegiatan",
                        options: [
                            { label: "Akan Datang", value: "upcoming" },
                            { label: "Sedang Berlangsung", value: "ongoing" },
                            { label: "Dokumentasi / Past", value: "past" },
                        ],
                    },
                ]}
                dataForExport={kegiatanForExport}
                exportFilename={`Data-Kegiatan-${new Date().toISOString().split('T')[0]}`}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
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
                                                <div className="font-medium text-primary flex items-center">
                                                    <Link href={`/kegiatan/${activity.slug}`} className="hover:text-blue-600 hover:underline">
                                                        {activity.title}
                                                    </Link>
                                                    {activity.isInvitation && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-pink-100 text-pink-600 uppercase">
                                                            Undangan
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-secondary line-clamp-1">{activity.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {new Date(activity.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getActivityStatus(activity.startDate, activity.endDate) === "upcoming" ? (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-accent/20 text-primary">
                                                Coming Soon
                                            </span>
                                        ) : getActivityStatus(activity.startDate, activity.endDate) === "ongoing" ? (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-600">
                                                Berlangsung
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-600">
                                                Past Event
                                            </span>
                                        )}
                                        {!activity.published && (
                                            <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-600">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                {activity.isInvitation && (
                                                    <Link 
                                                        href={`/dashboard/kegiatan/${activity.id}/rsvp`} 
                                                        className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg flex items-center group relative"
                                                        title="Lihat Konfirmasi Kehadiran"
                                                    >
                                                        <Users className="w-4 h-4" />
                                                        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[8px] font-bold px-1 rounded-full">
                                                            {activity._count.rsvps}
                                                        </span>
                                                    </Link>
                                                )}
                                                <Link href={`/dashboard/kegiatan/${activity.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <form action={deleteActivity.bind(null, activity.id)}>
                                                    <ConfirmDeleteButton className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </ConfirmDeleteButton>
                                                </form>
                                            </div>
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
