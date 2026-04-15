"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    LogOut,
    Mail,
    Wallet,
    Globe,
    Menu,
    X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const allMenuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "PENGURUS"] }, // Admin Dashboard
        { name: "Dashboard Anggota", href: "/dashboard/anggota", icon: LayoutDashboard, roles: ["KADER"] }, // Member Dashboard
        { name: "Informasi & Kegiatan", href: "/dashboard/kegiatan", icon: Globe, roles: ["SUPER_ADMIN", "PENGURUS"] },
        { name: "Database Kader", href: "/dashboard/kader", icon: Users, roles: ["SUPER_ADMIN", "PENGURUS"] },
        { name: "Berita / Artikel", href: "/dashboard/berita", icon: FileText, roles: ["SUPER_ADMIN", "PENGURUS", "KADER"] },
        { name: "E-Learning", href: "/dashboard/materi", icon: BookOpen, roles: ["SUPER_ADMIN", "PENGURUS", "KADER"] },
        { name: "Administrasi", href: "/dashboard/surat", icon: Mail, roles: ["SUPER_ADMIN", "PENGURUS"] },
        { name: "Keuangan", href: "/dashboard/keuangan", icon: Wallet, roles: ["SUPER_ADMIN", "PENGURUS"] },
    ];

    const menuItems = allMenuItems.filter(item => !role || item.roles.includes(role));

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40">
                <div className="flex items-center space-x-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/PMII_BPP.png" alt="Logo PMII" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-primary text-sm leading-tight">PMII<br /><span className="text-secondary text-[10px] tracking-widest uppercase opacity-60">Balikpapan</span></span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-secondary hover:bg-gray-50 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Overlay Backdrop */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed h-full z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/PMII_BPP.png" alt="Logo PMII" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-primary text-lg leading-tight">PMII<br /><span className="text-secondary text-xs tracking-widest uppercase opacity-60">Balikpapan</span></span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-secondary hover:bg-gray-50 rounded-lg">
                        <X className="w-6 h-6" />
                    </button>
                </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "/dashboard/anggota" || pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive
                                ? "bg-blue-50 text-primary font-bold"
                                : "text-secondary hover:bg-gray-50 hover:text-primary"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 space-y-1">
                <Link
                    href="/"
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-secondary hover:bg-gray-50 hover:text-primary transition"
                >
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span>Ke Website Utama</span>
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/masuk" })}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                </button>
            </div>
        </aside>
        </>
    );
}
