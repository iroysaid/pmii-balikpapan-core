"use client";

import { createKader, updateKader } from "@/app/actions/kader";
import { ArrowLeft, Edit, Save } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";

const KOMISARIAT_DATA: Record<string, string[]> = {
    "Komisariat UNIBA": ["Universitas Balikpapan"],
    "Komisariat NUsantara": ["Institut Teknologi Kalimantan", "Politeknik Balikpapan", "LP3I", "STIMIK", "Universitas Terbuka"],
    "Komisariat STITBA": ["Sekolah Tinggi Ilmu Tarbiyah Balikpapan"],
    "Komisariat Mulia": ["Universitas Mulia"],
    "Komisariat STAIBA": ["STAI Balikpapan"]
};

interface KaderFormProps {
    initialData?: any; // Using any for simplicity in rapid dev, ideally proper type
    isEdit?: boolean;
    isSuperAdmin?: boolean;
    customAction?: (formData: FormData) => Promise<void>;
    submitLabel?: string;
}

export default function KaderForm({ initialData, isEdit = false, isSuperAdmin = false, customAction, submitLabel }: KaderFormProps) {
    const defaultAction = isEdit ? updateKader.bind(null, initialData?.id) : createKader;
    const action = customAction || defaultAction;

    const [selectedKomisariat, setSelectedKomisariat] = useState<string>(initialData?.kaderProfile?.komisariat || "");

    const availableCampuses = useMemo(() => {
        return selectedKomisariat ? KOMISARIAT_DATA[selectedKomisariat] || [] : [];
    }, [selectedKomisariat]);

    // Helper to format date for input
    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };

    return (
        <form action={action} className="space-y-8">
            {/* Account Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">Informasi Akun</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            required
                            defaultValue={initialData?.name}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Nama sesuai KTP"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            defaultValue={initialData?.email}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="email@contoh.com"
                        />
                    </div>
                    {isSuperAdmin && (
                        <div>
                            <label className="block text-sm font-bold text-primary mb-2">Role Pengguna</label>
                            <select
                                name="role"
                                defaultValue={initialData?.role || "KADER"}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="KADER">KADER</option>
                                <option value="PENGURUS">PENGURUS</option>
                                <option value="SUPER_ADMIN">SUPER ADMIN</option>
                            </select>
                        </div>
                    )}
                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-bold text-primary mb-2">Password Default</label>
                            <input
                                type="password"
                                name="password"
                                required
                                defaultValue="12345678"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <p className="text-xs text-gray-400 mt-1">Default: 12345678</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Foto Profil</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition"
                        />
                        {isEdit && initialData?.image && (
                            <p className="text-xs text-blue-500 mt-1">Biarkan kosong jika tidak ingin mengubah foto saat ini.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Personal & Academic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">Data Diri & Akademik</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Komisariat Dropdown */}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Komisariat</label>
                        <select
                            name="komisariat"
                            value={selectedKomisariat}
                            onChange={(e) => setSelectedKomisariat(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="">Pilih Komisariat</option>
                            {Object.keys(KOMISARIAT_DATA).map((k) => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kampus Dropdown - Dependent on Komisariat */}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Asal Kampus</label>
                        <select
                            name="campus"
                            required
                            defaultValue={initialData?.kaderProfile?.campus}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="">Pilih Kampus</option>
                            {availableCampuses.map((campus) => (
                                <option key={campus} value={campus}>{campus}</option>
                            ))}
                        </select>
                    </div>

                    {/* Prodi / Fakultas */}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Prodi / Fakultas</label>
                        <input
                            type="text"
                            name="major"
                            required
                            defaultValue={initialData?.kaderProfile?.major}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Hukum / Teknik Sipil"
                        />
                    </div>

                    {/* NIA */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Induk Anggota (NIA)</label>
                        <input
                            type="text"
                            name="noInduk"
                            defaultValue={initialData?.kaderProfile?.noInduk || ""}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${!isEdit ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "border-gray-200"}`}
                            placeholder={!isEdit ? "Auto-generated by system" : "NIA"}
                            readOnly={!isEdit}
                        />
                        {!isEdit && <p className="text-xs text-gray-500 mt-1">NIA akan dibuat otomatis oleh sistem.</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Tahun MAPABA</label>
                        <input
                            type="number"
                            name="mapabaYear"
                            required
                            defaultValue={initialData?.kaderProfile?.mapabaYear}
                            placeholder="2023"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Nomor HP / WA</label>
                        <input
                            type="tel"
                            name="phone"
                            defaultValue={initialData?.kaderProfile?.phone}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="08..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Tempat Lahir</label>
                        <input
                            type="text"
                            name="placeOfBirth"
                            defaultValue={initialData?.kaderProfile?.birthPlace}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Tanggal Lahir</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            defaultValue={formatDate(initialData?.kaderProfile?.birthDate)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-bold text-primary mb-2">Alamat Lengkap</label>
                    <textarea
                        name="address"
                        rows={3}
                        defaultValue={initialData?.kaderProfile?.address}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center shadow-lg"
                >
                    {isEdit ? <Edit className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {submitLabel || (isEdit ? "Update Data Kader" : "Simpan Data Kader")}
                </button>
            </div>
        </form>
    );
}
