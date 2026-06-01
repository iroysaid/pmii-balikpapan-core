import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardFloatingActionMenu from "@/components/dashboard/DashboardFloatingActionMenu";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-56 lg:ml-64 p-4 pt-24 md:p-6 md:pt-6 lg:p-8 lg:pt-8 w-full max-w-[100vw] transition-[margin,padding] duration-300">
                <header className="mb-6 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                                Dashboard PMII Balikpapan
                            </p>
                            <h1 className="mt-1 text-lg font-bold text-secondary">
                                CMS Internal Organisasi
                            </h1>
                        </div>
                        <div className="text-sm text-gray-500">
                            {session?.user?.name || "Pengguna"} · {session?.user?.role || "PUBLIC"}
                        </div>
                    </div>
                </header>
                {children}
                {session?.user?.role === "SUPER_ADMIN" && <DashboardFloatingActionMenu />}
            </main>
        </div>
    );
}
