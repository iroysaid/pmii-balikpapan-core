"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { NavbarContent } from "@/lib/landing/types";

export default function Navbar({ content }: { content: NavbarContent }) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();
    const role = session?.user?.role;

    const links = [...content.links];

    const isPengurus = ["PENGURUS_KOMISARIAT", "PENGURUS_CABANG", "ADMIN_CABANG", "SUPER_ADMIN"].includes(role as string);

    // Role-Based Additions
    if (session) {
        // Semua user yang login bisa akses modul E-Learning
        links.push({ name: "E-Learning", href: "/materi" });
    }

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const glassShell =
        "border border-white/25 bg-white/15 shadow-[0_18px_50px_rgba(18,37,98,0.18),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl [backdrop-filter:blur(16px)_saturate(160%)] [-webkit-backdrop-filter:blur(16px)_saturate(160%)]";
    const itemBase =
        "relative rounded-full px-4 py-2 text-sm font-semibold text-white/90 transition-all duration-300 hover:scale-[1.02] hover:bg-white/22 hover:text-white hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)]";
    const itemActive =
        "border border-white/30 bg-white/28 text-white shadow-[0_10px_28px_rgba(18,37,98,0.16),inset_0_1px_0_rgba(255,255,255,0.38)]";

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-secondary/86 text-white shadow-lg shadow-secondary/15 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Area */}
                    <Link href="/" className="font-bold text-xl flex items-center gap-3">
                        <div className={`flex items-center space-x-2 rounded-full px-2.5 py-1.5 ${glassShell}`}>
                            {content.logos.map((logo) => (
                                <div key={logo.src} className="relative w-11 h-11">
                                    <Image
                                        src={logo.src}
                                        alt={logo.alt}
                                        fill
                                        sizes="44px"
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-accent text-lg font-extrabold tracking-wide">{content.brandTop}</span>
                            <span className="text-sm tracking-widest font-semibold text-white">{content.brandBottom}</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className={`relative hidden items-center gap-1 rounded-full p-1.5 md:flex ${glassShell}`}>
                        <div className="pointer-events-none absolute inset-x-3 top-1 h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`${itemBase} ${isActive(link.href) ? itemActive : ""}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={isPengurus ? "/dashboard" : "/dashboard/anggota"}
                                className="rounded-full border border-accent/45 bg-accent/88 px-4 py-2 text-sm font-black text-secondary shadow-[0_10px_28px_rgba(245,202,15,0.22)] transition-all duration-300 hover:scale-[1.02] hover:bg-white"
                            >
                                {session.user?.name?.split(' ')[0] || "Akun"}
                            </Link>
                        ) : (
                            <Link
                                href={content.loginLink.href}
                                className={`rounded-full px-4 py-2 text-sm font-black transition-all duration-300 hover:scale-[1.02] ${
                                    isActive(content.loginLink.href)
                                        ? "border border-accent/70 bg-accent text-secondary shadow-[0_10px_28px_rgba(245,202,15,0.24)]"
                                        : "border border-white/25 bg-white/18 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.26)] hover:bg-accent hover:text-secondary"
                                }`}
                            >
                                {content.loginLink.label}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
                            className={`rounded-full p-3 text-white transition-all duration-300 hover:scale-[1.03] hover:bg-white/25 focus:outline-none ${glassShell}`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4">
                    <div className={`relative flex flex-col gap-1.5 rounded-[1.75rem] p-2.5 ${glassShell}`}>
                        <div className="pointer-events-none absolute inset-x-6 top-1 h-px rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/24 ${
                                    isActive(link.href) ? "border border-white/25 bg-white/25 text-white shadow-inner" : "text-white/90"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {session ? (
                            <Link
                                href={isPengurus ? "/dashboard" : "/dashboard/anggota"}
                                onClick={() => setIsOpen(false)}
                                className="rounded-full border border-accent/50 bg-accent/88 px-4 py-3 text-sm font-black text-secondary transition-all duration-300 hover:bg-white"
                            >
                                {session.user?.name}
                            </Link>
                        ) : (
                            <Link
                                href={content.loginLink.href}
                                onClick={() => setIsOpen(false)}
                                className={`rounded-full px-4 py-3 text-sm font-black transition-all duration-300 ${
                                    isActive(content.loginLink.href)
                                        ? "border border-accent/70 bg-accent text-secondary"
                                        : "border border-white/25 bg-white/18 text-white hover:bg-accent hover:text-secondary"
                                }`}
                            >
                                {content.loginLink.label}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
