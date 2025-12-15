import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import KaderForm from "@/components/dashboard/KaderForm";
import { registerKader } from "@/app/actions/public";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-secondary hover:text-primary flex items-center justify-center mb-4 text-sm font-bold">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
                    </Link>
                    <h1 className="text-3xl font-bold text-primary">Pendaftaran Anggota Baru</h1>
                    <p className="text-secondary mt-2">Isi formulir di bawah ini untuk bergabung dengan PMII Balikpapan.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <KaderForm customAction={registerKader} submitLabel="Submit" />
                </div>
            </div>
        </div>
    );
}
