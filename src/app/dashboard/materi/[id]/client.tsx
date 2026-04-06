"use client";

import { useState } from "react";
import { FileText, Youtube, PlayCircle, ChevronRight, Download } from "lucide-react";

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
            <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video relative group">
                {activeChapter.type === "YOUTUBE" && activeChapter.youtubeUrl ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(activeChapter.youtubeUrl)}?autoplay=0`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : activeChapter.type === "DOCUMENT" && activeChapter.fileUrl ? (
                    <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-white p-8 text-center">
                        <FileText className="w-16 h-16 mb-4 text-gray-400" />
                        <h3 className="text-xl font-bold mb-2">{activeChapter.title}</h3>
                        <p className="text-gray-400 text-sm mb-6">Dokumen PDF tersedia untuk dibaca/download.</p>
                        <a
                            href={activeChapter.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold flex items-center transition"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download / Baca PDF
                        </a>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Konten tidak dapat dimuat.</p>
                    </div>
                )}
            </div>

            {/* Current Chapter Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-primary mb-2">{activeChapter.title || "Bab Tanpa Judul"}</h2>
                <p className="text-gray-600 leading-relaxed">{activeChapter.description || "Tidak ada deskripsi untuk bab ini."}</p>
            </div>

            {/* Chapter Navigation List */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-primary">Daftar Isi Materi</h3>
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

function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
