"use client";

import { createKader, updateKader } from "@/app/actions/kader";
import { ArrowLeft, Edit, Save, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const KOMISARIAT_DATA: Record<string, string[] | string> = {
    "Komisariat Uniba":      "Universitas Balikpapan",
    "Komisariat Nusantara": ["Institut Teknologi Kalimantan", "Politeknik Balikpapan", "LP3I College Balikpapan", "STMIK Borneo", "Universitas Terbuka"],
    "Komisariat Stitba":     "Sekolah Tinggi Ilmu Tarbiyah Balikpapan",
    "Komisariat Mulia":      "Universitas Mulia",
    "Komisariat Staiba":     "Sekolah Tinggi Agama Islam Balikpapan"
};

interface KaderFormProps {
    initialData?: any; 
    isEdit?: boolean;
    isSuperAdmin?: boolean;
    customAction?: (formData: FormData) => Promise<any>;
    submitLabel?: string;
}

export default function KaderForm({ initialData, isEdit = false, isSuperAdmin = false, customAction, submitLabel }: KaderFormProps) {
    const router = useRouter();
    const defaultAction = isEdit ? updateKader.bind(null, initialData?.id) : createKader;
    const action = customAction || defaultAction;

    const AUTO_CAMPUS: Record<string, string> = {
        "Komisariat Uniba":  "Universitas Balikpapan",
        "Komisariat Stitba": "Sekolah Tinggi Ilmu Tarbiyah Balikpapan",
        "Komisariat Mulia":  "Universitas Mulia",
        "Komisariat Staiba": "Sekolah Tinggi Agama Islam Balikpapan"
    };

    const initKomisariat = initialData?.kaderProfile?.komisariat || "";
    const initCampus = initialData?.kaderProfile?.campus ||
        (initKomisariat && initKomisariat !== "Komisariat Nusantara" ? AUTO_CAMPUS[initKomisariat] || "" : "");

    const [selectedKomisariat, setSelectedKomisariat] = useState<string>(initKomisariat);
    const [selectedCampus, setSelectedCampus] = useState<string>(initCampus);
    const [isLoading, setIsLoading] = useState(false);

    const [otherTrainings, setOtherTrainings] = useState<any[]>(() => {
        if (initialData?.kaderProfile?.otherTraining) {
            try {
                return JSON.parse(initialData.kaderProfile.otherTraining);
            } catch (e) { return []; }
        }
        return [];
    });

    const addTraining = () => {
        setOtherTrainings([...otherTrainings, { name: "", year: "", location: "", organizer: "" }]);
    };
    const updateTraining = (index: number, field: string, value: string) => {
        const newT = [...otherTrainings];
        newT[index][field] = value;
        setOtherTrainings(newT);
    };
    const removeTraining = (index: number) => {
        setOtherTrainings(otherTrainings.filter((_, i) => i !== index));
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [passwordGenerated, setPasswordGenerated] = useState(false);

    const handleResetPassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let res = "";
        for (let i = 0; i < 4; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (passwordRef.current) {
            passwordRef.current.value = res;
            setPasswordGenerated(true);
            setTimeout(() => setPasswordGenerated(false), 3000);
        }
    };
    const [resultData, setResultData] = useState<{username: string, password: string, noInduk: string} | null>(null);

    const isNusantara = selectedKomisariat === "Komisariat Nusantara";
    const nusantaraCampuses = [
        "Institut Teknologi Kalimantan",
        "Politeknik Balikpapan",
        "LP3I College Balikpapan",
        "STMIK Borneo",
        "Universitas Terbuka"
    ];

    const handleKomisariatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const k = e.target.value;
        setSelectedKomisariat(k);
        if (k !== "Komisariat Nusantara" && AUTO_CAMPUS[k]) {
            setSelectedCampus(AUTO_CAMPUS[k]);
        } else {
            setSelectedCampus("");
        }
    };

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            const res = await action(formData);
            // For edit mode, server redirects directly — res may be undefined or error
            if (res && !res.success) {
                alert("Gagal menyimpan: " + res.error);
                setIsSubmitting(false);
            } else if (res && res.success && !isEdit && !customAction) {
                // Create mode: show credentials
                setResultData({
                    username: res.username,
                    password: res.generatedPassword,
                    noInduk: res.noInduk
                });
                setIsSubmitting(false);
            }
            // Edit mode success: server redirect handles navigation
        } catch (error: any) {
            // Ignore NEXT_REDIRECT errors as they are part of the normal redirect flow
            if (error.message === "NEXT_REDIRECT") {
                return;
            }
            alert("Terjadi kesalahan: " + error.message);
            setIsSubmitting(false);
        }
    };

    if (resultData) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-green-200 text-center max-w-2xl mx-auto">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-700 mb-2">Kader Berhasil Ditambahkan!</h2>
                <p className="text-gray-600 mb-6">Berikut adalah detail login untuk kader baru. <strong>Harap simpan atau salin password ini sekarang</strong>, karena tidak akan ditampilkan lagi.</p>
                
                <div className="bg-gray-50 rounded-lg p-6 text-left border border-gray-200 mb-6 space-y-3">
                    <div>
                        <span className="block text-sm text-gray-500">Nomor Induk / NIA</span>
                        <span className="font-mono text-lg font-bold">{resultData.noInduk}</span>
                    </div>
                    <div>
                        <span className="block text-sm text-gray-500">Username</span>
                        <span className="font-mono text-lg font-bold">{resultData.username}</span>
                    </div>
                    <div>
                        <span className="block text-sm text-gray-500">Password Awal</span>
                        <span className="font-mono text-xl font-bold text-blue-600">{resultData.password}</span>
                    </div>
                </div>

                <Link href="/dashboard/kader" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition">
                    Kembali ke Daftar Kader
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
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
                            placeholder="Contoh: Budi Widodo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            defaultValue={initialData?.username}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: wongsolo24"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Email (Opsional)</label>
                        <input
                            type="email"
                            name="email"
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
                                <option value="PENGURUS_KOMISARIAT">PENGURUS KOMISARIAT</option>
                                <option value="PENGURUS_CABANG">PENGURUS CABANG</option>
                                <option value="ADMIN_CABANG">ADMIN CABANG</option>
                                <option value="SUPER_ADMIN">SUPER ADMIN</option>
                            </select>
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
                    {isEdit && isSuperAdmin && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-primary">Password Baru</label>
                                <button 
                                    type="button" 
                                    onClick={handleResetPassword}
                                    className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-200 font-bold hover:bg-orange-100 transition"
                                >
                                    Reset Password
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="password"
                                    ref={passwordRef}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Kosongkan jika tidak ingin diubah"
                                />
                                {passwordGenerated && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 bg-white px-1">
                                        Password baru dibuat!
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-orange-600 mt-1">* Jika diisi, kader wajib mengganti password saat login berikutnya.</p>
                        </div>
                    )}
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
                            onChange={handleKomisariatChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="">Pilih Komisariat</option>
                            {Object.keys(KOMISARIAT_DATA).map((k) => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>
                    </div>

                    {/* Asal Kampus */}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Asal Kampus</label>
                        {isNusantara ? (
                            <select
                                name="campus"
                                value={selectedCampus}
                                onChange={(e) => setSelectedCampus(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                <option value="">-- Pilih Kampus --</option>
                                {nusantaraCampuses.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        ) : (
                            <>
                                <input
                                    type="hidden"
                                    name="campus"
                                    value={selectedCampus}
                                    readOnly
                                />
                                <input
                                    type="text"
                                    readOnly
                                    value={selectedCampus}
                                    onChange={() => {}}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                    placeholder="Otomatis sesuai Komisariat"
                                />
                            </>
                        )}
                    </div>

                    {/* Fakultas */}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Fakultas</label>
                        <input
                            type="text"
                            name="faculty"
                            defaultValue={initialData?.kaderProfile?.faculty}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Fakultas Hukum"
                        />
                    </div>

                    {/* Prodi / Jurusan */}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Prodi / Jurusan</label>
                        <input
                            type="text"
                            name="major"
                            defaultValue={initialData?.kaderProfile?.major}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Ilmu Hukum"
                        />
                    </div>

                    {/* Alamat Kampus */}
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Alamat Kampus</label>
                        <input
                            type="text"
                            name="campusAddress"
                            defaultValue={initialData?.kaderProfile?.campusAddress}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Jl. Soekarno Hatta KM 15, Karang Joang (Gunakan alamat resmi kampus)"
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
                            placeholder="Contoh: 081234567890"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Tempat Lahir</label>
                        <input
                            type="text"
                            name="placeOfBirth"
                            defaultValue={initialData?.kaderProfile?.birthPlace}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Balikpapan"
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
                        placeholder="Contoh: Jl. Marsma R. Iswahyudi No. 123, RT 05, Kelurahan Sepinggan, Kecamatan Balikpapan Selatan"
                    ></textarea>
                </div>
            </div>

            {/* Riwayat Pengkaderan Formal */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">Riwayat Pelatihan Kader (Opsional)</h2>
                
                {/* PKD */}
                <h3 className="font-semibold text-secondary mb-3 mt-4">Pelatihan Kader Dasar (PKD)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Tahun PKD</label>
                        <select
                            name="pkdYear"
                            defaultValue={initialData?.kaderProfile?.pkdYear || ""}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="">-- Pilih Tahun --</option>
                            {Array.from({ length: 2045 - 1990 + 1 }, (_, i) => 2045 - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Lokasi PKD</label>
                        <input
                            type="text"
                            name="pkdLocation"
                            defaultValue={initialData?.kaderProfile?.pkdLocation}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Balikpapan"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Penyelenggara PKD</label>
                        <input
                            type="text"
                            name="pkdOrganizer"
                            defaultValue={initialData?.kaderProfile?.pkdOrganizer}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: PC PMII Balikpapan"
                        />
                    </div>
                </div>

                {/* PKL */}
                <h3 className="font-semibold text-secondary mb-3 mt-6">Pelatihan Kader Lanjut (PKL)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Tahun PKL</label>
                        <select
                            name="pklYear"
                            defaultValue={initialData?.kaderProfile?.pklYear || ""}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="">-- Pilih Tahun --</option>
                            {Array.from({ length: 2045 - 1990 + 1 }, (_, i) => 2045 - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Lokasi PKL</label>
                        <input
                            type="text"
                            name="pklLocation"
                            defaultValue={initialData?.kaderProfile?.pklLocation}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Samarinda"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Penyelenggara PKL</label>
                        <input
                            type="text"
                            name="pklOrganizer"
                            defaultValue={initialData?.kaderProfile?.pklOrganizer}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: PKC PMII Kaltim"
                        />
                    </div>
                </div>

                {/* PKN */}
                <h3 className="font-semibold text-secondary mb-3 mt-6">Pelatihan Kader Nasional (PKN)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Tahun PKN</label>
                        <select
                            name="pknYear"
                            defaultValue={initialData?.kaderProfile?.pknYear || ""}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="">-- Pilih Tahun --</option>
                            {Array.from({ length: 2045 - 1990 + 1 }, (_, i) => 2045 - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Lokasi PKN</label>
                        <input
                            type="text"
                            name="pknLocation"
                            defaultValue={initialData?.kaderProfile?.pknLocation}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: Jakarta"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Penyelenggara PKN</label>
                        <input
                            type="text"
                            name="pknOrganizer"
                            defaultValue={initialData?.kaderProfile?.pknOrganizer}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Contoh: PB PMII"
                        />
                    </div>
                </div>

                {/* Other Trainings (Dynamic) */}
                <div className="mt-8 border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-secondary">Pelatihan / Kaderisasi Lainnya</h3>
                        <button type="button" onClick={addTraining} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center">
                            <span className="mr-1">+</span> Tambah Pelatihan
                        </button>
                    </div>
                    <input type="hidden" name="otherTraining" value={JSON.stringify(otherTrainings)} />
                    
                    <div className="space-y-4">
                        {otherTrainings.map((t, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                <button type="button" onClick={() => removeTraining(index)} className="absolute top-2 right-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-md">
                                    Hapus
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-primary mb-1">Nama Pelatihan</label>
                                        <input type="text" value={t.name} onChange={(e) => updateTraining(index, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm" placeholder="Contoh: PKPN" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-primary mb-1">Tahun</label>
                                        <input type="text" value={t.year} onChange={(e) => updateTraining(index, 'year', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm" placeholder="Contoh: 2024" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-primary mb-1">Lokasi</label>
                                        <input type="text" value={t.location} onChange={(e) => updateTraining(index, 'location', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm" placeholder="Contoh: Surabaya" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-primary mb-1">Penyelenggara</label>
                                        <input type="text" value={t.organizer} onChange={(e) => updateTraining(index, 'organizer', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm" placeholder="Contoh: PB PMII" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {otherTrainings.length === 0 && (
                            <div className="text-center text-sm text-gray-400 py-4 border-2 border-dashed border-gray-200 rounded-xl">
                                Belum ada pelatihan tambahan. Klik &quot;Tambah Pelatihan&quot; jika ada.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center shadow-lg disabled:opacity-50"
                >
                    {isEdit ? <Edit className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSubmitting ? "Menyimpan..." : (submitLabel || (isEdit ? "Update Data Kader" : "Simpan Data Kader"))}
                </button>
            </div>
        </form>
    );
}
