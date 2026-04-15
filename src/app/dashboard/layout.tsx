import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-4 pt-24 md:p-8 md:pt-8 w-full max-w-[100vw]">
                {children}
            </main>
        </div>
    );
}
