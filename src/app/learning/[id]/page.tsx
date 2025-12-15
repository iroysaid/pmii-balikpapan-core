import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Lock, BookOpen } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import MaterialDetailClient from "./client";

export default async function MaterialDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

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
        redirect("/learning"); // Redirect to public catalog instead of dashboard
    }

    // Fetch other recent materials for the Sidebar
    const otherMaterials = await prisma.material.findMany({
        where: {
            isPublished: true,
            id: { not: id } // Exclude current material
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { chapters: true }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link href="/learning" className="text-secondary hover:text-primary flex items-center mb-6 text-sm font-bold w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area (Video/PDF Viewer + Internal Chapter List) */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold text-primary mb-4">{material.title}</h1>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            <span>{new Date(material.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            <span>{material.chapters.length} Bab</span>
                        </div>
                        {!material.isPublished && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                                Draft
                            </span>
                        )}
                    </div>

                    <p className="text-secondary mb-8 leading-relaxed">{material.description}</p>

                    {/* The Interactive Client Component */}
                    <MaterialDetailClient material={material} />
                </div>

                {/* Sidebar - LIST OF OTHER MODULES (Requested Feature) */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-primary mb-4 border-b border-gray-100 pb-2">Materi Lainnya</h3>
                        <div className="space-y-4">
                            {otherMaterials.length === 0 ? (
                                <p className="text-gray-400 text-sm">Belum ada materi lain.</p>
                            ) : (
                                otherMaterials.map((item) => (
                                    <Link key={item.id} href={`/learning/${item.id}`} className="group flex gap-3 items-start p-2 rounded-lg hover:bg-gray-50 transition">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            {item.featuredImage ? (
                                                <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <BookOpen className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-gray-800 group-hover:text-primary line-clamp-2 leading-snug">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" /> {new Date(item.updatedAt).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                        <Link href="/learning" className="block text-center text-sm font-bold text-primary mt-6 hover:underline">
                            Lihat Semua Materi &rarr;
                        </Link>
                    </div>

                    {/* Optional: Categories or Tags could go here */}
                </div>
            </div>
        </div>
    );
}
