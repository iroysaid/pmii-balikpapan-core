import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FinanceForm from "@/components/dashboard/FinanceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
        where: { id }
    });

    if (!transaction) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/finance" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Keuangan
                </Link>
                <h1 className="text-2xl font-bold text-primary">Edit Transaksi</h1>
                <p className="text-secondary text-sm">Perbarui data transaksi keuangan.</p>
            </div>

            <FinanceForm initialData={transaction} isEdit={true} />
        </div>
    );
}
