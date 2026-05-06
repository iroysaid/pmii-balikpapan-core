import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, BookOpen, Clock, PlayCircle } from "lucide-react";

export const dynamic = "force-dynamic";

import { getYouTubeID } from "@/lib/youtube";

function getYouTubeThumbnail(url: string) {
    const videoId = getYouTubeID(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
}

export default async function PublicLearningPage() {
    // Only published materials for public view
    const materials = await prisma.material.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: { chapters: true },
    });

    return (
        <main className="min-h-screen bg-gray-50">


            <div className="bg-primary pt-20 pb-16 px-4 text-center text-white">
                <h1 className="text-4xl font-extrabold mb-4">E-Learning Center</h1>
                <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                    Pusat pembelajaran dan pengembangan kapasitas kader PMII. Akses modul, materi, dan referensi terbaru di sini.
                </p>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Search (Visual) */}
                <div className="max-w-md mx-auto mb-12 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari modul pembelajaran..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.map((item) => {
                        let thumbnail = item.featuredImage;
                        if (!thumbnail && item.chapters.length > 0) {
                            const firstChapter = item.chapters[0];
                            if (firstChapter.type === "YOUTUBE" && firstChapter.youtubeUrl) {
                                thumbnail = getYouTubeThumbnail(firstChapter.youtubeUrl);
                            }
                        }

                        return (
                            <div key={item.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col">
                                <Link href={`/materi/${item.id}`} className="block relative h-52 w-full bg-gray-100 overflow-hidden">
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                            <BookOpen className="w-16 h-16 opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                                        <span className="text-white font-bold flex items-center">
                                            <PlayCircle className="w-5 h-5 mr-2" /> Mulai Belajar
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-400 mb-3">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                                            {item.chapters.length} Bab
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(item.updatedAt).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition">
                                        <Link href={`/materi/${item.id}`}>
                                            {item.title}
                                        </Link>
                                    </h3>

                                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {item.description || "Tidak ada deskripsi singkat untuk materi ini."}
                                    </p>

                                    <Link
                                        href={`/materi/${item.id}`}
                                        className="w-full text-center border border-gray-200 hover:border-primary hover:bg-primary hover:text-white text-gray-600 font-bold py-3 rounded-xl transition duration-300 block"
                                    >
                                        Lihat Materi
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {materials.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 bg-blue-50 rounded-full mb-6 animate-pulse">
                            <BookOpen className="w-12 h-12 text-blue-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Materi</h3>
                        <p className="text-gray-500">Materi pembelajaran akan segera tersedia.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
