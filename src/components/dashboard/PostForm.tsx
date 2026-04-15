"use client";

import { createPost, updatePost } from "@/app/actions/berita";
import RichTextEditor from "@/components/editor/RichTextEditor";
import TagSelector, { TagItem } from "@/components/editor/TagSelector";
import { Save, Edit, Image as ImageIcon, Upload, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

interface PostFormProps {
    initialData?: {
        id: string;
        title: string;
        content: string;
        image?: string | null;
        tags?: { tag: { id: string; name: string; group: string } }[];
    };
    isEdit?: boolean;
    allTags: TagItem[];
}

export default function PostForm({ initialData, isEdit = false, allTags }: PostFormProps) {
    const action = isEdit ? updatePost.bind(null, initialData?.id) : createPost;

    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData?.image || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedTagIds = initialData?.tags?.map((t) => t.tag.id) || [];

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload?folder=posts", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) setImageUrl(data.url);
        } finally {
            setUploading(false);
        }
    }

    return (
        <form action={action}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/berita"
                    className="p-2 rounded-xl bg-gray-100 text-secondary hover:bg-gray-200 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-primary">
                        {isEdit ? "Edit Berita" : "Tulis Berita Baru"}
                    </h1>
                    <p className="text-secondary text-sm">
                        {isEdit
                            ? "Perbarui konten artikel."
                            : "Tulis dan publikasikan berita kegiatan PMII."}
                    </p>
                </div>
                <button
                    type="submit"
                    className="ml-auto flex items-center bg-primary text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-900 transition shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                    {isEdit ? (
                        <><Edit className="w-4 h-4 mr-2" /> Update Berita</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" /> Terbitkan</>
                    )}
                </button>
            </div>

            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ——— LEFT COLUMN: Main content (8 cols) ——— */}
                <div className="lg:col-span-8 space-y-5">
                    {/* Title */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-2">
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Judul Berita
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            defaultValue={initialData?.title}
                            className="w-full text-2xl font-black text-primary border-0 focus:outline-none bg-transparent placeholder-gray-200"
                            placeholder="Tulis judul berita yang menarik..."
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                            Isi Berita
                        </label>
                        <RichTextEditor
                            initialContent={initialData?.content}
                            name="content"
                            placeholder="Tulis detail berita di sini…"
                        />
                    </div>
                </div>

                {/* ——— RIGHT COLUMN: Sidebar (4 cols) ——— */}
                <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
                    {/* Cover Image */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Cover Berita
                        </h3>

                        {/* Hidden real url input */}
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />

                        {imageUrl ? (
                            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="cover" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl("")}
                                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold"
                                >
                                    Hapus
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-full py-8 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary/40 hover:text-primary transition flex flex-col items-center gap-2"
                            >
                                {uploading ? (
                                    <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-sm">Mengupload…</span></>
                                ) : (
                                    <><Upload className="w-6 h-6" /><span className="text-sm font-semibold">Upload Gambar Cover</span><span className="text-xs">JPG, PNG, WebP (auto-convert)</span></>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Tag Selector */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            Tags & Kategori
                        </h3>
                        <TagSelector
                            allTags={allTags}
                            selectedTagIds={selectedTagIds}
                            name="tagsJson"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
