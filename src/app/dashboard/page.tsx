import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, CreditCard, Mail, BookOpen, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Fetch Real Data in Parallel
    const [kaderCount, suratMasukCount, suratKeluarCount, materialCount, lastTransaction, recentPosts] = await Promise.all([
        prisma.user.count({ where: { role: 'KADER' } }),
        prisma.letter.count({ where: { type: 'MASUK' } }),
        prisma.letter.count({ where: { type: 'KELUAR' } }),
        prisma.material.count(),
        prisma.transaction.findFirst({ orderBy: { date: 'desc' } }),
        prisma.post.findMany({ take: 3, orderBy: { createdAt: 'desc' } })
    ]);

    const currentBalance = lastTransaction ? lastTransaction.balance : 0;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                    <p className="text-secondary text-sm">Selamat datang kembali, {session?.user?.name || "Sahabat"}.</p>
                </div>
                <div className="hidden md:block bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-primary">
                    Role: <span className="text-accent uppercase ml-1 font-bold">{session?.user?.role}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Link href="/dashboard/kader" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:border-primary/50 transition relative overflow-hidden h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-secondary text-xs font-bold uppercase mb-2">Total Kader</h3>
                                <p className="text-3xl font-bold text-primary">{kaderCount.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg text-primary">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/keuangan" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:border-green-500/50 transition relative overflow-hidden h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-secondary text-xs font-bold uppercase mb-2">Saldo Kas</h3>
                                <p className="text-2xl font-bold text-green-600">Rp {(currentBalance / 1000000).toFixed(1)}jt</p>
                                <p className="text-xs text-gray-400 mt-1">Rp {currentBalance.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-green-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/surat?type=MASUK" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:border-orange-500/50 transition relative overflow-hidden h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-secondary text-xs font-bold uppercase mb-2">Surat Masuk</h3>
                                <p className="text-3xl font-bold text-orange-600">{suratMasukCount}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                                <Mail className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/surat?type=KELUAR" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:border-purple-500/50 transition relative overflow-hidden h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-secondary text-xs font-bold uppercase mb-2">Surat Keluar</h3>
                                <p className="text-3xl font-bold text-purple-600">{suratKeluarCount}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                <Mail className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/materi" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:border-blue-500/50 transition relative overflow-hidden h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-secondary text-xs font-bold uppercase mb-2">Materi Modul</h3>
                                <p className="text-3xl font-bold text-blue-600">{materialCount}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-primary">Berita Terbaru</h3>
                        <Link href="/dashboard/berita" className="text-xs text-blue-600 hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="space-y-4">
                        {recentPosts.length === 0 ? (
                            <p className="text-gray-400 text-sm">Belum ada berita.</p>
                        ) : (
                            recentPosts.map(post => (
                                <div key={post.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 pointer-events-none">
                                    <div>
                                        <div className="text-sm font-bold text-gray-800 line-clamp-1">{post.title}</div>
                                        <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString('id-ID')}</div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-blue-900 rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-center items-start">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">Pusat Bantuan</h3>
                    <p className="text-blue-100 text-sm mb-6 relative z-10 max-w-xs">
                        Jika Anda mengalami kendala teknis atau membutuhkan bantuan terkait pengelolaan sistem, silakan hubungi tim developer.
                    </p>
                    <a href="mailto:support@pmii-balikpapan.or.id" className="bg-white text-primary px-6 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition relative z-10">
                        Hubungi Support
                    </a>
                </div>
            </div>
        </div>
    );
}
