import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, History, FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import LettersForm from "@/components/dashboard/LettersForm";

export default async function CreateLetterPage() {
    const recentLetters = await prisma.letter.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/surat" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Administrasi
                </Link>
                <h1 className="text-2xl font-bold text-primary">Arsip Surat Baru</h1>
                <p className="text-secondary text-sm">Catat surat masuk atau surat keluar organisasi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Form (7 cols) */}
                <div className="lg:col-span-7">
                    <LettersForm />
                </div>

                {/* Right Column: Recent Log (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="font-bold text-primary flex items-center text-sm">
                                <History className="w-4 h-4 mr-2 text-secondary" /> Riwayat 10 Surat Terakhir
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {recentLetters.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">
                                    Belum ada surat tercatat.
                                </div>
                            ) : (
                                recentLetters.map((letter) => (
                                    <div key={letter.id} className="p-4 hover:bg-gray-50 transition group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center ${letter.type === 'MASUK'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {letter.type === 'MASUK' ? <ArrowDownLeft className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1" />}
                                                {letter.type}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">
                                                {new Date(letter.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-primary text-sm line-clamp-1 mb-1 group-hover:text-accent transition">{letter.subject}</h4>
                                        <div className="text-xs text-secondary flex items-center justify-between">
                                            <span>No: {letter.number}</span>
                                            <span className="text-gray-400 italic truncate max-w-[150px]">
                                                {letter.type === 'MASUK' ? `Dari: ${letter.sender}` : `Ke: ${letter.receiver}`}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                            <Link href="/dashboard/surat" className="text-xs text-secondary hover:text-primary font-bold">
                                Lihat Semua Arsip
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
