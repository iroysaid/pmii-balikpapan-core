import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export default async function SinglePostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            tags: { include: { tag: true } },
        },
    });

    if (!post) {
        notFound();
    }

    const groupColorMap: Record<string, string> = {
        Wilayah: "bg-blue-100 text-blue-700",
        Isu: "bg-red-100 text-red-700",
        Kaderisasi: "bg-green-100 text-green-700",
        Umum: "bg-gray-100 text-gray-600",
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link
                    href="/berita"
                    className="inline-flex items-center text-secondary hover:text-primary mb-8 transition font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
                </Link>

                <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Cover Image */}
                    {post.image && (
                        <div className="w-full aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-6">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                {new Date(post.createdAt).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                {post.author || "Admin PMII"}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-black text-primary leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100">
                                <Tag className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                {post.tags.map(({ tag }) => (
                                    <span
                                        key={tag.id}
                                        className={`text-xs font-bold px-3 py-1 rounded-full ${groupColorMap[tag.group] || "bg-gray-100 text-gray-600"}`}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Rich HTML Content */}
                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                                prose-headings:text-primary prose-headings:font-black
                                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                prose-p:mb-4 prose-p:leading-relaxed
                                prose-strong:text-primary
                                prose-em:text-gray-600
                                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                                prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                                prose-li:text-gray-700
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                                prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
                                prose-hr:border-gray-200"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}
