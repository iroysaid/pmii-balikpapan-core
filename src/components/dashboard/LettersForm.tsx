"use client";

import { createLetter, updateLetter } from "@/app/actions/surat";
import { ArrowLeft, Save, FileText, Mail } from "lucide-react";
import { useState } from "react";

interface LettersFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function LettersForm({ initialData, isEdit = false }: LettersFormProps) {
    const [type, setType] = useState(initialData?.type || "MASUK");

    const action = isEdit ? updateLetter.bind(null, initialData.id) : createLetter;

    return (
        <form action={action} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
                <label className="block text-sm font-bold text-primary mb-2">Jenis Surat</label>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setType("MASUK")}
                        className={`flex-1 py-3 rounded-lg border flex items-center justify-center font-bold transition ${type === "MASUK" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                    >
                        Surat Masuk
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("KELUAR")}
                        className={`flex-1 py-3 rounded-lg border flex items-center justify-center font-bold transition ${type === "KELUAR" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-secondary hover:bg-gray-50"}`}
                    >
                        Surat Keluar
                    </button>
                </div>
                <input type="hidden" name="type" value={type} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-primary mb-2">Nomor Surat</label>
                    <input type="text" name="number" required defaultValue={initialData?.number} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="No. Surat..." />
                </div>
                <div>
                    <label className="block text-sm font-bold text-primary mb-2">Tanggal Surat</label>
                    <input
                        type="date"
                        name="date"
                        required
                        defaultValue={initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2">Perihal / Subjek</label>
                <input type="text" name="subject" required defaultValue={initialData?.subject} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Perihal surat..." />
            </div>

            {type === "MASUK" ? (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-primary mb-2">Pengirim (Instansi/Orang)</label>
                    <input type="text" name="sender" required defaultValue={initialData?.sender} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Dari siapa..." />
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-primary mb-2">Penerima / Tujuan</label>
                    <input type="text" name="receiver" required defaultValue={initialData?.receiver} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Kepada siapa..." />
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-primary mb-2">Upload File Scan Surat</label>
                <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition" />
                <p className="text-xs text-gray-400 mt-1">Format: PDF atau Gambar. Max 2MB.</p>
                {isEdit && initialData?.fileUrl && (
                    <p className="text-xs text-blue-500 mt-1">File saat ini: <a href={initialData.fileUrl} target="_blank" className="underline">Lihat File</a> (Biarkan kosong jika tidak ingin mengubah)</p>
                )}
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end">
                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center">
                    <Save className="w-4 h-4 mr-2" /> {isEdit ? "Update Arsip" : "Simpan Arsip"}
                </button>
            </div>
        </form>
    );
}
