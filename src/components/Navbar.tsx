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
        <nav className="sticky top-0 z-50 border-b border-white/15 bg-primary text-white shadow-lg shadow-primary/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Area */}
                    <Link href="/" className="font-bold text-xl flex items-center gap-3">
                        <div className="flex items-center space-x-2 rounded-2xl bg-white/95 px-2 py-1 shadow-sm">
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
                            <span className="text-sm tracking-widest font-semibold">BALIKPAPAN</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-1 items-center rounded-full bg-white/10 p-1 backdrop-blur">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="rounded-full px-4 py-2 font-medium transition duration-200 hover:bg-white hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={isPengurus ? "/dashboard" : "/dashboard/anggota"}
                                className="bg-accent text-primary px-4 py-2 rounded-full font-bold hover:bg-white transition"
                            >
                                {session.user?.name?.split(' ')[0] || "Akun"}
                            </Link>
                        ) : (
                            <Link
                                href="/masuk"
                                className="bg-accent text-primary px-4 py-2 rounded-full font-bold hover:bg-white transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 bg-primary pb-4 shadow-xl shadow-primary/20">
                    <div className="flex flex-col space-y-2 px-4">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-xl px-3 py-3 transition hover:bg-white hover:text-primary border-b border-white/10"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={isPengurus ? "/dashboard" : "/dashboard/anggota"}
                                onClick={() => setIsOpen(false)}
                                className="block rounded-xl px-3 py-3 text-accent font-bold hover:bg-white hover:text-primary"
                            >
                                {session.user?.name}
                            </Link>
                        ) : (
                            <Link
                                href="/masuk"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-xl px-3 py-3 text-accent font-bold hover:bg-white hover:text-primary"
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
