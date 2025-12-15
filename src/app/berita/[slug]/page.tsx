import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SinglePostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug: slug },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link
                    href="/berita"
                    className="inline-flex items-center text-secondary hover:text-primary mb-8 transition font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
                </Link>

                <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <header className="mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center space-x-4 text-sm text-secondary mb-4">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-accent" />
                                {new Date(post.createdAt).toLocaleDateString("id-ID", {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-accent" />
                                {post.author || "Admin"}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-6">
                            {post.title}
                        </h1>
                        {post.image && (
                            <div className="w-full aspect-video rounded-xl overflow-hidden mt-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </header>

                    <div className="prose prose-lg max-w-none text-secondary leading-relaxed whitespace-pre-line">
                        {post.content}
                    </div>
                </article>
            </div>
        </div>
    );
}
