import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { verifyKader, deleteKader } from "@/app/actions/kader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function KaderPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string; role?: string; rayon?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const params = await searchParams;

    // Filter Logic
    const whereClause: any = {
        role: { in: ["KADER", "PENGURUS"] },
        kaderProfile: {
            is: { status: { not: "PENDING" } }
        }
    };

    if (params.role) {
        whereClause.role = params.role;
    }

    if (params.rayon) {
        whereClause.kaderProfile.is.rayon = params.rayon;
    }

    if (params.q) {
        whereClause.OR = [
            { name: { contains: params.q } }, // Removed mode: 'insensitive' to match default sqlite/prisma limitations if any, or add it back if using postgres
            { email: { contains: params.q } }
        ];
    }

    // Sort Logic
    let orderBy: any = { name: 'asc' };
    if (params.sort === 'name-desc') orderBy = { name: 'desc' };
    if (params.sort === 'mapaba-desc') orderBy = { kaderProfile: { mapabaYear: 'desc' } };
    if (params.sort === 'mapaba-asc') orderBy = { kaderProfile: { mapabaYear: 'asc' } };

    const activeKaders = await prisma.user.findMany({
        where: whereClause,
        include: { kaderProfile: true },
        orderBy: orderBy
    });

    const pendingKaders = await prisma.user.findMany({
        where: {
            role: { in: ["KADER", "PENGURUS"] },
            kaderProfile: {
                is: { status: "PENDING" }
            }
        },
        include: { kaderProfile: true },
        orderBy: { createdAt: 'desc' }
    });

    // Prepare Export Data
    const kadersForExport = isSuperAdmin ? activeKaders.map(k => ({
        Nama: k.name,
        Email: k.email,
        Role: k.role,
        Rayon: k.kaderProfile?.rayon || "-",
        Kampus: k.kaderProfile?.campus || "-",
        Angkatan: k.kaderProfile?.mapabaYear || "-",
        NIA: k.kaderProfile?.noInduk || "-",
        HP: k.kaderProfile?.phone || "-",
        Status: "Aktif"
    })) : [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Database Kader</h1>
                    <p className="text-secondary text-sm">Kelola data anggota dan pengurus.</p>
                </div>
                {isSuperAdmin && (
                    <Link href="/dashboard/kader/create" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-blue-900 transition">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Kader
                    </Link>
                )}
            </div>

            <DataToolbar
                isSuperAdmin={isSuperAdmin}
                searchPlaceholder="Cari Nama / Email..."
                sortOptions={[
                    { label: "Nama (A-Z)", value: "name-asc" },
                    { label: "Nama (Z-A)", value: "name-desc" },
                    { label: "Angkatan (Terbaru)", value: "mapaba-desc" },
                    { label: "Angkatan (Terlama)", value: "mapaba-asc" },
                ]}
                filterOptions={[
                    {
                        key: "role",
                        label: "Role User",
                        options: [
                            { label: "Kader", value: "KADER" },
                            { label: "Pengurus", value: "PENGURUS" },
                        ]
                    },
                    {
                        key: "rayon",
                        label: "Rayon",
                        options: [
                            { label: "Hukum", value: "Hukum" },
                            { label: "Teknik", value: "Teknik" },
                            { label: "Ekonomi", value: "Ekonomi" },
                            { label: "Tarbiyah", value: "Tarbiyah" },
                            { label: "Syariah", value: "Syariah" },
                        ]
                    }
                ]}
                dataForExport={kadersForExport}
                exportFilename={`Data-Kader-${new Date().toISOString().split('T')[0]}`}
            />

            {/* Main Table (Active) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-primary flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Data Kader (Terverifikasi)
                    </h2>
                    <span className="text-xs bg-white border px-2 py-1 rounded text-secondary">{activeKaders.length} Anggota</span>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-secondary font-bold uppercase text-xs border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Info Kader</th>
                            <th className="px-6 py-4">Akademik</th>
                            <th className="px-6 py-4">Keanggotaan</th>
                            <th className="px-6 py-4">Role</th>
                            {isSuperAdmin && <th className="px-6 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeKaders.length === 0 ? (
                            <tr>
                                <td colSpan={isSuperAdmin ? 5 : 4} className="px-6 py-8 text-center text-gray-400">
                                    Belum ada kader aktif.
                                </td>
                            </tr>
                        ) : (
                            activeKaders.map((kader) => (
                                <tr key={kader.id} className="hover:bg-gray-50 transition align-top">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                                                {kader.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={kader.image} alt={kader.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-primary text-base">{kader.name}</div>
                                                <div className="text-xs text-gray-500">{kader.email}</div>
                                                <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                                                    <span className="opacity-75">📞 {kader.kaderProfile?.phone || "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-primary">{kader.kaderProfile?.komisariat || "-"}</div>
                                        <div className="text-xs text-secondary mt-1">{kader.kaderProfile?.campus || "-"}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{kader.kaderProfile?.major || "-"}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-500">Angkatan</div>
                                        <div className="font-bold text-primary">{kader.kaderProfile?.mapabaYear || "-"}</div>
                                        <div className="text-xs text-gray-500 mt-2">NIA</div>
                                        <div className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 inline-block">
                                            {kader.kaderProfile?.noInduk || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${kader.role === 'PENGURUS' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {kader.role}
                                        </span>
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link href={`/dashboard/kader/${kader.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</Link>
                                            <form action={deleteKader.bind(null, kader.id)} className="inline">
                                                <button className="text-red-600 hover:text-red-800 font-medium text-xs">Hapus</button>
                                            </form>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pending Verification Table */}
            {pendingKaders.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-x-auto relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <div className="p-4 border-b border-orange-100 flex justify-between items-center bg-orange-50">
                        <h2 className="font-bold text-orange-800 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" /> Menunggu Verifikasi
                        </h2>
                        <span className="text-xs bg-white border border-orange-200 px-2 py-1 rounded text-orange-600 font-bold">{pendingKaders.length} Pending</span>
                    </div>

                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-secondary font-bold uppercase text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Calon Kader</th>
                                <th className="px-6 py-4">Data Akademik</th>
                                <th className="px-6 py-4">Tgl Daftar</th>
                                {isSuperAdmin && <th className="px-6 py-4 text-right">Verifikasi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingKaders.map((kader) => (
                                <tr key={kader.id} className="hover:bg-gray-50 transition align-top">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                                                {kader.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={kader.image} alt={kader.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-primary">{kader.name}</div>
                                                <div className="text-xs text-gray-400">{kader.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold">{kader.kaderProfile?.komisariat || "-"}</div>
                                        <div className="text-xs text-gray-500">{kader.kaderProfile?.campus || "-"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {new Date(kader.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                            <form action={deleteKader.bind(null, kader.id)}>
                                                <button className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-100">Tolak</button>
                                            </form>
                                            <form action={verifyKader.bind(null, kader.id)}>
                                                <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700">Terima</button>
                                            </form>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
