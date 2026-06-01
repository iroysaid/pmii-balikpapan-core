/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { LandingPost, NewsContent } from "@/lib/landing/types";
import { excerpt } from "@/lib/landing/utils";

export default function LatestNewsSection({
  content,
  posts,
}: {
  content: NewsContent;
  posts: LandingPost[];
}) {
  return (
    <section id="berita" className="bg-white px-4 pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
              {content.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-black md:text-5xl">
              {content.title}
            </h2>
            {content.description && (
              <p className="mt-3 max-w-xl text-secondary">
                {content.description}
              </p>
            )}
          </div>
          <Link
            href={content.cta.href}
            className="inline-flex shrink-0 items-center font-black text-primary hover:text-secondary"
          >
            {content.cta.label}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-secondary/20 p-8 text-center text-secondary">
            {content.emptyText}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-12">
            <article className="group overflow-hidden rounded-[2rem] border border-secondary/10 bg-white shadow-sm lg:col-span-7">
              <Link href={`/berita/${posts[0].slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary/10 md:aspect-[16/10]">
                  {posts[0].image ? (
                    <img
                      src={posts[0].image}
                      alt={posts[0].title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary text-2xl font-black text-white">
                      PMII
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-wider text-secondary">
                    {content.headlineLabel}
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-secondary/70">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {new Date(posts[0].createdAt).toLocaleDateString("id-ID")}
                  </div>
                  <h3 className="text-3xl font-black leading-tight text-black transition group-hover:text-primary md:text-5xl">
                    {posts[0].title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg">
                    {excerpt(posts[0].content, 180)}
                  </p>
                  <span className="mt-6 inline-flex items-center font-black text-primary">
                    Baca {content.headlineLabel}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </div>
              </Link>
            </article>

            <div className="grid gap-5 lg:col-span-5">
              {posts.slice(1, 4).map((post, index) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-[1.5rem] border border-secondary/10 bg-background shadow-sm transition hover:bg-white"
                >
                  <Link href={`/berita/${post.slug}`} className="grid gap-4 p-4 sm:grid-cols-[9rem_1fr]">
                    <div className="relative aspect-video overflow-hidden rounded-[1.1rem] bg-secondary/10 sm:aspect-square">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-primary">
                          PMII
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-primary">
                        {content.popularLabel} 0{index + 1}
                      </p>
                      <h3 className="line-clamp-2 text-xl font-black leading-tight text-black transition group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-secondary">
                        {excerpt(post.content, 95)}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
