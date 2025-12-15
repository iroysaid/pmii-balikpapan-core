"use client";

import { createPost, updatePost } from "@/app/actions/post";
import ContentImageUploader from "@/components/ContentImageUploader";
import { Save, Edit } from "lucide-react";

interface PostFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function PostForm({ initialData, isEdit = false }: PostFormProps) {
    const action = isEdit ? updatePost.bind(null, initialData?.id) : createPost;

    return (
        <form action={action} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
                <label className="block text-sm font-bold text-primary mb-2">
                    Judul Berita
                </label>
                <input
                    type="text"
                    name="title"
                    required
                    defaultValue={initialData?.title}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-lg"
                    placeholder="Contoh: Pelantikan Raya PMII Balikpapan 2025"
                />
            </div>

            <div>
                <div>
                    <label className="block text-sm font-bold text-primary mb-2">
                        Gambar Utama (Cover)
                    </label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition"
                    />
                    {isEdit && initialData?.image && (
                        <div className="mt-2 text-xs text-blue-500">
                            Gambar saat ini tersedia. Biarkan kosong jika tidak ingin mengubah.
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Upload foto kegiatan (Max 2MB).</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2">
                    Isi Berita
                </label>
                <textarea
                    name="content"
                    required
                    rows={12}
                    defaultValue={initialData?.content}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent text-sm leading-relaxed"
                    placeholder="Tulis detail berita di sini..."
                ></textarea>
                <ContentImageUploader />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50">
                <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center"
                >
                    {isEdit ? <Edit className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isEdit ? "Update Berita" : "Terbit Berita"}
                </button>
            </div>
        </form>
    );
}
