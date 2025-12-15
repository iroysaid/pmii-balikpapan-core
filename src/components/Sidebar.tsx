"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    LogOut,
    Mail,
    Wallet,
    Globe
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    const allMenuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "PENGURUS"] }, // Admin Dashboard
        { name: "Dashboard Anggota", href: "/dashboard/member", icon: LayoutDashboard, roles: ["KADER"] }, // Member Dashboard
        { name: "Database Kader", href: "/dashboard/kader", icon: Users, roles: ["SUPER_ADMIN", "PENGURUS"] },
        { name: "Berita / Artikel", href: "/dashboard/posts", icon: FileText, roles: ["SUPER_ADMIN", "PENGURUS", "KADER"] },
        { name: "E-Learning", href: "/dashboard/learning", icon: BookOpen, roles: ["SUPER_ADMIN", "PENGURUS", "KADER"] },
        { name: "Administrasi", href: "/dashboard/surat", icon: Mail, roles: ["SUPER_ADMIN", "PENGURUS"] },
        { name: "Keuangan", href: "/dashboard/finance", icon: Wallet, roles: ["SUPER_ADMIN", "PENGURUS"] },
    ];

    const menuItems = allMenuItems.filter(item => !role || item.roles.includes(role));

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col hidden md:flex fixed h-full z-10">
            <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
                <div className="bg-primary w-8 h-8 rounded-lg"></div>
                <span className="font-bold text-primary text-lg">PMII Internal</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href !== "/dashboard/member" || pathname === item.href;
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
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                </button>
            </div>
        </aside>
    );
}
