
import { updateMaterial } from "@/app/actions/materi";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, FileText, Youtube } from "lucide-react";
import { redirect } from "next/navigation";
import EditMaterialForm from "./form";

export default async function EditMaterialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Explicitly call params to satisfy Next.js 15+ async params requirement if any
    // actually in Next 15 params IS a promise.

    const material = await prisma.material.findUnique({
        where: { id },
        include: { chapters: { orderBy: { sortOrder: 'asc' } } }
    });

    if (!material) {
        redirect("/dashboard/materi");
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/materi" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Link>
                <h1 className="text-2xl font-bold text-primary">Edit Materi</h1>
                <p className="text-secondary text-sm">Sunting detail modul pembelajaran.</p>
            </div>

            <EditMaterialForm material={material} />
        </div>
    );
}
