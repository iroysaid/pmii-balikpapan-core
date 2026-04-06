import ActivityForm from "@/components/dashboard/ActivityForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditActivityPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
            photos: true,
        }
    });

    if (!activity) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-primary mb-2 flex items-center">
                        <Link href="/dashboard/kegiatan" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition inline-flex items-center justify-center">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        Edit Kegiatan
                    </h1>
                    <p className="text-secondary text-sm ml-12">Perbarui detail atau status kegiatan ini sesuai kebutuhan.</p>
                </div>
            </div>

            <ActivityForm initialData={activity} />
        </div>
    );
}
