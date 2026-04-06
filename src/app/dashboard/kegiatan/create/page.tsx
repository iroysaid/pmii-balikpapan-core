import ActivityForm from "@/components/dashboard/ActivityForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateActivityPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-primary mb-2 flex items-center">
                        <Link href="/dashboard/kegiatan" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition inline-flex items-center justify-center">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        Tambah Kegiatan Baru
                    </h1>
                    <p className="text-secondary text-sm ml-12">Siapkan event mendatang untuk ditampilkan di halaman depan.</p>
                </div>
            </div>

            <ActivityForm />
        </div>
    );
}
