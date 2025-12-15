import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinanceReportPage() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    // Strict Access Control: Only Pengurus & Super Admin
    if (role !== "PENGURUS" && role !== "SUPER_ADMIN") {
        redirect("/");
    }

    const transactions = await prisma.transaction.findMany({
        orderBy: { date: "desc" },
    });

    // --- Data Processing for Charts ---
    // Group by Month (Last 12 Months)
    const today = new Date();
    const chartData = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' }); // e.g., "Jan 24"

        // Filter transactions for this month
        const monthlyTrans = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
        });

        const income = monthlyTrans.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
        const expense = monthlyTrans.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);

        chartData.push({ month: monthKey, income, expense });
    }

    // Find Max Value for Chart Scaling
    const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense)), 100000); // Min scale 100k

    // Totals
    const lastTransaction = transactions[0]; // Ordered desc
    const currentBalance = lastTransaction ? lastTransaction.balance : 0;
    const totalIncome = transactions.filter(t => t.type === 'DEBIT').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-primary pt-24 pb-12 px-4 text-center text-white">
                <h1 className="text-3xl font-extrabold mb-2">Laporan Keuangan</h1>
                <p className="text-blue-100/80">Transparansi Arus Kas PC PMII Balikpapan</p>
            </div>

            <div className="container mx-auto px-4 -mt-8 max-w-6xl">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center">
                        <div className="p-4 bg-blue-50 rounded-xl mr-4">
                            <Wallet className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Saldo Saat Ini</p>
                            <h3 className="text-2xl font-extrabold text-gray-800">Rp {currentBalance.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center">
                        <div className="p-4 bg-green-50 rounded-xl mr-4">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Pemasukan</p>
                            <h3 className="text-2xl font-extrabold text-green-600">Rp {totalIncome.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center">
                        <div className="p-4 bg-red-50 rounded-xl mr-4">
                            <TrendingDown className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Pengeluaran</p>
                            <h3 className="text-2xl font-extrabold text-red-600">Rp {totalExpense.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CHART SECTION */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-primary" /> Grafik Arus Kas (12 Bulan)
                            </h2>
                        </div>

                        {/* CSS-Only Bar Chart */}
                        <div className="w-full h-64 flex items-end justify-between space-x-2">
                            {chartData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group relative">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded z-10 w-32 text-center pointer-events-none">
                                        <div className="font-bold">{d.month}</div>
                                        <div className="text-green-400">In: {d.income > 1000 ? (d.income / 1000).toFixed(0) + 'k' : d.income}</div>
                                        <div className="text-red-400">Out: {d.expense > 1000 ? (d.expense / 1000).toFixed(0) + 'k' : d.expense}</div>
                                    </div>

                                    <div className="w-full h-full flex items-end justify-center gap-1">
                                        {/* Income Bar */}
                                        <div
                                            style={{ height: `${(d.income / maxVal) * 100}%` }}
                                            className="w-1/2 bg-green-400 rounded-t-sm hover:bg-green-500 transition-all cursor-pointer"
                                        ></div>
                                        {/* Expense Bar */}
                                        <div
                                            style={{ height: `${(d.expense / maxVal) * 100}%` }}
                                            className="w-1/2 bg-red-400 rounded-t-sm hover:bg-red-500 transition-all cursor-pointer"
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400 rotate-0 truncate w-full text-center">{d.month}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6 space-x-6 text-sm">
                            <div className="flex items-center"><span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span> Pemasukan</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span> Pengeluaran</div>
                        </div>
                    </div>

                    {/* RECENT LIST SECTION */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
                            <Calendar className="w-5 h-5 mr-2 text-primary" /> Riwayat Transaksi
                        </h2>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {transactions.map((t) => (
                                <div key={t.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${t.type === 'DEBIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {t.type === 'DEBIT' ? 'Pemasukan' : 'Pengeluaran'}
                                        </span>
                                        <span className="text-xs text-secondary">{new Date(t.date).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm mb-1">{t.description}</h4>
                                    <p className={`font-bold text-lg ${t.type === 'DEBIT' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'DEBIT' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2 text-right">Saldo: Rp {t.balance.toLocaleString('id-ID')}</p>
                                </div>
                            ))}
                            {transactions.length === 0 && (
                                <p className="text-center text-gray-400 py-10">Belum ada data transaksi.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
