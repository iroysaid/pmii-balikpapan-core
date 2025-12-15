import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                    <p className="text-secondary text-sm">Selamat datang kembali, {session?.user?.name || "Sahabat"}.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-primary">
                    Role: <span className="text-accent uppercase ml-1">{session?.user?.role}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-secondary text-xs font-bold uppercase mb-2">Total Kader</h3>
                    <p className="text-3xl font-bold text-primary">1,250</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-secondary text-xs font-bold uppercase mb-2">Kas Bulan Ini</h3>
                    <p className="text-3xl font-bold text-green-600">Rp 5.2jt</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-secondary text-xs font-bold uppercase mb-2">Surat Masuk</h3>
                    <p className="text-3xl font-bold text-orange-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-secondary text-xs font-bold uppercase mb-2">Materi Modul</h3>
                    <p className="text-3xl font-bold text-blue-600">8</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
                [Area Grafik / Chart Aktivitas]
            </div>
        </div>
    );
}
