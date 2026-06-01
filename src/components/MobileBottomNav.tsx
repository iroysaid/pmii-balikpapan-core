"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Images, Newspaper, UserRound } from "lucide-react";

const mobileNavItems = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Profil", href: "/profil", icon: UserRound },
  { label: "Agenda", href: "/kegiatan", icon: CalendarDays },
  { label: "Berita", href: "/berita", icon: Newspaper },
  { label: "Galeri", href: "/galeri", icon: Images },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="fixed bottom-3 left-2 right-2 z-50 w-auto md:hidden">
      <div className="mx-auto grid w-full max-w-md grid-cols-5 items-center rounded-full border border-white/45 bg-[#262EED]/22 px-1 py-1.5 shadow-[0_18px_60px_rgba(18,37,98,0.28)] backdrop-blur-2xl backdrop-saturate-200 [-webkit-backdrop-filter:blur(18px)_saturate(190%)]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center rounded-full px-0.5 text-[8.5px] font-black transition active:scale-95 min-[375px]:text-[9.5px] ${
                active
                  ? "bg-white text-primary shadow-[0_10px_30px_rgba(38,46,237,0.22)]"
                  : "text-white hover:bg-white/16"
              }`}
            >
              <Icon className="mb-1 h-4 w-4 min-[375px]:h-5 min-[375px]:w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
