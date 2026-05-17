/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Facebook,
    Link2,
    Mail,
    UserRound,
} from "lucide-react";
import { notFound } from "next/navigation";

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(content: string, limit = 185) {
    const text = stripHtml(content);
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function formatLongDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

function formatShortDate(date: Date) {
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

function primaryTag(post: {
    tags: { tag: { name: string } }[];
}) {
    return post.tags[0]?.tag.name ?? "Berita PMII";
}

function ShareRail() {
    return (
        <aside className="hidden lg:block">
            <div className="sticky top-28 border-t border-black pt-5">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-black">
                    Bagikan
                </p>
                <div className="flex flex-col gap-3">
                    {[
                        { label: "Facebook", icon: Facebook },
                        { label: "Email", icon: Mail },
                        { label: "Salin tautan", icon: Link2 },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.label}
                                type="button"
                                aria-label={item.label}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-black text-black transition-colors hover:bg-black hover:text-white"
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}

function RelatedCard({
    post,
}: {
    post: {
        id: string;
        slug: string;
        title: string;
        content: string;
        image: string | null;
        author: string | null;
        createdAt: Date;
        tags: { tag: { name: string } }[];
    };
}) {
    return (
        <article className="group">
            <Link href={`/berita/${post.slug}`} className="block border-b-0">
                <div className="relative aspect-[4/3] overflow-hidden bg-primary">
                    {post.image ? (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-accent">
                            <span className="font-mono text-xs uppercase tracking-[0.18em]">
                                PMII
                            </span>
                        </div>
                    )}
                </div>
                <div className="pt-4">
                    <p className="mb-2 font-mono text-xs uppercase leading-none tracking-[0.08em] text-black">
                        {primaryTag(post)}
                    </p>
                    <h3 className="text-[20px] font-black leading-[1.08] text-black transition-colors group-hover:text-primary">
                        {post.title}
                    </h3>
                    <p className="mt-3 font-serif text-[16px] leading-[1.4] text-black/75">
                        {excerpt(post.content, 115)}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-black">
                        Oleh <span className="uppercase">{post.author || "Admin PMII"}</span>
                    </p>
                </div>
            </Link>
        </article>
    );
}

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

    if (!post || !post.published) {
        notFound();
    }

    const relatedPosts = await prisma.post.findMany({
        where: {
            published: true,
            slug: { not: slug },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
            tags: { include: { tag: true } },
        },
    });

    const dek = excerpt(post.content);
    const author = post.author || "Admin PMII";

    return (
        <article className="news-serif min-h-screen bg-white text-black">
            <header className="border-b-2 border-accent bg-white">
                <div className="mx-auto max-w-[1320px] px-5 py-8 lg:px-10 lg:py-12">
                    <Link
                        href="/berita"
                        className="mb-10 inline-flex items-center border-b border-transparent font-mono text-xs uppercase tracking-[0.08em] text-black transition hover:border-black"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Berita
                    </Link>

                    <div className="grid gap-8 lg:grid-cols-16 lg:gap-x-[25px]">
                        <div className="lg:col-span-3">
                            <div className="hidden border-t border-black pt-5 lg:block">
                                <p className="font-mono text-[11px] uppercase leading-tight tracking-[0.08em] text-black">
                                    Kanal
                                </p>
                                <p className="mt-3 text-[22px] font-black leading-none text-black">
                                    {primaryTag(post)}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-10">
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                {(post.tags.length ? post.tags : [{ tag: { id: "default", name: "PMII Balikpapan" } }]).map(({ tag }) => (
                                    <span
                                        key={tag.id}
                                        className="border border-black px-2.5 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-black"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="max-w-5xl text-[42px] font-black leading-[0.98] tracking-tight text-black md:text-[64px] lg:text-[76px]">
                                {post.title}
                            </h1>

                            <p className="mt-6 max-w-3xl font-serif text-[21px] leading-[1.38] text-black/75 md:text-[24px]">
                                {dek}
                            </p>

                            <div className="mt-8 grid gap-5 border-t border-black/20 pt-6 md:grid-cols-[1fr_auto] md:items-end">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black bg-black text-white">
                                        <UserRound className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/55">
                                            Oleh
                                        </p>
                                        <p className="text-[18px] font-black leading-tight text-black">
                                            {author}
                                        </p>
                                        <p className="mt-1 max-w-lg text-sm leading-relaxed text-black/65">
                                            Catatan redaksi PMII Balikpapan tentang kaderisasi,
                                            organisasi, dan dinamika pergerakan mahasiswa.
                                        </p>
                                    </div>
                                </div>
                                <div className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-black/65 md:text-right">
                                    <p className="inline-flex items-center gap-2 md:justify-end">
                                        <CalendarDays className="h-4 w-4 text-black" />
                                        {formatLongDate(post.createdAt)}
                                    </p>
                                    <p>{readingTime(post.content)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <figure className="mx-auto max-w-[1320px] px-5 pt-8 lg:px-10">
                <div className="relative aspect-[16/9] overflow-hidden bg-primary">
                    {post.image ? (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-accent">
                            <span className="font-mono text-sm uppercase tracking-[0.18em]">
                                Dokumentasi PMII
                            </span>
                        </div>
                    )}
                </div>
                <figcaption className="mt-3 border-b border-black/20 pb-5 font-mono text-[11px] uppercase tracking-[0.08em] text-black/55">
                    Dokumentasi PMII Balikpapan
                </figcaption>
            </figure>

            <div className="mx-auto grid max-w-[1320px] gap-8 px-5 py-10 lg:grid-cols-16 lg:gap-x-[25px] lg:px-10">
                <div className="lg:col-span-3">
                    <ShareRail />
                </div>

                <div className="lg:col-span-8">
                    <div className="mb-8 rounded-[5px] border border-black/20 bg-white p-5">
                        <p className="font-mono text-xs uppercase tracking-[0.08em] text-black">
                            Ringkasan
                        </p>
                        <p className="mt-3 font-serif text-[18px] leading-[1.45] text-black/75">
                            {dek}
                        </p>
                    </div>

                    <div
                        className="article-content max-w-none
                            [&_a]:border-b [&_a]:border-black [&_a]:text-black
                            [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:bg-white [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:font-serif [&_blockquote]:text-[22px] [&_blockquote]:leading-snug [&_blockquote]:text-black
                            [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-[30px] [&_h2]:font-black [&_h2]:leading-tight [&_h2]:text-black
                            [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-[23px] [&_h3]:font-black [&_h3]:leading-tight [&_h3]:text-black
                            [&_li]:mb-2 [&_li]:font-serif [&_li]:text-[20px] [&_li]:leading-[1.65] [&_li]:text-black
                            [&_ol]:mb-7 [&_ol]:list-decimal [&_ol]:pl-7
                            [&_p]:mb-7 [&_p]:font-serif [&_p]:text-[20px] [&_p]:leading-[1.68] [&_p]:text-black
                            [&_strong]:font-black [&_strong]:text-black
                            [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-7"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <footer className="mt-12 border-t-4 border-accent pt-6">
                        <p className="font-mono text-xs uppercase tracking-[0.08em] text-black">
                            Tentang penulis
                        </p>
                        <h2 className="mt-3 text-2xl font-black text-black">{author}</h2>
                        <p className="mt-3 font-serif text-[18px] leading-[1.5] text-black/75">
                            {author} menulis untuk kanal berita PMII Balikpapan, dengan
                            fokus pada dokumentasi kegiatan, gagasan kader, dan isu
                            keorganisasian.
                        </p>
                    </footer>
                </div>

                <aside className="lg:col-span-5">
                    <div className="sticky top-28 space-y-6">
                        <div className="border-t border-black pt-5">
                            <p className="font-mono text-xs uppercase tracking-[0.08em] text-black">
                                Metadata
                            </p>
                            <dl className="mt-4 divide-y divide-black/15 border-y border-black/15 text-sm">
                                <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/55">
                                        Tanggal
                                    </dt>
                                    <dd className="font-semibold text-black">
                                        {formatShortDate(post.createdAt)}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/55">
                                        Kanal
                                    </dt>
                                    <dd className="font-semibold text-black">
                                        {primaryTag(post)}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
                                    <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/55">
                                        Durasi
                                    </dt>
                                    <dd className="font-semibold text-black">
                                        {readingTime(post.content)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="bg-secondary p-6 text-white">
                            <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
                                Kabar Pergerakan
                            </p>
                            <h2 className="mt-3 text-2xl font-black leading-tight text-white">
                                Punya informasi kegiatan PMII?
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-white/85">
                                Kirim dokumentasi, agenda, atau catatan organisasi agar
                                dapat diterbitkan di kanal berita PMII Balikpapan.
                            </p>
                            <Link
                                href="/kontak"
                                className="mt-5 inline-flex items-center rounded-[5px] bg-accent px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-black transition hover:bg-white"
                            >
                                Hubungi redaksi
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>

            {relatedPosts.length > 0 && (
                <section className="mx-auto max-w-[1320px] border-t border-black/20 px-5 py-10 lg:px-10">
                    <div className="mb-6 flex items-end justify-between border-b border-black/20 pb-4">
                        <h2 className="text-[32px] font-black leading-none text-black">
                            Baca juga
                        </h2>
                        <Link
                            href="/berita"
                            className="hidden font-mono text-xs uppercase tracking-[0.08em] text-black hover:border-b hover:border-black md:block"
                        >
                            Semua berita &gt;
                        </Link>
                    </div>
                    <div className="grid gap-[25px] md:grid-cols-3">
                        {relatedPosts.map((related) => (
                            <RelatedCard key={related.id} post={related} />
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
}
