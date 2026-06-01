"use client";

import { createMaterial } from "@/app/actions/materi";
import SubmitButton from "@/components/dashboard/SubmitButton";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, FileText, Youtube } from "lucide-react";
import { useState } from "react";

type Chapter = {
    id: number;
    type: "DOCUMENT" | "YOUTUBE";
};

export default function CreateMaterialPage() {
    const [chapters, setChapters] = useState<Chapter[]>([{ id: 1, type: "DOCUMENT" }]);

    const addChapter = () => {
        const nextId = Math.max(...chapters.map((chapter) => chapter.id)) + 1;
        setChapters([...chapters, { id: nextId, type: "DOCUMENT" }]);
    };

    const removeChapter = (id: number) => {
        if (chapters.length > 1) {
            setChapters(chapters.filter((c) => c.id !== id));
        }
    };

    const updateChapterType = (id: number, type: "DOCUMENT" | "YOUTUBE") => {
        setChapters(chapters.map((c) => (c.id === id ? { ...c, type } : c)));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/materi" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Link>
                <h1 className="text-2xl font-bold text-primary">Upload Materi Baru</h1>
                <p className="text-secondary text-sm">Buat materi dengan banyak bab (PDF atau Video).</p>
            </div>

            <form action={createMaterial} className="space-y-8">
                {/* Main Info */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-lg font-bold text-primary border-b pb-2">Informasi Utama</h2>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Judul Materi</label>
                        <input type="text" name="title" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Contoh: Modul MAPABA 2024" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Deskripsi Singkat</label>
                        <textarea name="description" rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Penjelasan singkat..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Akses Materi</label>
                        <select
                            name="visibility"
                            defaultValue="PUBLIC"
                            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="PUBLIC">Public - bisa diakses tanpa login</option>
                            <option value="PRIVATE">Private - khusus kader yang sudah login</option>
                        </select>
                        <p className="text-[11px] text-gray-400 mt-1">
                            Materi public tampil langsung di halaman /materi. Materi private hanya terbuka setelah kader masuk.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Featured Image (Sampul Materi)</label>
                        <input type="file" name="featuredImage" accept="image/*" className="block w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition" />
                        <p className="text-[10px] text-gray-400 mt-1">*Akan dikonversi ke WebP. Jika dikosongkan, thumbnail akan diambil otomatis dari YouTube (jika ada).</p>
                    </div>
                </div>

                {/* Chapters */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-primary">Daftar Bab</h2>
                        <button type="button" onClick={addChapter} className="text-sm bg-gray-100 hover:bg-gray-200 text-primary px-3 py-1 rounded font-bold flex items-center">
                            <Plus className="w-4 h-4 mr-1" /> Tambah Bab
                        </button>
                    </div>

                    {chapters.map((chapter, index) => (
                        <div key={chapter.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                            <div className="absolute top-4 right-4">
                                <button type="button" onClick={() => removeChapter(chapter.id)} className="text-red-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="font-bold text-primary mb-4 bg-blue-50 inline-block px-3 py-1 rounded text-sm">Bab {index + 1}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Judul Bab</label>
                                    <input type="text" name={`chapters[${index}][title]`} required className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent" placeholder={`Judul Bab ${index + 1}`} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Deskripsi Bab</label>
                                    <textarea name={`chapters[${index}][description]`} rows={2} className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent" placeholder="Penjelasan isi bab ini..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Tipe Konten</label>
                                    <div className="flex space-x-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() => updateChapterType(chapter.id, "DOCUMENT")}
                                            className={`flex-1 py-2 text-sm rounded border flex items-center justify-center font-bold transition ${chapter.type === "DOCUMENT" ? "border-primary bg-primary text-white" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                                        >
                                            <FileText className="w-3 h-3 mr-2" /> Dokumen (PDF)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateChapterType(chapter.id, "YOUTUBE")}
                                            className={`flex-1 py-2 text-sm rounded border flex items-center justify-center font-bold transition ${chapter.type === "YOUTUBE" ? "border-primary bg-primary text-white" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                                        >
                                            <Youtube className="w-3 h-3 mr-2" /> Video YouTube
                                        </button>
                                    </div>
                                    <input type="hidden" name={`chapters[${index}][type]`} value={chapter.type} />

                                    {chapter.type === "DOCUMENT" ? (
                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                            <input type="file" name={`chapters[${index}][file]`} accept=".pdf,.doc,.docx,.ppt,.pptx" required className="block w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition" />
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                            <input type="url" name={`chapters[${index}][youtubeUrl]`} required placeholder="https://youtube.com/watch?v=..." className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-end space-x-3">
                    <SubmitButton
                        name="isPublished"
                        value="false"
                        pendingLabel="Menyimpan draft..."
                        className="border border-gray-300 text-secondary px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                    >
                        Simpan sebagai Draft
                    </SubmitButton>
                    <SubmitButton
                        name="isPublished"
                        value="true"
                        pendingLabel="Mempublish..."
                        className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
                    >
                        Publish Sekarang
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
