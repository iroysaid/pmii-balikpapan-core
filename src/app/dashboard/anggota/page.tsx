
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookOpen, User, Newspaper } from "lucide-react";
import Link from "next/link";

export default async function MemberDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/masuk");
    }

    if (session.user.role !== "KADER") {
        // Ideally redirects back to main dashboard if accessed by Admin, 
        // but Admin might want to see this view. For now, let's keep it open or redirect.
        // redirect("/dashboard"); 
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { kaderProfile: true }
    });

    const recentModules = await prisma.post.findMany({
        // Placeholder for modules logic, using posts for now or just generic content
        take: 3,
        orderBy: { createdAt: 'desc' },
        where: { published: true } // Assuming modules/news are similar
    });

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Selamat Datang, Sahabat {user?.name?.split(' ')[0]}!</h1>
                <p className="text-blue-100">Selamat belajar dan berproses di PMII.</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                        <div className="flex items-center space-x-3 mb-2">
                            <User className="w-5 h-5 text-yellow-300" />
                            <span className="font-bold">Status Keanggotaan</span>
                        </div>
                        <div className="text-2xl font-bold">
                            {user?.kaderProfile?.status === 'VERIFIED' ? 'Aktif' : 'Pending'}
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                        <div className="flex items-center space-x-3 mb-2">
                            <BookOpen className="w-5 h-5 text-green-300" />
                            <span className="font-bold">Modul Dipelajari</span>
                        </div>
                        <div className="text-2xl font-bold">0</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg text-primary">Profil Saya</h2>
                        <Link href="/dashboard/settings" className="text-sm text-blue-600 hover:underline">Edit Profil</Link>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-secondary text-sm">Nama Lengkap</span>
                            <span className="font-bold text-primary">{user?.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-secondary text-sm">NIA</span>
                            <span className="font-bold text-primary">{user?.kaderProfile?.noInduk || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-secondary text-sm">Komisariat</span>
                            <span className="font-bold text-primary">{user?.kaderProfile?.komisariat || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-secondary text-sm">Kampus</span>
                            <span className="font-bold text-primary">{user?.kaderProfile?.campus || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-secondary text-sm">Fakultas</span>
                            <span className="font-bold text-primary">{user?.kaderProfile?.faculty || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-secondary text-sm">Jurusan</span>
                            <span className="font-bold text-primary">{user?.kaderProfile?.major || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Latest Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-lg text-primary">Informasi Terbaru</h2>
                        <Link href="/dashboard/berita" className="text-sm text-blue-600 hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="space-y-4">
                        {recentModules.map(post => (
                            <Link href={`/news/${post.slug}`} key={post.id} className="block group">
                                <h3 className="font-bold text-primary group-hover:text-blue-600 transition line-clamp-1">{post.title}</h3>
                                <p className="text-xs text-secondary mt-1">{new Date(post.createdAt).toLocaleDateString("id-ID")}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
