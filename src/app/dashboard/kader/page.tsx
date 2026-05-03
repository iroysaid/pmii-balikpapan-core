import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, CheckCircle, AlertCircle } from "lucide-react";
import { verifyKader, deleteKader } from "@/app/actions/kader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function KaderPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string; role?: string; komisariat?: string; groupBy?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role as string;
    const isSuperAdmin = ["SUPER_ADMIN", "ADMIN_CABANG"].includes(userRole);
    
    const params = await searchParams;

    // Filter Logic
    const whereClause: any = {
        kaderProfile: {
            is: { status: { not: "PENDING" } }
        }
    };

    if (params.role) {
        const roles = params.role.split(",");
        whereClause.role = { in: roles };
    }

    if (params.komisariat) {
        const komisariats = params.komisariat.split(",").map(k => `Komisariat ${k}`);
        whereClause.kaderProfile.is.komisariat = { in: komisariats };
    }

    if (params.q) {
        whereClause.OR = [
            { name: { contains: params.q } },
            { email: { contains: params.q } },
            { kaderProfile: { is: { noInduk: { contains: params.q } } } }
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
            kaderProfile: {
                is: { status: "PENDING" }
            }
        },
        include: { kaderProfile: true },
        orderBy: { createdAt: 'desc' }
    });

    // Grouping Logic
    const isGrouped = params.groupBy === "komisariat";
    let groupedKaders: Record<string, any[]> = {};
    
    if (isGrouped) {
        const order = ["Komisariat Nusantara", "Komisariat Uniba", "Komisariat Mulia", "Komisariat Staiba", "Komisariat Stitba"];
        order.forEach(k => groupedKaders[k] = []);
        
        activeKaders.forEach(kader => {
            const kom = kader.kaderProfile?.komisariat || "Lainnya";
            if (!groupedKaders[kom]) groupedKaders[kom] = [];
            groupedKaders[kom].push(kader);
        });
    }

    // Prepare Export Data
    const kadersForExport = isSuperAdmin ? activeKaders.map(k => ({
        Nama: k.name,
        Email: k.email || "-",
        Role: k.role,
        Komisariat: k.kaderProfile?.komisariat || "-",
        Kampus: k.kaderProfile?.campus || "-",
        Angkatan: k.kaderProfile?.mapabaYear || "-",
        NIA: k.kaderProfile?.noInduk || "-",
        HP: k.kaderProfile?.phone || "-",
        Status: "Aktif"
    })) : [];

    const renderKaderRow = (kader: any) => (
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
                        <div className="text-xs text-gray-500">{kader.email || "-"}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                            <span className="opacity-75">📞 {kader.kaderProfile?.phone || "-"}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-semibold text-primary">{kader.kaderProfile?.komisariat || "-"}</div>
                <div className="text-xs text-secondary mt-1">{kader.kaderProfile?.campus || "-"}</div>
                <div className="text-xs text-gray-500 mt-0.5">{kader.kaderProfile?.faculty || "-"} - {kader.kaderProfile?.major || "-"}</div>
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
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${kader.role.includes('ADMIN') || kader.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {kader.role.replace(/_/g, ' ')}
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
    );

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
                searchPlaceholder="Cari Nama / Email / NIA..."
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
                                    Belum ada data yang sesuai filter.
                                </td>
                            </tr>
                        ) : isGrouped ? (
                            Object.entries(groupedKaders).map(([groupName, kaders]) => (
                                kaders.length > 0 ? (
                                    <React.Fragment key={groupName}>
                                        <tr className="bg-blue-50/50">
                                            <td colSpan={isSuperAdmin ? 5 : 4} className="px-6 py-2 font-bold text-primary text-xs border-y border-blue-100 uppercase tracking-wider">
                                                {groupName} ({kaders.length})
                                            </td>
                                        </tr>
                                        {kaders.map(renderKaderRow)}
                                    </React.Fragment>
                                ) : null
                            ))
                        ) : (
                            activeKaders.map(renderKaderRow)
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pending Verification Table */}
            {isSuperAdmin && pendingKaders.length > 0 && (
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
                                <th className="px-6 py-4 text-right">Verifikasi</th>
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
                                                <div className="text-xs text-gray-400">{kader.email || "-"}</div>
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
                                    <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                        <form action={deleteKader.bind(null, kader.id)}>
                                            <button className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-100">Tolak</button>
                                        </form>
                                        <form action={verifyKader.bind(null, kader.id)}>
                                            <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700">Terima</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
