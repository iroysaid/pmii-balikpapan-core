import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, CheckCircle2, XCircle, Clock } from "lucide-react";

export default async function RSVPPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
            rsvps: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!activity) return notFound();

    const hadirCount = activity.rsvps.filter((r) => r.attendance === "HADIR").length;
    const tidakHadirCount = activity.rsvps.filter((r) => r.attendance === "TIDAK_HADIR").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/kegiatan"
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronLeft className="w-6 h-6 text-secondary" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Konfirmasi Kehadiran</h1>
                        <p className="text-secondary text-sm">{activity.title}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium">Total Respon</p>
                        <p className="text-2xl font-black text-primary">{activity.rsvps.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium">Akan Hadir</p>
                        <p className="text-2xl font-black text-primary">{hadirCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-xl text-red-600">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium">Ihalangan</p>
                        <p className="text-2xl font-black text-primary">{tidakHadirCount}</p>
                    </div>
                </div>
            </div>

            {/* RSVP Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-primary">Daftar Konfirmasi</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-secondary font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Nama Sahabat</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Pesan / Harapan</th>
                                <th className="px-6 py-4">Waktu Konfirmasi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activity.rsvps.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        Belum ada konfirmasi kehadiran.
                                    </td>
                                </tr>
                            ) : (
                                activity.rsvps.map((rsvp) => (
                                    <tr key={rsvp.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-primary uppercase">
                                            {rsvp.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {rsvp.attendance === "HADIR" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    Hadir
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                    Ihalangan
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-secondary max-w-xs truncate italic">
                                            {rsvp.message || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-secondary">
                                            <div className="flex items-center text-xs">
                                                <Clock className="w-3 h-3 mr-1 opacity-50" />
                                                {new Date(rsvp.createdAt).toLocaleString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
