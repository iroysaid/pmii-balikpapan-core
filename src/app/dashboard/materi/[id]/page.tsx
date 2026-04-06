import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Verify this path
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Lock } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import MaterialDetailClient from "./client"; // We'll create this next

export default async function MaterialDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const { id } = await params; // Next.js 15 async params

    const material = await prisma.material.findUnique({
        where: { id },
        include: {
            chapters: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    if (!material) {
        notFound();
    }

    // Access Control: Only published materials for non-admins
    const isAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "PENGURUS";
    if (!material.isPublished && !isAdmin) {
        redirect("/dashboard/materi");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link href="/dashboard/materi" className="text-secondary hover:text-primary flex items-center mb-6 text-sm font-bold w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area (Video/PDF Viewer) */}
                <div className="lg:col-span-2 space-y-6">
                    <MaterialDetailClient material={material} />
                </div>

                {/* Sidebar (Meta Info & Chapter List) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h1 className="text-2xl font-bold text-primary mb-2 line-clamp-2">{material.title}</h1>
                        {/* Status Badge for Admins */}
                        {!material.isPublished && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold mb-4">
                                Draft (Hidden)
                            </span>
                        )}
                        <p className="text-secondary text-sm mb-6 leading-relaxed">{material.description}</p>

                        <div className="space-y-4 text-sm text-gray-500 border-t pt-4">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-primary" />
                                <span>Diupdate: {new Date(material.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                <span>{material.chapters.length} Bab Materi</span>
                            </div>
                            {!session && (
                                <div className="bg-blue-50 p-3 rounded-lg flex items-start mt-4">
                                    <Lock className="w-4 h-4 text-blue-600 mt-0.5 mr-2 shrink-0" />
                                    <p className="text-blue-700 text-xs">Login untuk akses penuh materi ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
