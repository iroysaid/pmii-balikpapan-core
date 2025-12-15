import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LettersForm from "@/components/dashboard/LettersForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditLetterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const letter = await prisma.letter.findUnique({
        where: { id }
    });

    if (!letter) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/surat" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Administrasi
                </Link>
                <h1 className="text-2xl font-bold text-primary">Edit Arsip Surat</h1>
                <p className="text-secondary text-sm">Perbarui data surat masuk atau keluar.</p>
            </div>

            <LettersForm initialData={letter} isEdit={true} />
        </div>
    );
}
