import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardFloatingActionMenu from "@/components/dashboard/DashboardFloatingActionMenu";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";
import { getRolePermissions } from "@/lib/permissions/routes";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const permissions = session?.user?.permissions || getRolePermissions(session?.user?.role);
    const canSwitchToKader =
        session?.user?.role === "SUPER_ADMIN" || Boolean(session?.user?.hasKaderProfile);
    const canUseFloatingMenu = Object.values(permissions).some(
        (level) => level === "edit" || level === "full"
    );

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Sidebar />
            <main className="w-full max-w-[100vw] flex-1 p-4 pb-28 pt-20 transition-[margin,padding] duration-300 md:ml-56 md:p-6 md:pb-6 md:pt-6 lg:ml-64 lg:p-8">
                <header className="fixed inset-x-3 top-3 z-40 overflow-hidden rounded-full border border-white/45 bg-[#262EED]/24 px-4 py-2 shadow-[0_18px_60px_rgba(38,46,237,0.18)] backdrop-blur-2xl backdrop-saturate-200 md:hidden">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.10)_42%,rgba(38,46,237,0.22))]" />
                    <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/PMII_BPP.png"
                                alt="Logo PMII"
                                width={34}
                                height={34}
                                className="h-8 w-8 object-contain"
                            />
                            <div className="leading-tight">
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
                                    Dashboard
                                </p>
                                <h1 className="text-sm font-black text-[#122562]">
                                    PMII Balikpapan
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {canSwitchToKader && (
                                <Link
                                    href="/kader"
                                    className="rounded-full border border-white/45 bg-white/45 px-3 py-1 text-xs font-black text-primary active:scale-95"
                                >
                                    Kader
                                </Link>
                            )}
                            <div className="max-w-[9rem] truncate rounded-full border border-white/45 bg-white/40 px-3 py-1 text-xs font-black text-primary">
                                {session?.user?.name || "Pengguna"}
                            </div>
                        </div>
                    </div>
                </header>

                <header className="relative mb-6 hidden overflow-hidden rounded-3xl border border-white/45 bg-[#262EED]/18 px-5 py-4 shadow-[0_18px_60px_rgba(38,46,237,0.16)] backdrop-blur-2xl backdrop-saturate-200 md:block">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.12)_38%,rgba(38,46,237,0.16))]" />
                    <div className="pointer-events-none absolute -right-14 -top-20 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="relative z-10">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                                Dashboard PMII Balikpapan
                            </p>
                            <h1 className="mt-1 text-lg font-black text-[#122562]">
                                CMS Internal Organisasi
                            </h1>
                        </div>
                        <div className="relative z-10 flex flex-wrap items-center gap-2">
                            {canSwitchToKader && (
                                <Link
                                    href="/kader"
                                    className="rounded-full border border-white/45 bg-white/45 px-4 py-2 text-sm font-black text-primary shadow-sm backdrop-blur-xl transition hover:bg-white"
                                >
                                    Switch Mode Kader
                                </Link>
                            )}
                            <div className="rounded-full border border-white/45 bg-white/35 px-4 py-2 text-sm font-bold text-primary shadow-sm backdrop-blur-xl">
                                {session?.user?.name || "Pengguna"} · {session?.user?.role || "PUBLIC"}
                            </div>
                        </div>
                    </div>
                </header>
                {children}
                {canUseFloatingMenu && (
                    <DashboardFloatingActionMenu
                        permissions={permissions}
                        className="bottom-24 md:bottom-8"
                    />
                )}
                <DashboardMobileNav
                    role={session?.user?.role}
                    permissions={permissions}
                />
            </main>
        </div>
    );
}
