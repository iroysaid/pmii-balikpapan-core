"use client";

import { updateMaterial } from "@/app/actions/materi";
import { FileText, Youtube, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Chapter = {
    id: string | number;
    title: string;
    description: string;
    type: "DOCUMENT" | "YOUTUBE";
    fileUrl?: string;
    youtubeUrl?: string;
};

export default function EditMaterialForm({ material }: { material: any }) {
    // Initialize chapters from material prop
    const initialChapters = material.chapters && material.chapters.length > 0
        ? material.chapters.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            type: c.type,
            fileUrl: c.fileUrl,
            youtubeUrl: c.youtubeUrl
        }))
        : [{ id: Date.now(), title: "", description: "", type: "DOCUMENT" }];

    const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
    const [isPublished, setIsPublished] = useState(material.isPublished);

    const updateMaterialWithId = updateMaterial.bind(null, material.id);

    const addChapter = () => {
        setChapters([...chapters, { id: Date.now(), title: "", description: "", type: "DOCUMENT" }]);
    };

    const removeChapter = (id: string | number) => {
        if (chapters.length > 1) {
            setChapters(chapters.filter((c) => c.id !== id));
        }
    };

    const updateChapter = (id: string | number, field: string, value: any) => {
        setChapters(chapters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    return (
        <form action={updateMaterialWithId} className="space-y-8">
            {/* Main Info */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-bold text-primary border-b pb-2">Informasi Utama</h2>
                <div>
                    <label className="block text-sm font-bold text-primary mb-2">Judul Materi</label>
                    <input type="text" name="title" defaultValue={material.title} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Contoh: Modul MAPABA 2024" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-primary mb-2">Deskripsi Singkat</label>
                    <textarea name="description" defaultValue={material.description || ""} rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Penjelasan singkat..."></textarea>
                </div>

                {/* Hidden input to control publish state */}
                <input type="hidden" name="isPublished" value={isPublished.toString()} />
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

                        <input type="hidden" name={`chapters[${index}][existingFileUrl]`} value={chapter.fileUrl || ""} />

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Judul Bab</label>
                                <input
                                    type="text"
                                    name={`chapters[${index}][title]`}
                                    defaultValue={chapter.title}
                                    onChange={(e) => updateChapter(chapter.id, "title", e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder={`Judul Bab ${index + 1}`}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Deskripsi Bab</label>
                                <textarea
                                    name={`chapters[${index}][description]`}
                                    defaultValue={chapter.description || ""}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="Penjelasan isi bab ini..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Tipe Konten</label>
                                <div className="flex space-x-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => updateChapter(chapter.id, "type", "DOCUMENT")}
                                        className={`flex-1 py-2 text-sm rounded border flex items-center justify-center font-bold transition ${chapter.type === "DOCUMENT" ? "border-primary bg-primary text-white" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                                    >
                                        <FileText className="w-3 h-3 mr-2" /> Dokumen (PDF)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateChapter(chapter.id, "type", "YOUTUBE")}
                                        className={`flex-1 py-2 text-sm rounded border flex items-center justify-center font-bold transition ${chapter.type === "YOUTUBE" ? "border-primary bg-primary text-white" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                                    >
                                        <Youtube className="w-3 h-3 mr-2" /> Video YouTube
                                    </button>
                                </div>
                                <input type="hidden" name={`chapters[${index}][type]`} value={chapter.type} />

                                {chapter.type === "DOCUMENT" ? (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                        <input type="file" name={`chapters[${index}][file]`} accept=".pdf,.doc,.docx,.ppt,.pptx" className="block w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition" />
                                        {chapter.fileUrl && <p className="text-xs text-gray-500 mt-2">File saat ini: <a href={chapter.fileUrl} target="_blank" className="text-blue-600 underline">Lihat File</a></p>}
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                        <input
                                            type="url"
                                            name={`chapters[${index}][youtubeUrl]`}
                                            defaultValue={chapter.youtubeUrl || ""}
                                            required
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end space-x-3">
                <button
                    type="submit"
                    onClick={() => setIsPublished(false)}
                    className="border border-gray-300 text-secondary px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                    Simpan sebagai Draft
                </button>
                <button
                    type="submit"
                    onClick={() => setIsPublished(true)}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition"
                >
                    {isPublished ? "Simpan Perubahan" : "Publish Sekarang"}
                </button>
            </div>
        </form>
    );
}
