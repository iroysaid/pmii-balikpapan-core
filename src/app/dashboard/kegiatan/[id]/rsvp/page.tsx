import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, CheckCircle2, XCircle, Clock, ShieldCheck } from "lucide-react";
import { updateAgendaRegistrationStatus } from "@/app/actions/kegiatan";
import SubmitButton from "@/components/dashboard/SubmitButton";

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
            memberRegistrations: {
                orderBy: { registeredAt: "desc" },
                include: {
                    user: {
                        include: {
                            kaderProfile: true,
                        },
                    },
                },
            },
        },
    });

    if (!activity) return notFound();

    const hadirCount = activity.rsvps.filter((r) => r.attendance === "HADIR").length;
    const tidakHadirCount = activity.rsvps.filter((r) => r.attendance === "TIDAK_HADIR").length;
    const acceptedCount = activity.memberRegistrations.filter((registration) => registration.status === "ACCEPTED").length;
    const completedCount = activity.memberRegistrations.filter((registration) => registration.status === "DONE").length;

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
                        <h1 className="text-2xl font-bold text-primary">Peserta & RSVP</h1>
                        <p className="text-secondary text-sm">{activity.title}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium">Peserta Kader</p>
                        <p className="text-2xl font-black text-primary">{activity.memberRegistrations.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium">Diterima</p>
                        <p className="text-2xl font-black text-primary">{acceptedCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium">Selesai</p>
                        <p className="text-2xl font-black text-primary">{completedCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-xl text-red-600">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-secondary font-medium">RSVP Publik</p>
                        <p className="text-2xl font-black text-primary">{activity.rsvps.length}</p>
                    </div>
                </div>
            </div>

            {/* Member Registration Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-primary">Peserta Kader</h3>
                        <p className="text-sm text-secondary/70">Verifikasi pendaftaran, absensi, dan penyelesaian agenda kader.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-secondary font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Nama Sahabat</th>
                                <th className="px-6 py-4">Komisariat</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Waktu Daftar</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activity.memberRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Belum ada kader yang mendaftar agenda ini.
                                    </td>
                                </tr>
                            ) : (
                                activity.memberRegistrations.map((registration) => (
                                    <tr key={registration.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-primary uppercase">
                                            {registration.user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-secondary">{registration.user.kaderProfile?.komisariat || "-"}</p>
                                            <p className="text-xs text-secondary/60">{registration.user.kaderProfile?.rayon || "Rayon belum diisi"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${getRegistrationStatusClassName(registration.status)}`}>
                                                {getRegistrationStatusLabel(registration.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-secondary">
                                            <div className="flex items-center text-xs">
                                                <Clock className="w-3 h-3 mr-1 opacity-50" />
                                                {new Date(registration.registeredAt).toLocaleString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <form action={updateAgendaRegistrationStatus} className="ml-auto flex min-w-[260px] items-center justify-end gap-2">
                                                <input type="hidden" name="registrationId" value={registration.id} />
                                                <select
                                                    name="status"
                                                    defaultValue={registration.status}
                                                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-secondary outline-none focus:border-primary"
                                                >
                                                    <option value="PENDING">Menunggu</option>
                                                    <option value="ACCEPTED">Diterima</option>
                                                    <option value="PRESENT">Hadir</option>
                                                    <option value="DONE">Selesai</option>
                                                    <option value="REJECTED">Ditolak</option>
                                                </select>
                                                <input
                                                    name="note"
                                                    defaultValue={registration.note || ""}
                                                    placeholder="Catatan"
                                                    className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary"
                                                />
                                                <SubmitButton
                                                    pendingLabel="..."
                                                    className="rounded-xl bg-primary px-3 py-2 text-xs font-black text-white"
                                                >
                                                    Simpan
                                                </SubmitButton>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RSVP Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-primary">RSVP Publik / Undangan</h3>
                        <p className="text-sm text-secondary/70">Total hadir: {hadirCount}, berhalangan: {tidakHadirCount}</p>
                    </div>
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
                                        Belum ada RSVP publik.
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
                                                    Berhalangan
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

function getRegistrationStatusLabel(status: string) {
    const labels: Record<string, string> = {
        REGISTERED: "Terdaftar",
        PENDING: "Menunggu",
        ACCEPTED: "Diterima",
        PRESENT: "Hadir",
        DONE: "Selesai",
        REJECTED: "Ditolak",
    };

    return labels[status] || status;
}

function getRegistrationStatusClassName(status: string) {
    if (status === "PENDING") return "bg-amber-50 text-amber-700";
    if (status === "ACCEPTED") return "bg-blue-50 text-primary";
    if (status === "PRESENT" || status === "DONE") return "bg-green-50 text-green-700";
    if (status === "REJECTED") return "bg-red-50 text-red-600";
    return "bg-gray-100 text-secondary";
}
