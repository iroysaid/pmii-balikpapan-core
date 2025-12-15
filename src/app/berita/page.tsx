import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default async function NewsPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="bg-background min-h-screen pb-20">
            <div className="bg-primary text-white py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Berita & Artikel</h1>
                <p className="text-blue-100 text-lg">Kabar terbaru dari PMII Cabang Balikpapan</p>
            </div>

            <div className="container mx-auto px-4 mt-[-3rem] relative z-10">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 min-h-[500px]">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p>Belum ada berita yang diterbitkan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <div key={post.id} className="group cursor-pointer">
                                    <div className="h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                                        {post.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-secondary mb-2 space-x-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(post.createdAt).toLocaleDateString("id-ID")}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition leading-snug">
                                        <Link href={`/berita/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="text-secondary text-sm line-clamp-2 mb-4">
                                        {post.content.substring(0, 100)}...
                                    </p>
                                    <Link href={`/berita/${post.slug}`} className="text-primary font-bold text-sm hover:underline flex items-center">
                                        Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
