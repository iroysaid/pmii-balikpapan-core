import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Medal,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { isAdminWorkspaceRole } from "@/lib/workspaces";
import KaderBottomNav from "./KaderBottomNav";
import KaderSignOutButton from "./KaderSignOutButton";

const navItems = [
  { label: "Beranda", href: "/kader", icon: Home },
  { label: "Profil Kader", href: "/kader/profil", icon: UserRound },
  { label: "Kartu Anggota", href: "/kader/kartu", icon: CreditCard },
  { label: "Learning Journey", href: "/kader/learning", icon: BookOpen },
  { label: "Agenda Saya", href: "/kader/agenda", icon: CalendarDays },
  { label: "Sertifikat", href: "/kader/sertifikat", icon: Award },
  { label: "Pencapaian", href: "/kader/pencapaian", icon: Medal },
  { label: "Portofolio", href: "/kader/portofolio", icon: FileText },
  { label: "Riwayat Organisasi", href: "/kader/riwayat", icon: Sparkles },
  { label: "Pengaturan Akun", href: "/kader/settings", icon: Settings },
];

export default function KaderShell({
  children,
  user,
}: {
  children: ReactNode;
  user: {
    name?: string | null;
    role?: string | null;
    image?: string | null;
    hasAdminWorkspace?: boolean;
  };
}) {
  const canSwitchToAdmin = user.hasAdminWorkspace || isAdminWorkspaceRole(user.role);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(38,46,237,0.16),transparent_30%),linear-gradient(135deg,#f7f9ff,#eef3ff_45%,#fff)] text-secondary">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/70 bg-white/72 p-5 shadow-[20px_0_70px_rgba(18,37,98,0.08)] backdrop-blur-2xl md:flex md:flex-col">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <Image src="/PMII_BPP.png" alt="Logo PMII" width={42} height={42} className="h-11 w-11 object-contain" />
          <div className="leading-tight">
            <p className="font-black text-primary">PMII Balikpapan</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary/55">
              Kader Workspace
            </p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-secondary transition hover:bg-primary hover:text-white"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-blue-100 pt-4">
          {canSwitchToAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white transition hover:bg-secondary"
            >
              Switch ke Admin
            </Link>
          )}
          <KaderSignOutButton>
            <LogOut className="h-4 w-4" />
            Keluar
          </KaderSignOutButton>
        </div>
      </aside>

      <header className="fixed inset-x-3 top-3 z-40 rounded-full border border-white/55 bg-[#262EED]/24 px-4 py-2 shadow-[0_18px_60px_rgba(18,37,98,0.22)] backdrop-blur-2xl backdrop-saturate-200 md:left-80 md:right-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Image src="/PMII_BPP.png" alt="Logo PMII" width={32} height={32} className="h-8 w-8 object-contain" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-primary">
                Dashboard Kader
              </p>
              <p className="truncate text-sm font-black text-[#122562]">
                {user.name || "Sahabat PMII"}
              </p>
            </div>
          </div>
          {canSwitchToAdmin && (
            <Link
              href="/dashboard"
              className="rounded-full bg-white/65 px-3 py-2 text-xs font-black text-primary shadow-sm active:scale-95"
            >
              Admin
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-28 pt-24 md:ml-72 md:max-w-none md:px-8 md:pb-10">
        {children}
      </main>
      <KaderBottomNav />
    </div>
  );
}

