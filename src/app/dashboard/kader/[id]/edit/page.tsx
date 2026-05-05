import { prisma } from "@/lib/prisma";
import KaderForm from "@/components/dashboard/KaderForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EditKaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

    const kader = await prisma.user.findUnique({
        where: { id },
        include: { kaderProfile: true }
    });

    if (!kader) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/kader" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Database
                </Link>
                <h1 className="text-2xl font-bold text-primary">Edit Data Kader</h1>
                <p className="text-secondary text-sm">Perbarui informasi anggota.</p>
            </div>

            <KaderForm initialData={kader} isEdit={true} isSuperAdmin={isSuperAdmin} />
        </div>
    );
}
