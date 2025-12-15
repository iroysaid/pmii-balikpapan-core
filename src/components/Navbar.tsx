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

    // Base links for Everyone
    const links = [
        { name: "Home", href: "/" },
        { name: "Profil", href: "/profil" },
        { name: "Berita", href: "/berita" },
        { name: "Galeri", href: "/galeri" },
        { name: "Kontak", href: "/kontak" },
    ];

    // Role-Based Additions
    if (session) {
        // Kader, Pengurus, Admin: Add E-Learning
        links.push({ name: "E-Learning", href: "/learning" });

        // Pengurus & Super Admin: Add Keuangan (Report Page)
        if (role === "PENGURUS" || role === "SUPER_ADMIN") {
            links.push({ name: "Keuangan", href: "/keuangan" });
        }

        // Super Admin Only: Add Dashboard (Editor)
        if (role === "SUPER_ADMIN") {
            links.push({ name: "Dashboard", href: "/dashboard" });
        }
    }

    return (
        <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Area */}
                    <Link href="/" className="font-bold text-xl flex items-center gap-3">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/PMII.png"
                                    alt="Logo PMII"
                                    fill
                                    sizes="48px"
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/PMII_BPP.png"
                                    alt="Logo PMII Balikpapan"
                                    fill
                                    sizes="48px"
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
                    <div className="hidden md:flex space-x-6 items-center">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="hover:text-accent transition duration-200 font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={role === "KADER" ? "/dashboard/member" : "/dashboard"}
                                className="bg-accent text-primary px-4 py-1.5 rounded-full font-bold hover:bg-yellow-400 transition"
                            >
                                {session.user?.name?.split(' ')[0] || "Akun"}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-accent text-primary px-4 py-1.5 rounded-full font-bold hover:bg-yellow-400 transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-primary pb-4">
                    <div className="flex flex-col space-y-2 px-4">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 hover:text-accent transition border-b border-white/10"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={role === "KADER" ? "/dashboard/member" : "/dashboard"}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-accent font-bold"
                            >
                                {session.user?.name}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-accent font-bold"
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
