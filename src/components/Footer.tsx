"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary text-white py-10 mt-auto">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-accent flex items-center space-x-2">
                        {/* Optional: Add Logo here too if desired, keeping simple text for Footer header usually fine or add Image */}
                        <span>PC PMII BALIKPAPAN</span>
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                        Dzikir, Fikir, dan Amal Sholeh.
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="https://www.instagram.com/pmiibalikpapan?igsh=MWxyZGZtd2F4MWh1dA=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-accent transition"
                        >
                            {/* Instagram Icon - simple text or lucide if imported */}
                            Instagram
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4">Tautan Cepat</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/profil" className="hover:text-accent transition">
                                Tentang Kami
                            </Link>
                        </li>
                        <li>
                            <Link href="/berita" className="hover:text-accent transition">
                                Berita Terkini
                            </Link>
                        </li>
                        <li>
                            <Link href="/daftar" className="hover:text-accent transition">
                                Pendaftaran Anggota
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4">Sekretariat</h4>
                    <ul className="text-sm space-y-4 text-white/80">
                        <li>
                            <p className="font-bold text-white mb-1">Alamat:</p>
                            Jl. Ratte Daeng Nai, Kel. Sepinggan Raya, Perum. Balikpapan Kota, Gn. Bahagia, Kec. Balikpapan Selatan, Kota Balikpapan, Kalimantan Timur 76114
                        </li>
                        <li>
                            <a
                                href="https://maps.app.goo.gl/acFYwLwgVrvWUrZY9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline flex items-center"
                            >
                                Lihat di Google Maps
                            </a>
                        </li>
                        <li>Email: pmiibalikpapan@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-xs text-white/65 mt-10 pt-4 border-t border-white/20">
                &copy; 2025 @royhss_id beta version 0.0.0.60
            </div>
        </footer>
    );
}
