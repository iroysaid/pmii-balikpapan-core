"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, CreditCard, Home, UserRound } from "lucide-react";

const items = [
  { label: "Beranda", href: "/kader", icon: Home },
  { label: "Belajar", href: "/kader/learning", icon: BookOpen },
  { label: "Agenda", href: "/kader/agenda", icon: CalendarDays },
  { label: "Kartu", href: "/kader/kartu", icon: CreditCard },
  { label: "Profil", href: "/kader/profil", icon: UserRound },
];

export default function KaderBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-2 right-2 z-50 md:hidden">
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
      </div>
    </nav>
  );
}

