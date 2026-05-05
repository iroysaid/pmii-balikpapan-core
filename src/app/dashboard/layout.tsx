import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 md:ml-56 lg:ml-64 p-4 pt-24 md:p-6 md:pt-6 lg:p-8 lg:pt-8 w-full max-w-[100vw] transition-[margin,padding] duration-300">
                {children}
            </main>
        </div>
    );
}
