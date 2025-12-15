import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, TrendingUp, TrendingDown, History } from "lucide-react";
import FinanceForm from "@/components/dashboard/FinanceForm";

export default async function CreateTransactionPage() {
    const recentTransactions = await prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/finance" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Keuangan
                </Link>
                <h1 className="text-2xl font-bold text-primary">Catat Transaksi</h1>
                <p className="text-secondary text-sm">Input data keuangan dan pantau histori terbaru.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Form (7 cols) */}
                <div className="lg:col-span-7">
                    <FinanceForm />
                </div>

                {/* Right Column: Recent Log (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="font-bold text-primary flex items-center text-sm">
                                <History className="w-4 h-4 mr-2 text-secondary" /> Riwayat 10 Input Terakhir
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {recentTransactions.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">
                                    Belum ada transaksi tercatat.
                                </div>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <div key={tx.id} className="p-4 hover:bg-gray-50 transition">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tx.type === 'DEBIT'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.type === 'DEBIT' ? 'PEMASUKAN' : 'PENGELUARAN'}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(tx.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-primary text-sm line-clamp-1 mb-1">{tx.description}</h4>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-xs text-secondary">
                                                {new Date(tx.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className={`font-mono font-bold text-sm ${tx.type === 'DEBIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'DEBIT' ? '+' : '-'} {new Intl.NumberFormat("id-ID").format(tx.amount)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                            <Link href="/dashboard/finance" className="text-xs text-secondary hover:text-primary font-bold">
                                Lihat Semua Transaksi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
