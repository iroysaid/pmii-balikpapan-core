"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const role = session?.user?.role;

    // Base links for Everyone (Public)
    const links = [
        { name: "Beranda", href: "/" },
        { name: "Profil", href: "/profil" },
        { name: "Agenda", href: "/kegiatan" },
        { name: "Berita", href: "/berita" },
        { name: "Galeri", href: "/galeri" },
    ];

    const isPengurus = ["PENGURUS_KOMISARIAT", "PENGURUS_CABANG", "ADMIN_CABANG", "SUPER_ADMIN"].includes(role as string);

    // Role-Based Additions
    if (session) {
        // Semua user yang login bisa akses modul E-Learning
        links.push({ name: "E-Learning", href: "/materi" });
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-accent/35 bg-secondary text-white shadow-lg shadow-secondary/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Area */}
                    <Link href="/" className="font-bold text-xl flex items-center gap-3">
                        <div className="flex items-center space-x-2 rounded-2xl bg-white px-2 py-1 shadow-sm ring-1 ring-accent/35">
                            <div className="relative w-11 h-11">
                                <Image
                                    src="/PB_PMII.png"
                                    alt="Logo PMII"
                                    fill
                                    sizes="44px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative w-11 h-11">
                                <Image
                                    src="/PMII_BPP.png"
                                    alt="Logo PMII Balikpapan"
                                    fill
                                    sizes="44px"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-accent text-lg font-extrabold tracking-wide">PC PMII</span>
                            <span className="text-sm tracking-widest font-semibold text-white">BALIKPAPAN</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-1 items-center rounded-full bg-white/10 p-1 backdrop-blur">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="rounded-full px-4 py-2 font-medium text-white transition duration-200 hover:bg-white hover:text-secondary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={isPengurus ? "/dashboard" : "/dashboard/anggota"}
                                className="bg-accent text-secondary px-4 py-2 rounded-full font-bold hover:bg-white transition"
                            >
                                {session.user?.name?.split(' ')[0] || "Akun"}
                            </Link>
                        ) : (
                            <Link
                                href="/masuk"
                                className="bg-accent text-secondary px-4 py-2 rounded-full font-bold hover:bg-white transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white hover:text-secondary focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-accent/30 bg-secondary pb-4 shadow-xl shadow-secondary/20">
                    <div className="flex flex-col space-y-2 px-4">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-xl px-3 py-3 transition hover:bg-white hover:text-secondary border-b border-white/10"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={isPengurus ? "/dashboard" : "/dashboard/anggota"}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-xl px-3 py-3 text-accent font-bold hover:bg-white hover:text-secondary"
                            >
                                {session.user?.name}
                            </Link>
                        ) : (
                            <Link
                                href="/masuk"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-xl px-3 py-3 text-accent font-bold hover:bg-white hover:text-secondary"
                            >
                                Login Area
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
