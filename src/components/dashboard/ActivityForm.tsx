"use client";

import { createActivity, updateActivity } from "@/app/actions/kegiatan";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Calendar, Image as ImageIcon, Plus, X, Upload, Loader2 } from "lucide-react";

interface ActivityFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    eventDate: Date | string;
    image: string | null;
    photos?: { id: string; url: string }[];
  };
}

export default function ActivityForm({ initialData }: ActivityFormProps) {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [banner, setBanner] = useState(initialData?.image || "");
  const [photos, setPhotos] = useState<string[]>(initialData?.photos?.map(p => p.url) || []);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isBanner: boolean) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                uploadedUrls.push(data.url);
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    }

    if (isBanner && uploadedUrls.length > 0) {
        setBanner(uploadedUrls[0]);
    } else {
        setPhotos(prev => [...prev, ...uploadedUrls]);
    }
    setUploading(false);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    // Add photos JSON to formData
    formData.append("photosJson", JSON.stringify(photos));
    formData.set("image", banner);
    
    if (isEditing) {
      await updateActivity(initialData.id, formData);
    } else {
      await createActivity(formData);
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={handleSubmit} className="space-y-8 pb-20">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-6">
            <div>
            <label className="block text-sm font-bold text-primary mb-2">
                Judul Kegiatan
            </label>
            <input
                type="text"
                name="title"
                defaultValue={initialData?.title}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition duration-200 text-lg font-medium"
                placeholder="Contoh: MAPABA Raya 2024"
                required
            />
            </div>

            <div>
            <label className="block text-sm font-bold text-primary mb-2">
                Deskripsi Singkat / Ringkasan
            </label>
            <textarea
                name="description"
                defaultValue={initialData?.description}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition duration-200 min-h-[120px]"
                placeholder="Tulis ringkasan kegiatan untuk slider..."
                required
            />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-primary mb-2">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-accent" /> Tanggal Event</span>
            </label>
            <input
              type="date"
              name="eventDate"
              defaultValue={initialData?.eventDate ? new Date(initialData.eventDate).toISOString().split('T')[0] : ""}
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition duration-200"
              required
            />
            <p className="mt-2 text-xs text-secondary italic">* Status (Coming Soon/Past) ditentukan otomatis berdasarkan tanggal ini.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              <span className="flex items-center"><ImageIcon className="w-4 h-4 mr-2 text-blue-500" /> Foto Utama (Banner)</span>
            </label>
            <div className="flex gap-4">
                <input
                    type="text"
                    name="image"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition duration-200"
                    placeholder="URL atau Upload ->"
                />
                <input 
                    type="file" 
                    hidden 
                    ref={bannerInputRef} 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                />
                <button 
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploading}
                    className="px-6 py-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center font-bold disabled:opacity-50"
                >
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                </button>
            </div>
          </div>
        </div>

        {/* Documentation Gallery */}
        <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-black text-primary">Dokumentasi Kegiatan</h3>
                    <p className="text-sm text-secondary">Foto-foto ini akan otomatis masuk ke Galeri Album.</p>
                </div>
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-900 transition shadow-md disabled:opacity-50"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengupload...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" /> Tambah Foto Galeri
                        </>
                    )}
                </button>
                <input 
                    type="file" 
                    multiple 
                    hidden 
                    ref={fileInputRef} 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
                {photos.length === 0 && !uploading && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                        Belum ada dokumentasi. Upload foto untuk membuat album di Halaman Galeri.
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link 
          href="/dashboard/kegiatan" 
          className="flex-1 px-8 py-5 rounded-3xl bg-gray-100 text-secondary font-bold text-center hover:bg-gray-200 transition flex items-center justify-center border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-3" /> Kembali
        </Link>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-[2] bg-primary text-white py-5 rounded-3xl font-black text-lg hover:bg-blue-900 transition shadow-2xl shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
             <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Menyimpan...
             </>
          ) : (
            <>
              <Save className="w-6 h-6 mr-3" /> {isEditing ? "Perbarui Kegiatan & Galeri" : "Publikasikan Kegiatan"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
