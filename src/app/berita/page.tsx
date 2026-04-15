import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ArrowRight, TrendingUp, Clock, Tag } from "lucide-react";


export const dynamic = "force-dynamic";

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function NewsPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
            tags: { include: { tag: true } },
        },
    });

    if (posts.length === 0) {
        return (
            <div className="bg-background min-h-screen pb-20">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">Berita & Artikel</h1>
                    <p className="text-gray-400">Belum ada berita yang diterbitkan.</p>
                </div>
            </div>
        );
    }

    const featuredPost = posts[0];
    const secondaryPosts = posts.slice(1, 3);
    const regularPosts = posts.slice(3);
    const trendingPosts = posts.slice(0, 5); // Just using latest as trending for now

    return (
        <div className="bg-[#f8f9fa] min-h-screen">
            {/* Professional News Header */}
            <div className="bg-white border-b border-gray-200 py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-2 block">Jendela Pergerakan</span>
                            <h1 className="text-4xl md:text-5xl font-black text-primary leading-tight">Berita & <span className="text-blue-600">Artikel</span></h1>
                        </div>
                        <p className="text-gray-500 max-w-md text-sm md:text-base">
                            Informasi terkini mengenai kegiatan, opini, dan perkembangan organisasi PMII Cabang Balikpapan.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Main Content Area (8 Columns) */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* 1. HERO FEATURED POST */}
                        <section>
                            <Link href={`/berita/${featuredPost.slug}`} className="group block relative overflow-hidden rounded-3xl bg-primary aspect-[16/9]">
                                {featuredPost.image ? (
                                    <img 
                                        src={featuredPost.image} 
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600 font-bold text-4xl">PMII</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-10 flex flex-col justify-end">
                                    <div className="flex items-center space-x-3 text-white/80 text-xs md:text-sm mb-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold">UTAMA</span>
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(featuredPost.createdAt).toLocaleDateString("id-ID")}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-blue-400 transition leading-tight">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-white/70 text-sm md:text-base line-clamp-2 md:max-w-2xl">
                                        {stripHtml(featuredPost.content).substring(0, 150)}...
                                    </p>
                                </div>
                            </Link>
                        </section>

                        {/* 2. SECONDARY POSTS (2nd Row - 2 Containers) */}
                        {secondaryPosts.length > 0 && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                {secondaryPosts.map((post) => (
                                    <Link key={post.id} href={`/berita/${post.slug}`} className="group space-y-4">
                                        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 relative">
                                            {post.image ? (
                                                <img 
                                                    src={post.image} 
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No Image</div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-1 rounded">TERBARU</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                <Clock className="w-3 h-3 mr-1" /> {new Date(post.createdAt).toLocaleDateString("id-ID")}
                                            </div>
                                            <h3 className="text-xl font-bold text-primary group-hover:text-blue-600 transition leading-snug">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">
                                                {stripHtml(post.content).substring(0, 80)}...
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </section>
                        )}

                        <div className="h-px bg-gray-200"></div>

                        {/* 3. REGULAR LIST (Varid Grid) */}
                        <section className="space-y-8">
                            <h3 className="text-2xl font-black text-primary flex items-center">
                                <span className="w-2 h-8 bg-blue-600 mr-3 inline-block"></span>
                                Telusuri Lebih Lanjut
                            </h3>
                            <div className="space-y-6">
                                {regularPosts.map((post) => (
                                    <Link key={post.id} href={`/berita/${post.slug}`} className="flex flex-col sm:flex-row gap-6 group">
                                        <div className="sm:w-1/3 aspect-[3/2] shrink-0 overflow-hidden rounded-xl bg-gray-200">
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 py-1">
                                            <div className="flex items-center text-xs text-blue-600 font-bold mb-2">
                                                PMII BALIKPAPAN
                                            </div>
                                            <h4 className="text-lg font-bold text-primary group-hover:text-blue-600 transition mb-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                                {stripHtml(post.content).substring(0, 120)}...
                                            </p>
                                            <div className="flex items-center text-[10px] text-gray-400 font-medium">
                                                <Calendar className="w-3 h-3 mr-1" /> {new Date(post.createdAt).toLocaleDateString("id-ID")}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar (4 Columns) */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Sidebar Section 1: Dynamic Trending Style */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-primary mb-6 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" /> Populer
                            </h3>
                            <div className="space-y-6">
                                {trendingPosts.map((post, index) => (
                                    <Link key={post.id} href={`/berita/${post.slug}`} className="flex items-start gap-4 group">
                                        <span className="text-3xl font-black text-gray-100 group-hover:text-blue-100 transition leading-none">{index + 1}</span>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-primary group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 font-bold">{new Date(post.createdAt).toLocaleDateString("id-ID")}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Section 2: Banner/Info */}
                        <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/40 transition duration-700"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4 italic">"Dzikir, Fikir, Amal Sholeh."</h3>
                                <p className="text-blue-200 text-xs mb-6 leading-relaxed">
                                    Dapatkan update resmi kegiatan PMII Cabang Balikpapan langsung di perangkat Anda.
                                </p>
                                <Link href="/" className="bg-white text-primary px-5 py-2 rounded-full text-xs font-black inline-flex items-center group/btn hover:bg-blue-50 transition">
                                    Lihat Profil <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition" />
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar Section 3: Categories Tags */}
                        <div>
                            <h3 className="text-lg font-black text-primary mb-4 flex items-center uppercase tracking-tight">
                                <Tag className="w-5 h-5 mr-2" /> Topik Hangat
                            </h3>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-gray-100 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-full font-bold text-gray-600 hover:text-blue-600 transition">Organisasi</span>
                                <span className="bg-gray-100 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-full font-bold text-gray-600 hover:text-blue-600 transition">Pengaderan</span>
                                <span className="bg-gray-100 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-full font-bold text-gray-600 hover:text-blue-600 transition">Opini</span>
                                <span className="bg-gray-100 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-full font-bold text-gray-600 hover:text-blue-600 transition">Internal</span>
                                <span className="bg-gray-100 hover:bg-blue-100 cursor-pointer px-4 py-2 rounded-full font-bold text-gray-600 hover:text-blue-600 transition">Balikpapan</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
