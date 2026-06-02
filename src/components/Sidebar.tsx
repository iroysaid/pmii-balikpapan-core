"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    BookOpen,
    ChevronDown,
    FileText,
    Globe,
    Images,
    LayoutDashboard,
    LogOut,
    Newspaper,
    Settings,
    Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { hasAccess } from "@/lib/permissions/defaults";
import { getRolePermissions } from "@/lib/permissions/routes";
import type { DashboardPermissionKey } from "@/lib/permissions/types";

const cmsMenuItems = [
    { name: "Homepage", href: "/dashboard/landing", icon: Globe, permission: "cmsHomepage" },
    { name: "Profil", href: "/dashboard/profil", icon: FileText, permission: "cmsProfil" },
    { name: "Pengurus", href: "/dashboard/pengurus", icon: Users, permission: "cmsPengurus" },
];

const dashboardMenuItems = [
    { name: "User & Role", href: "/dashboard/kader", icon: Users, permission: "userRole" },
    { name: "Agenda", href: "/dashboard/kegiatan", icon: Globe, permission: "agenda" },
    { name: "Berita", href: "/dashboard/berita", icon: Newspaper, permission: "berita" },
    { name: "Galeri", href: "/dashboard/galeri", icon: Images, permission: "galeri" },
    { name: "Learning Management", href: "/dashboard/materi", icon: BookOpen, permission: "elearning" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, permission: "settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const rolePermissions = getRolePermissions(session?.user?.role);
    const permissions = session?.user?.permissions || rolePermissions;
    const canAccess = (permission: DashboardPermissionKey) =>
        hasAccess(permissions[permission], permission === "settings" ? "full" : "view");
    const visibleCmsItems = cmsMenuItems.filter((item) =>
        canAccess(item.permission as DashboardPermissionKey)
    );
    const visibleDashboardItems = dashboardMenuItems.filter((item) =>
        item.permission === "settings"
            ? session?.user?.role === "SUPER_ADMIN"
            : canAccess(item.permission as DashboardPermissionKey)
    );
    const isCmsActive = cmsMenuItems.some((item) => pathname === item.href.split("?")[0]);
    const [isCmsManuallyOpen, setIsCmsManuallyOpen] = useState(false);
    const isCmsOpen = isCmsActive || isCmsManuallyOpen;

    const canSeeDashboardMenu = canAccess("dashboard");

    return (
            <aside className="fixed z-50 hidden h-full min-h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:flex md:w-56 lg:w-64">
                <div className="flex items-center justify-between border-b border-gray-100 p-5 lg:p-6">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image
                            src="/PMII_BPP.png"
                            alt="Logo PMII"
                            width={40}
                            height={40}
                            className="h-10 w-10 shrink-0 object-contain"
                        />
                        <span className="text-base font-bold leading-tight text-primary lg:text-lg">
                            PMII<br />
                            <span className="text-[11px] uppercase tracking-widest text-secondary/60 lg:text-xs">Balikpapan</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto p-3 lg:p-4">
                    <Link
                        href="/dashboard"
                        className={`flex items-center space-x-3 rounded-xl px-3 py-3 text-sm font-medium transition lg:px-4 ${
                            pathname === "/dashboard"
                                ? "bg-blue-50 font-bold text-primary"
                                : "text-secondary hover:bg-gray-50 hover:text-primary"
                        }`}
                    >
                        <LayoutDashboard className={`h-5 w-5 shrink-0 ${pathname === "/dashboard" ? "text-primary" : "text-gray-400"}`} />
                        <span>Dashboard</span>
                    </Link>

                    {canSeeDashboardMenu && (
                        <>
                            {visibleCmsItems.length > 0 && (
                            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-1">
                                <button
                                    type="button"
                                    onClick={() => setIsCmsManuallyOpen((value) => !value)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition lg:px-4 ${
                                        isCmsActive ? "bg-primary text-white shadow-sm" : "text-secondary hover:bg-white hover:text-primary"
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Globe className={`h-5 w-5 ${isCmsActive ? "text-accent" : "text-gray-400"}`} />
                                        CMS
                                    </span>
                                    <ChevronDown className={`h-4 w-4 transition ${isCmsOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isCmsOpen && (
                                    <div className="mt-1 space-y-1 p-1">
                                        {visibleCmsItems.map((item) => {
                                            const Icon = item.icon;
                                            const itemPath = item.href.split("?")[0];
                                            const isActive = pathname === itemPath;

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                                        isActive
                                                            ? "bg-white font-black text-primary shadow-sm"
                                                            : "text-secondary hover:bg-white hover:text-primary"
                                                    }`}
                                                >
                                                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`} />
                                                    <span className="leading-snug">{item.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            )}

                            {visibleDashboardItems.map((item) => {
                                const Icon = item.icon;
                                const itemPath = item.href.split("?")[0];
                                const isActive = pathname === itemPath;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition lg:px-4 ${
                                            isActive
                                                ? "bg-blue-50 font-bold text-primary"
                                                : "text-secondary hover:bg-gray-50 hover:text-primary"
                                        }`}
                                    >
                                        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-gray-400"}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </nav>

                <div className="space-y-1 border-t border-gray-100 p-3 lg:p-4">
                    <Link
                        href="/"
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-secondary transition hover:bg-gray-50 hover:text-primary lg:px-4"
                    >
                        <Globe className="h-5 w-5 shrink-0 text-gray-400" />
                        <span>Ke Website Utama</span>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/masuk" })}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 lg:px-4"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>
    );
}
