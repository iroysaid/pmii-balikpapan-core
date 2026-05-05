import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import KaderForm from "@/components/dashboard/KaderForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CreateKaderPage() {
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/kader" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Database
                </Link>
                <h1 className="text-2xl font-bold text-primary">Tambah Kader Baru</h1>
                <p className="text-secondary text-sm">Input data anggota lengkap dengan foto.</p>
            </div>

            <KaderForm isSuperAdmin={isSuperAdmin} />
        </div>
    );
}
