"use client";

import { useState } from "react";
import { FileText, Youtube, PlayCircle, ChevronRight, Download, AlertCircle } from "lucide-react";
import { getYouTubeID } from "@/lib/youtube";

export default function MaterialDetailClient({ material }: { material: any }) {
    const [activeChapter, setActiveChapter] = useState(material.chapters[0]);

    if (!activeChapter) {
        return (
            <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center text-gray-400">
                <p>Belum ada materi tersedia.</p>
            </div>
        );
    }

    return (
        <>
            {/* Viewer Section */}
            <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video relative group mb-6">
                {activeChapter.type === "YOUTUBE" && activeChapter.youtubeUrl ? (
                    getYouTubeID(activeChapter.youtubeUrl) ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeID(activeChapter.youtubeUrl)}?autoplay=0`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-bold">URL Video Tidak Valid</h3>
                            <p className="text-gray-400 text-sm mt-2">
                                Sistem tidak dapat mengenali link YouTube ini. <br />
                                Pastikan link yang dimasukkan benar (contoh: https://youtube.com/watch?v=...)
                            </p>
                        </div>
                    )
                ) : activeChapter.type === "DOCUMENT" && activeChapter.fileUrl ? (
                    <div className="w-full h-full bg-gray-100 flex flex-col">
                        {/* PDF Viewer */}
                        <iframe
                            src={activeChapter.fileUrl}
                            className="w-full flex-1"
                            title="PDF Viewer"
                        />
                        {/* Fallback / External Link */}
                        <div className="bg-white p-2 border-t flex justify-end">
                            <a
                                href={activeChapter.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center"
                            >
                                <Download className="w-3 h-3 mr-1" /> Buka di Tab Baru / Download
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Konten tidak dapat dimuat.</p>
                    </div>
                )}
            </div>

            {/* Current Chapter Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-primary mb-2">{activeChapter.title || "Bab Tanpa Judul"}</h2>
                <p className="text-gray-600 leading-relaxed">{activeChapter.description || "Tidak ada deskripsi untuk bab ini."}</p>
            </div>

            {/* Chapter Navigation List - Kept as internal navigation */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-primary">Daftar Isi Materi Ini</h3>
                <div className="space-y-2">
                    {material.chapters.map((chapter: any, index: number) => (
                        <button
                            key={chapter.id}
                            onClick={() => setActiveChapter(chapter)}
                            className={`w-full text-left p-4 rounded-xl border flex items-center transition ${activeChapter.id === chapter.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0 font-bold text-sm ${activeChapter.id === chapter.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                                }`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-sm ${activeChapter.id === chapter.id ? "text-primary" : "text-gray-700"}`}>
                                    {chapter.title || `Bab ${index + 1}`}
                                </h4>
                                <div className="flex items-center mt-1 space-x-3">
                                    <span className="text-xs text-secondary flex items-center">
                                        {chapter.type === "YOUTUBE" ? <Youtube className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                                        {chapter.type === "YOUTUBE" ? "Video" : "PDF"}
                                    </span>
                                </div>
                            </div>
                            {activeChapter.id === chapter.id && <PlayCircle className="w-5 h-5 text-primary ml-2" />}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

