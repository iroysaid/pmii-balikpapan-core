/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    ArrowRight,
    ChevronDown,
    Mail,
    Search,
} from "lucide-react";

export const dynamic = "force-dynamic";

type PublishedPost = Awaited<ReturnType<typeof getPublishedPosts>>[number];

const beats = ["Kaderisasi", "Opini", "Daerah", "Pergerakan"];

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(content: string, limit = 150) {
    const text = stripHtml(content);
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function readingTime(content: string) {
    const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 180))} menit baca`;
}

function getPrimaryTag(post: PublishedPost) {
    return post.tags[0]?.tag.name ?? "PMII Balikpapan";
}

async function getPublishedPosts() {
    return prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
            tags: { include: { tag: true } },
        },
    });
}

function NewsImage({
    post,
    className = "",
}: {
    post: PublishedPost;
    className?: string;
}) {
    if (!post.image) {
        return (
            <div className={`flex h-full w-full items-center justify-center bg-primary text-accent ${className}`}>
                <span className="font-mono text-xs uppercase tracking-[0.18em]">PMII</span>
            </div>
        );
    }

    return (
        <img
            src={post.image}
            alt={post.title}
            className={`h-full w-full object-cover ${className}`}
        />
    );
}

function LatestRail({ posts }: { posts: PublishedPost[] }) {
    return (
        <aside className="rounded-[5px] border border-[#CACACA] bg-white p-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-hidden lg:p-[25px]">
            <div className="border-b border-[#CACACA] pb-4">
                <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-primary">
                    Terbaru
                </h2>
            </div>
            <ol className="pt-5">
                {posts.slice(0, 10).map((post) => (
                    <li key={post.id} className="relative mb-5 pl-4 last:mb-0">
                        <span className="absolute left-0 top-[0.45em] h-1 w-1 rounded-full bg-accent" />
                        <Link href={`/berita/${post.slug}`} className="group block">
                            <h3 className="text-[17px] font-extrabold leading-[1.12] text-primary transition-colors duration-150 group-hover:text-secondary">
                                {post.title}
                            </h3>
                            <p className="mt-2 font-mono text-[11px] uppercase leading-tight tracking-[0.08em] text-[#555555]">
                                {formatDate(post.createdAt)} <span className="text-accent">•</span>{" "}
                                {readingTime(post.content)}
                            </p>
                        </Link>
                    </li>
                ))}
            </ol>
            {posts.length > 10 && (
                <button className="mt-2 flex w-full flex-col items-center gap-1 border-t border-[#CACACA] pt-4 font-mono text-xs uppercase tracking-[0.08em] text-primary">
                    Muat lagi
                    <ChevronDown className="h-4 w-4" />
                </button>
            )}
        </aside>
    );
}

function LeadStory({ post }: { post: PublishedPost }) {
    return (
        <article className="group grid gap-[25px] border-b border-[#CACACA] pb-8 md:grid-cols-12">
            <Link
                href={`/berita/${post.slug}`}
                className="relative aspect-video overflow-hidden bg-primary md:col-span-8"
                aria-label={post.title}
            >
                <NewsImage post={post} className="transition-transform duration-500 group-hover:scale-[1.025]" />
            </Link>
            <div className="flex flex-col justify-center md:col-span-4">
                <p className="mb-2 font-mono text-xs uppercase leading-none tracking-[0.08em] text-primary">
                    {getPrimaryTag(post)}
                </p>
                <Link href={`/berita/${post.slug}`} className="block">
                    <h2 className="text-[28px] font-black leading-[1.04] text-primary transition-colors duration-150 group-hover:text-secondary md:text-[34px]">
                        {post.title}
                    </h2>
                </Link>
                <p className="mt-4 font-serif text-[17.5px] leading-[1.35] text-black transition-colors duration-150 group-hover:text-secondary">
                    {excerpt(post.content, 180)}
                </p>
                <p className="mt-4 text-xs font-semibold leading-tight text-[#111111]">
                    Oleh <span className="uppercase">{post.author || "Admin PMII"}</span>
                </p>
            </div>
        </article>
    );
}

function ArticleCard({
    post,
    compact = false,
}: {
    post: PublishedPost;
    compact?: boolean;
}) {
    return (
        <article className="group">
            <Link
                href={`/berita/${post.slug}`}
                className={`relative block overflow-hidden bg-primary ${compact ? "aspect-square" : "aspect-video"}`}
                aria-label={post.title}
            >
                <NewsImage post={post} className="transition-transform duration-500 group-hover:scale-[1.03]" />
            </Link>
            <div className="pt-4">
                <p className="mb-2 font-mono text-xs uppercase leading-none tracking-[0.08em] text-primary">
                    {getPrimaryTag(post)}
                </p>
                <Link href={`/berita/${post.slug}`}>
                    <h3 className="text-[21px] font-black leading-[1.08] text-primary transition-colors duration-150 group-hover:text-secondary">
                        {post.title}
                    </h3>
                </Link>
                <p className="mt-3 font-serif text-[17px] leading-[1.35] text-black transition-colors duration-150 group-hover:text-secondary">
                    {excerpt(post.content, compact ? 95 : 130)}
                </p>
                <p className="mt-3 text-xs font-semibold text-[#111111]">
                    Oleh <span className="uppercase">{post.author || "Admin PMII"}</span>
                </p>
            </div>
        </article>
    );
}

function TextListArticle({ post }: { post: PublishedPost }) {
    return (
        <article className="group border-b border-[#CACACA] py-5 first:pt-0">
            <Link href={`/berita/${post.slug}`} className="grid gap-4 sm:grid-cols-[120px_1fr]">
                <div className="aspect-square overflow-hidden bg-primary sm:order-2">
                    <NewsImage post={post} className="transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
                <div>
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-primary">
                        {getPrimaryTag(post)}
                    </p>
                    <h3 className="text-[19px] font-black leading-[1.1] text-primary transition-colors duration-150 group-hover:text-secondary">
                        {post.title}
                    </h3>
                    <p className="mt-2 hidden font-serif text-[16px] leading-[1.35] text-black transition-colors duration-150 group-hover:text-secondary sm:block">
                        {excerpt(post.content, 110)}
                    </p>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#555555]">
                        {formatDate(post.createdAt)}
                    </p>
                </div>
            </Link>
        </article>
    );
}

function TopicSection({
    title,
    posts,
}: {
    title: string;
    posts: PublishedPost[];
}) {
    if (posts.length === 0) return null;

    return (
        <section className="border-t border-[#CACACA] pt-8">
            <div className="mb-5 border-b border-[#CACACA] pb-4">
                <Link href="/berita" className="group inline-flex items-end gap-2">
                    <h2 className="text-[28px] font-black leading-none text-primary">
                        {title}
                    </h2>
                    <span className="font-mono text-lg leading-none text-accent transition-transform duration-150 group-hover:translate-x-1">
                        &gt;
                    </span>
                </Link>
            </div>
            <div className="grid gap-[25px] md:grid-cols-3">
                {posts.slice(0, 3).map((post) => (
                    <ArticleCard key={post.id} post={post} compact />
                ))}
            </div>
        </section>
    );
}

function NewsletterBand() {
    return (
        <section className="grid gap-[25px] bg-secondary px-5 py-12 text-white lg:grid-cols-16 lg:px-10 lg:py-14">
            <div className="lg:col-start-5 lg:col-span-8">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.08em] text-accent">
                    <Mail className="h-4 w-4" />
                    Kabar Pergerakan
                </div>
                <h2 className="mt-4 text-[34px] font-black leading-none text-accent md:text-[42px]">
                    Berita PMII dalam satu ruang baca
                </h2>
                <p className="mt-4 max-w-2xl font-serif text-[19px] leading-[1.45] text-white/90">
                    Ikuti catatan kegiatan, gagasan kader, dan dinamika organisasi PMII
                    Cabang Balikpapan dengan format yang ringkas, aktual, dan mudah dipindai.
                </p>
            </div>
            <div className="flex items-end lg:col-span-4">
                <Link
                    href="/kontak"
                    className="inline-flex h-[35px] items-center rounded-[5px] bg-accent px-5 font-mono text-xs uppercase tracking-[0.08em] text-secondary transition-colors duration-150 hover:bg-white"
                >
                    Kirim informasi
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}

function EmptyState() {
    return (
        <div className="news-serif min-h-screen bg-white">
            <section className="mx-auto max-w-[1320px] px-5 py-20 text-center lg:px-10">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary">
                    Berita PMII Balikpapan
                </p>
                <h1 className="mt-3 text-4xl font-black leading-tight text-primary">
                    Belum ada berita yang diterbitkan.
                </h1>
                <p className="mx-auto mt-4 max-w-xl font-serif text-xl leading-relaxed text-black/70">
                    Begitu tulisan pertama dipublikasikan, halaman ini akan otomatis
                    berubah menjadi ruang baca editorial.
                </p>
            </section>
        </div>
    );
}

export default async function NewsPage() {
    const posts = await getPublishedPosts();

    if (posts.length === 0) {
        return <EmptyState />;
    }

    const featuredPost = posts[0];
    const secondaryPosts = posts.slice(1, 3);
    const listPosts = posts.slice(3, 7);
    const remainingPosts = posts.slice(7);
    const topicGroups = beats.map((beat, index) => ({
        title: beat,
        posts: posts
            .filter((post) =>
                post.tags.some(({ tag }) =>
                    `${tag.name} ${tag.group}`.toLowerCase().includes(beat.toLowerCase())
                )
            )
            .concat(posts.slice(index * 3, index * 3 + 3))
            .filter((post, postIndex, source) => source.findIndex((item) => item.id === post.id) === postIndex),
    }));

    return (
        <div className="news-serif min-h-screen bg-white text-black">
            <header className="border-b-2 border-accent bg-white">
                <div className="mx-auto max-w-[1320px] px-5 py-6 lg:px-10">
                    <div className="grid items-end gap-5 md:grid-cols-[1fr_auto_1fr]">
                        <nav className="hidden gap-5 text-sm font-extrabold text-primary md:flex">
                            <Link href="/profil" className="hover:border-b hover:border-accent">
                                Profil
                            </Link>
                            <Link href="/kegiatan" className="hover:border-b hover:border-accent">
                                Agenda
                            </Link>
                            <Link href="/galeri" className="hover:border-b hover:border-accent">
                                Galeri
                            </Link>
                        </nav>
                        <div className="text-center">
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                                Kanal Berita
                            </p>
                            <h1 className="mt-2 text-4xl font-black leading-none text-primary md:text-6xl">
                                PMII Balikpapan
                            </h1>
                        </div>
                        <div className="flex items-center justify-center gap-4 md:justify-end">
                            <Link
                                href="/masuk"
                                className="hidden h-[35px] items-center rounded-[5px] border border-primary px-4 font-mono text-xs uppercase tracking-[0.08em] text-primary transition-colors duration-150 hover:bg-primary hover:text-white md:inline-flex"
                            >
                                Masuk
                            </Link>
                            <button
                                type="button"
                                aria-label="Cari berita"
                                className="flex h-9 w-9 items-center justify-center text-primary transition-colors duration-150 hover:text-secondary"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-5 overflow-x-auto border-y border-[#CACACA] py-3">
                        <div className="mx-auto flex w-max max-w-full items-center gap-4 px-1 font-mono text-xs uppercase tracking-[0.08em] text-primary">
                            {beats.map((beat, index) => (
                                <Link key={beat} href="/berita" className="whitespace-nowrap hover:text-primary">
                                    {index > 0 && <span className="mr-4 inline-block h-1 w-1 rounded-full bg-accent align-middle" />}
                                    {beat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1320px] px-5 py-8 lg:px-10">
                <section className="grid gap-[25px] lg:grid-cols-16">
                    <div className="lg:col-span-4">
                        <LatestRail posts={posts} />
                    </div>

                    <div className="space-y-10 lg:col-span-12">
                        <LeadStory post={featuredPost} />

                        {secondaryPosts.length > 0 && (
                            <div className="grid gap-[25px] md:grid-cols-2">
                                {secondaryPosts.map((post) => (
                                    <ArticleCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}

                        {listPosts.length > 0 && (
                            <section className="grid gap-[25px] border-t border-[#CACACA] pt-8 md:grid-cols-2">
                                {listPosts.map((post) => (
                                    <TextListArticle key={post.id} post={post} />
                                ))}
                            </section>
                        )}
                    </div>
                </section>
            </main>

            <NewsletterBand />

            <div className="mx-auto max-w-[1320px] space-y-10 px-5 py-10 lg:px-10">
                {topicGroups.map((group) => (
                    <TopicSection key={group.title} title={group.title} posts={group.posts} />
                ))}

                {remainingPosts.length > 0 && (
                    <section className="border-t border-[#CACACA] pt-8">
                        <div className="mb-5 flex items-end justify-between border-b border-[#CACACA] pb-4">
                            <h2 className="text-[28px] font-black leading-none text-primary">
                                Arsip Terbaru
                            </h2>
                            <p className="hidden font-mono text-xs uppercase tracking-[0.08em] text-[#555555] sm:block">
                                {remainingPosts.length} tulisan
                            </p>
                        </div>
                        <div className="grid gap-x-[25px] md:grid-cols-2 lg:grid-cols-4">
                            {remainingPosts.slice(0, 8).map((post) => (
                                <TextListArticle key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
