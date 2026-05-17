import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Plus, TrendingUp, TrendingDown, Edit, Trash } from "lucide-react";
import { deleteTransaction } from "@/app/actions/keuangan";
import ConfirmDeleteButton from "@/components/dashboard/ConfirmDeleteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DataToolbar from "@/components/dashboard/DataToolbar";

export default async function FinancePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; type?: string; sort?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const isSuperAdmin = role === "SUPER_ADMIN" || role === "ADMIN_CABANG" || role === "PENGURUS_CABANG";
    const organizationId = session?.user?.organizationId;
    const params = await searchParams;

    const whereClause: Prisma.TransactionWhereInput = {};
    if (!isSuperAdmin && organizationId) {
        whereClause.organizationId = organizationId;
    }
    
    if (params.q) {
        whereClause.description = { contains: params.q };
    }
    if (params.type) {
        whereClause.type = params.type;
    }

    let orderBy: Prisma.TransactionOrderByWithRelationInput = { date: "desc" };
    if (params.sort === "date-asc") orderBy = { date: "asc" };
    if (params.sort === "amount-desc") orderBy = { amount: "desc" };
    if (params.sort === "amount-asc") orderBy = { amount: "asc" };

    const transactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy: orderBy,
    });

    // Calculate generic stats (Based on ALL time or filtered? Assuming generic stats should be user friendly, but usually stats follow filter context. Let's make stats follow filter context or better yet query ALL for stats to show "Totals" and List for "Filtered".
    // For simplicity, let's keep stats based on what users see or just query aggregate separately if needed.
    // However, usually "Saldo Akhir" is absolute, not based on filter. "Total Pemasukan" etc might be filtered.
    // I will query ALL for Current Balance calculation (absolute logic often requires full history or store balance in every row).
    // The current Schema stores 'balance' on each transaction row, likely representing balance AFTER that transaction.
    // So for "Saldo Akhir", we should get the very last transaction in time (regardless of filters).

    const lastTransaction = await prisma.transaction.findFirst({
        where: !isSuperAdmin && organizationId ? { organizationId } : {},
        orderBy: { date: 'desc' }
    });
    const currentBalance = lastTransaction ? lastTransaction.balance : 0;

    // Totals can follow filter context
    const totalDebit = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalCredit = transactions
        .filter((t) => t.type === "CREDIT")
        .reduce((sum, t) => sum + t.amount, 0);

    // Export Data
    const transactionsForExport = isSuperAdmin ? transactions.map(t => ({
        Tanggal: new Date(t.date).toLocaleDateString("id-ID"),
        Keterangan: t.description,
        Debit: t.type === "DEBIT" ? t.amount : 0,
        Kredit: t.type === "CREDIT" ? t.amount : 0,
        Saldo: t.balance
    })) : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Laporan Keuangan</h1>
                    <p className="text-secondary text-sm">Transparansi arus kas organisasi.</p>
                </div>
                {isSuperAdmin && (
                    <Link
                        href="/dashboard/keuangan/create"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-primary/90 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Catat Transaksi
                    </Link>
                )}
            </div>

            <DataToolbar
                isSuperAdmin={isSuperAdmin}
                searchPlaceholder="Cari Keterangan..."
                sortOptions={[
                    { label: "Tanggal (Terbaru)", value: "date-desc" },
                    { label: "Tanggal (Terlama)", value: "date-asc" },
                    { label: "Nominal (Terbesar)", value: "amount-desc" },
                    { label: "Nominal (Terkecil)", value: "amount-asc" },
                ]}
                showKomisariatTools={false}
                filterOptions={[
                    {
                        key: "type",
                        label: "Jenis Transaksi",
                        options: [
                            { label: "Pemasukan (Debit)", value: "DEBIT" },
                            { label: "Pengeluaran (Kredit)", value: "CREDIT" },
                        ]
                    }
                ]}
                dataForExport={transactionsForExport}
                exportFilename={`Data-Keuangan-${new Date().toISOString().split('T')[0]}`}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 text-secondary mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-primary"><TrendingUp className="w-5 h-5" /></div>
                        <span className="text-sm font-bold">Saldo Akhir</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">Rp {currentBalance.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 text-secondary mb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendingUp className="w-5 h-5" /></div>
                        <span className="text-sm font-bold">Total Pemasukan</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">Rp {totalDebit.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 text-secondary mb-2">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown className="w-5 h-5" /></div>
                        <span className="text-sm font-bold">Total Pengeluaran</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">Rp {totalCredit.toLocaleString("id-ID")}</p>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-secondary font-bold uppercase text-xs">
                        <tr>
                            <th className="px-4 md:px-6 py-4">Tanggal</th>
                            <th className="px-4 md:px-6 py-4">Keterangan</th>
                            <th className="px-4 md:px-6 py-4 text-right text-green-600">Debet</th>
                            <th className="px-4 md:px-6 py-4 text-right text-red-600">Kredit</th>
                            <th className="px-4 md:px-6 py-4 text-right text-primary">Saldo</th>
                            {isSuperAdmin && <th className="px-4 md:px-6 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={isSuperAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-400">
                                    Belum ada data transaksi.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition group">
                                    <td className="px-4 md:px-6 py-4 text-secondary whitespace-nowrap text-xs md:text-sm">
                                        {new Date(t.date).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 font-medium text-primary text-xs md:text-sm min-w-[150px]">
                                        {t.description}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right text-green-600 font-medium whitespace-nowrap text-xs md:text-sm">
                                        {t.type === "DEBIT" ? `Rp ${t.amount.toLocaleString("id-ID")}` : "-"}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right text-red-600 font-medium whitespace-nowrap text-xs md:text-sm">
                                        {t.type === "CREDIT" ? `Rp ${t.amount.toLocaleString("id-ID")}` : "-"}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right font-bold text-primary whitespace-nowrap text-xs md:text-sm">
                                        Rp {t.balance.toLocaleString("id-ID")}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-4 md:px-6 py-4 text-right flex justify-end space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                                            <Link href={`/dashboard/keuangan/${t.id}/edit`} className="text-blue-500 hover:text-blue-700 p-1">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <form action={deleteTransaction.bind(null, t.id)}>
                                                <ConfirmDeleteButton className="text-red-400 hover:text-red-600 p-1">
                                                    <Trash className="w-4 h-4" />
                                                </ConfirmDeleteButton>
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
