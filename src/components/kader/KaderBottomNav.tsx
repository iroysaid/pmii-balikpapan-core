"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Award, BookOpen, CalendarDays, FileText, Home, MoreHorizontal, Settings, Sparkles, UserRound } from "lucide-react";

const items = [
  { label: "Beranda", href: "/kader", icon: Home },
  { label: "Belajar", href: "/kader/learning", icon: BookOpen },
  { label: "Agenda", href: "/kader/agenda", icon: CalendarDays },
  { label: "Profil", href: "/kader/profil", icon: UserRound },
];

const moreItems = [
  { label: "Sertifikat", href: "/kader/sertifikat", icon: Award },
  { label: "Portofolio", href: "/kader/portofolio", icon: FileText },
  { label: "Riwayat Organisasi", href: "/kader/riwayat", icon: Sparkles },
  { label: "Pengaturan Akun", href: "/kader/settings", icon: Settings },
];

export default function KaderBottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isMoreActive = moreItems.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {isMoreOpen && (
        <div className="fixed inset-x-3 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 rounded-[2rem] border border-white/50 bg-white/90 p-3 shadow-[0_24px_80px_rgba(18,37,98,0.26)] backdrop-blur-2xl backdrop-saturate-200 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMoreOpen(false)}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-xs font-black transition active:scale-95 ${
                    active ? "bg-primary text-white" : "bg-blue-50 text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <nav className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-2 right-2 z-50 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 rounded-full border border-white/50 bg-[#262EED]/24 p-1 shadow-[0_20px_60px_rgba(18,37,98,0.32)] backdrop-blur-2xl backdrop-saturate-200 [-webkit-backdrop-filter:blur(18px)_saturate(190%)]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/kader" ? pathname === "/kader" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center rounded-full px-1 text-[9px] font-black transition active:scale-95 ${
                active
                  ? "bg-white text-primary shadow-[0_10px_28px_rgba(38,46,237,0.24)]"
                  : "text-white"
              }`}
            >
              <Icon className="mb-1 h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setIsMoreOpen((value) => !value)}
          className={`flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center rounded-full px-1 text-[9px] font-black transition active:scale-95 ${
            isMoreActive || isMoreOpen
              ? "bg-white text-primary shadow-[0_10px_28px_rgba(38,46,237,0.24)]"
              : "text-white"
          }`}
        >
          <MoreHorizontal className="mb-1 h-4 w-4" />
          <span className="truncate">Lainnya</span>
        </button>
      </div>
      </nav>
    </>
  );
}
