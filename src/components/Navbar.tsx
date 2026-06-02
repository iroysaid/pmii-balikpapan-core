"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { NavbarContent } from "@/lib/landing/types";
import { isAdminWorkspaceRole } from "@/lib/workspaces";

export default function Navbar({ content }: { content: NavbarContent }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const role = session?.user?.role;

    const links = [...content.links];

    const accountHref = isAdminWorkspaceRole(role) ? "/dashboard" : "/kader";

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
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#262EED]/86 text-white shadow-lg shadow-primary/20 backdrop-blur-xl backdrop-saturate-200">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between md:h-20">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-2 font-bold md:gap-3 md:text-xl">
                        <div className={`flex items-center space-x-1.5 rounded-full px-2 py-1.5 md:space-x-2 md:px-2.5 ${glassShell}`}>
                            {content.logos.map((logo) => (
                                <div key={logo.src} className="relative h-8 w-8 md:h-11 md:w-11">
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
                            <span className="text-base font-extrabold tracking-wide text-accent md:text-lg">{content.brandTop}</span>
                            <span className="text-[11px] font-semibold tracking-widest text-white md:text-sm">{content.brandBottom}</span>
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
                                href={accountHref}
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

                    <div className="md:hidden">
                        {session ? (
                            <Link
                                href={accountHref}
                                className={`inline-flex h-10 items-center rounded-full px-4 text-xs font-black text-white transition active:scale-95 ${glassShell}`}
                            >
                                Akun
                            </Link>
                        ) : (
                            <Link
                                href={content.loginLink.href}
                                className="inline-flex h-10 items-center rounded-full border border-white/35 bg-white/18 px-4 text-xs font-black text-white shadow-sm backdrop-blur-xl transition active:scale-95"
                            >
                                {content.loginLink.label}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
