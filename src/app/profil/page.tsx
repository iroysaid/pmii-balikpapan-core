"use client";

import { Milestone, Target, Users, MapPin } from "lucide-react";

export default function ProfilPage() {
    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 relative">Profil Organisasi</h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto relative px-4">
                    Mengenal lebih dekat Pergerakan Mahasiswa Islam Indonesia Cabang Balikpapan
                </p>
            </div>

            <div className="container mx-auto px-4 mt-[-4rem] relative z-10">
                {/* Top Cards: History, Vision, Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Card Sejarah */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-t-8 border-accent transform hover:-translate-y-2 transition duration-500">
                        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner">
                            <Milestone className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-4">Sejarah Singkat</h3>
                        <p className="text-secondary text-sm leading-relaxed mb-4 text-justify">
                            Pergerakan Mahasiswa Islam Indonesia (PMII) lahir dari kegelisahan mahasiswa Nahdliyin akan peran mahasiswa dalam membangun bangsa dan mempertahankan kedaulatan NKRI.
                        </p>
                        <p className="text-secondary text-sm leading-relaxed text-justify">
                            PC PMII Balikpapan terus bertransformasi menjadi wadah kaderisasi intelektual organik yang kritis dan inovatif di Kota Beriman.
                        </p>
                    </div>

                    {/* Card Visi Misi */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-t-8 border-primary transform hover:-translate-y-2 transition duration-500">
                        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-4">Visi & Misi</h3>
                        <ul className="text-secondary text-sm space-y-3">
                            <li className="flex gap-2">
                                <span className="text-accent font-bold">•</span>
                                <span>Terbentuknya pribadi muslim Indonesia yang bertaqwa kepada Allah SWT.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-accent font-bold">•</span>
                                <span>Berbudi luhur, berilmu, cakap, dan bertanggung jawab.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-accent font-bold">•</span>
                                <span>Mengamalkan nilai-nilai Ahlussunnah wal Jamaah.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Card Nilai Dasar */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-t-8 border-accent transform hover:-translate-y-2 transition duration-500">
                        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-4">Nilai Dasar (NDP)</h3>
                        <p className="text-secondary text-sm leading-relaxed text-justify">
                            Tauhid, Habluminallah, Habluminannas, dan Habluminalalam. Empat pilar utama yang menjadi landasan filosofis setiap kader dalam bergerak dan berkontribusi.
                        </p>
                    </div>
                </div>

                {/* Struktur Organisasi Section */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">Struktur Pengurus Cabang</h2>
                        <div className="w-20 h-2 bg-accent mx-auto rounded-full"></div>
                    </div>
                    <div className="flex justify-center">
                        <div className="bg-white p-12 rounded-[3rem] shadow-lg border border-gray-100 max-w-5xl w-full text-center py-24 text-gray-400 border-dashed border-2">
                           <Users className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                           <p className="text-xl font-bold text-gray-400">[Diagram Struktur Organisasi]</p>
                           <p className="text-gray-300 mt-2">Data pengurus sedang dalam proses digitalisasi</p>
                        </div>
                    </div>
                </div>

                {/* Lokasi Sekretariat Section */}
                <div>
                    <div className="text-center mb-12 uppercase tracking-tighter">
                        <h4 className="text-accent font-black text-sm mb-2">Hubungi & Kunjungi Kami</h4>
                        <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">Lokasi Sekretariat</h2>
                        <div className="w-24 h-2 bg-primary/10 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden h-[550px] group relative focus-within:ring-4 focus-within:ring-primary/5 transition-all outline-none">
                        <iframe
                            src="https://maps.google.com/maps?q=-1.250806,116.888083&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: '2rem' }}
                            allowFullScreen={true}
                            loading="lazy"
                            title="Peta Lokasi Sekretariat PMII Balikpapan"
                            className="grayscale-[0.1] contrast-[1.05] hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                        
                        {/* Interactive "JS/Popup" style overlay or detail */}
                        <div className="absolute bottom-10 left-10 right-10 md:right-auto md:w-80 bg-white/95 backdrop-blur shadow-2xl p-6 rounded-3xl border border-gray-100 transform translate-y-2 group-hover:translate-y-0 transition duration-500">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary p-3 rounded-2xl text-white">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="font-black text-primary mb-1 text-sm">Alamat Lengkap</h5>
                                    <p className="text-xs text-secondary leading-relaxed">
                                        Jl. Ratte Daeng Nai, Sepinggan Raya, Balikpapan Selatan, Kota Balikpapan, 76114
                                    </p>
                                    <a 
                                        href="https://maps.app.goo.gl/acFYwLwgVrvWUrZY9" 
                                        target="_blank" 
                                        rel="noopener" 
                                        className="inline-block mt-3 text-[10px] font-black uppercase text-accent hover:text-primary transition"
                                    >
                                        Buka di Google Maps →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
