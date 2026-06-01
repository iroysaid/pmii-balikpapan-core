"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  FileText,
  Gauge,
  Globe,
  Images,
  Newspaper,
  Settings,
  Users,
  X,
} from "lucide-react";

import { hasAccess } from "@/lib/permissions/defaults";
import type {
  AccessLevel,
  DashboardPermissionKey,
} from "@/lib/permissions/types";

type DashboardMobileNavProps = {
  role?: string | null;
  permissions?: Partial<Record<DashboardPermissionKey, AccessLevel>>;
};

const cmsItems = [
  { label: "Homepage", href: "/dashboard/landing", icon: Globe, permission: "cmsHomepage" },
  { label: "Profil", href: "/dashboard/profil", icon: FileText, permission: "cmsProfil" },
  { label: "Pengurus", href: "/dashboard/pengurus", icon: Users, permission: "cmsPengurus" },
] as const;

const moreItems = [
  { label: "Galeri", href: "/dashboard/galeri", icon: Images, permission: "galeri" },
  { label: "E-Learning", href: "/dashboard/materi", icon: BookOpen, permission: "elearning" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, permission: "settings" },
] as const;

export default function DashboardMobileNav({
  role,
  permissions,
}: DashboardMobileNavProps) {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<"cms" | "more" | null>(null);
  const can = (permission: DashboardPermissionKey, minimum: AccessLevel = "view") =>
    hasAccess(permissions?.[permission], minimum);

  const visibleCmsItems = cmsItems.filter((item) => can(item.permission));
  const visibleMoreItems = moreItems.filter((item) =>
    item.permission === "settings" ? role === "SUPER_ADMIN" : can(item.permission)
  );

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Gauge, active: pathname === "/dashboard" },
    { label: "CMS", action: () => setSheet("cms"), icon: Globe, active: pathname.startsWith("/dashboard/landing") || pathname.startsWith("/dashboard/profil") || pathname.startsWith("/dashboard/pengurus"), hidden: visibleCmsItems.length === 0 },
    { label: "Berita", href: "/dashboard/berita", icon: Newspaper, active: pathname.startsWith("/dashboard/berita"), hidden: !can("berita") },
    { label: "Agenda", href: "/dashboard/kegiatan", icon: CalendarDays, active: pathname.startsWith("/dashboard/kegiatan"), hidden: !can("agenda") },
    { label: "Lainnya", action: () => setSheet("more"), icon: ChevronDown, active: pathname.startsWith("/dashboard/galeri") || pathname.startsWith("/dashboard/materi") || pathname.startsWith("/dashboard/settings"), hidden: visibleMoreItems.length === 0 },
  ].filter((item) => !item.hidden);

  const sheetItems = sheet === "cms" ? visibleCmsItems : visibleMoreItems;

  return (
    <>
      {sheet && (
        <div className="fixed inset-0 z-50 bg-secondary/40 backdrop-blur-sm md:hidden" onClick={() => setSheet(null)}>
          <div
            className="absolute inset-x-3 bottom-24 rounded-[2rem] border border-white/40 bg-white/88 p-4 shadow-[0_24px_80px_rgba(18,37,98,0.28)] backdrop-blur-2xl backdrop-saturate-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                  {sheet === "cms" ? "CMS" : "Menu Lainnya"}
                </p>
                <h2 className="text-lg font-black text-secondary">
                  {sheet === "cms" ? "Konten Statis" : "Modul Dashboard"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSheet(null)}
                className="rounded-full bg-primary/10 p-2 text-primary active:scale-95"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-2">
              {sheetItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSheet(null)}
                    className={`flex min-h-14 items-center gap-3 rounded-2xl px-4 font-black transition active:scale-[0.98] ${
                      active
                        ? "bg-primary text-white"
                        : "bg-blue-50 text-primary hover:bg-blue-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-3 left-2 right-2 z-50 w-auto md:hidden">
        <div
          className="mx-auto grid w-full max-w-md items-center rounded-full border border-white/45 bg-[#262EED]/24 px-1 py-1.5 shadow-[0_18px_60px_rgba(18,37,98,0.28)] backdrop-blur-2xl backdrop-saturate-200 [-webkit-backdrop-filter:blur(18px)_saturate(190%)]"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const className = `flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center rounded-full px-0.5 text-[8.5px] font-black transition active:scale-95 min-[375px]:text-[9.5px] ${
              item.active ? "bg-white text-primary shadow-[0_10px_30px_rgba(38,46,237,0.22)]" : "text-white hover:bg-white/16"
            }`;

            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={className}>
                  <Icon className="mb-1 h-4 w-4 min-[375px]:h-5 min-[375px]:w-5" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            }

            return (
              <button key={item.label} type="button" onClick={item.action} className={className}>
                <Icon className="mb-1 h-4 w-4 min-[375px]:h-5 min-[375px]:w-5" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
