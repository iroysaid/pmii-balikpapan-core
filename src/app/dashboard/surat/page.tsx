import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Download, Mail, Send, Edit, Trash } from "lucide-react";
import { deleteLetter } from "@/app/actions/surat";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function SuratPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; q?: string; sort?: string }>;
}) {
    const params = await searchParams;
    const currentType = params.type === "KELUAR" ? "KELUAR" : "MASUK";
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

    const whereClause: any = { type: currentType };
    if (params.q) {
        whereClause.OR = [
            { number: { contains: params.q } },
            { subject: { contains: params.q } },
            { sender: { contains: params.q } },
            { receiver: { contains: params.q } },
        ];
    }

    let orderBy: any = { date: "desc" };
    if (params.sort === "date-asc") orderBy = { date: "asc" };

    const letters = await prisma.letter.findMany({
        where: whereClause,
        orderBy: orderBy,
    });

    const lettersForExport = isSuperAdmin ? letters.map(l => ({
        Nomor: l.number,
        Tanggal: new Date(l.date).toLocaleDateString("id-ID"),
        Perihal: l.subject,
        [currentType === "MASUK" ? "Pengirim" : "Penerima"]: currentType === "MASUK" ? l.sender : l.receiver,
        Jenis: l.type
    })) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Administrasi Surat</h1>
                    <p className="text-secondary text-sm">Arsip surat masuk dan surat keluar.</p>
                </div>
                {isSuperAdmin && (
                    <Link
                        href="/dashboard/surat/create"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-blue-900 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Arsip Surat
                    </Link>
                )}
            </div>

            <DataToolbar
                isSuperAdmin={isSuperAdmin}
                searchPlaceholder="Cari Nomor / Perihal..."
                sortOptions={[
                    { label: "Tanggal (Terbaru)", value: "date-desc" },
                    { label: "Tanggal (Terlama)", value: "date-asc" },
                ]}
                dataForExport={lettersForExport}
                exportFilename={`Data-Surat-${currentType}-${new Date().toISOString().split('T')[0]}`}
            />

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <Link
                    href="/dashboard/surat?type=MASUK"
                    className={`px-6 py-2 rounded-md text-sm font-bold transition flex items-center ${currentType === "MASUK" ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Mail className="w-4 h-4 mr-2" /> Surat Masuk
                </Link>
                <Link
                    href="/dashboard/surat?type=KELUAR"
                    className={`px-6 py-2 rounded-md text-sm font-bold transition flex items-center ${currentType === "KELUAR" ? "bg-white text-orange-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Send className="w-4 h-4 mr-2" /> Surat Keluar
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-secondary font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">No. Surat</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Perihal</th>
                            <th className="px-6 py-4">
                                {currentType === "MASUK" ? "Pengirim" : "Penerima"}
                            </th>
                            <th className="px-6 py-4 text-right">File</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {letters.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                    Belum ada data surat {currentType.toLowerCase()}.
                                </td>
                            </tr>
                        ) : (
                            letters.map((letter) => (
                                <tr key={letter.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-primary">
                                        {letter.number}
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {new Date(letter.date).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-6 py-4 text-secondary font-medium">
                                        {letter.subject}
                                    </td>
                                    <td className="px-6 py-4 text-secondary">
                                        {currentType === "MASUK" ? letter.sender : letter.receiver}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                        {letter.fileUrl ? (
                                            <a href={letter.fileUrl} target="_blank" className="text-blue-600 hover:text-blue-800 p-1">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-300 p-1">-</span>
                                        )}
                                        {isSuperAdmin && (
                                            <>
                                                <Link href={`/dashboard/surat/${letter.id}/edit`} className="text-blue-500 hover:text-blue-700 p-1">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <form action={deleteLetter.bind(null, letter.id)}>
                                                    <button type="submit" className="text-red-400 hover:text-red-600 p-1">
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
