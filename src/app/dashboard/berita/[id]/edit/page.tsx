
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/dashboard/PostForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/berita" className="text-secondary hover:text-primary flex items-center mb-4 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Manajemen Berita
                </Link>
                <h1 className="text-2xl font-bold text-primary">Sunting Berita</h1>
                <p className="text-secondary text-sm">Perbarui konten artikel atau pengumuman.</p>
            </div>

            <PostForm initialData={post} isEdit={true} />
        </div>
    );
}
