/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import type {
  DocumentationContent,
  LandingGalleryActivity,
} from "@/lib/landing/types";

export default function DocumentationSection({
  content,
  galleryItems,
}: {
  content: DocumentationContent;
  galleryItems: LandingGalleryActivity[];
}) {
  const photoTiles = galleryItems
    .flatMap((activity) =>
      activity.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        title: activity.title,
        slug: activity.slug,
      }))
    )
    .slice(0, 6);
  const cmsPhotoTiles = content.photos.map((photo, index) => ({
    id: `${photo.src}-${index}`,
    url: photo.src,
    title: photo.caption || photo.alt,
    slug: content.primaryCta.href,
    alt: photo.alt,
  }));
  const tiles = cmsPhotoTiles.length > 0 ? cmsPhotoTiles : photoTiles;

  return (
    <section id="galeri" className="bg-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
            href={content.primaryCta.href}
            className="inline-flex items-center font-black text-primary hover:text-secondary"
          >
            {content.primaryCta.label}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {tiles.length > 0 ? (
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-6 md:overflow-visible md:px-0 md:pb-0 md:gap-4">
            {tiles.map((photo, index) => (
              <Link
                key={photo.id}
                href={photo.slug.startsWith("/") ? photo.slug : `/galeri/${photo.slug}`}
                className={`group relative h-56 w-[76vw] shrink-0 snap-start overflow-hidden rounded-[1.5rem] bg-secondary/10 transition active:scale-[0.98] md:h-auto md:w-auto md:shrink md:snap-start ${
                  index === 0 ? "md:col-span-2 md:row-span-2 md:aspect-square" : "md:aspect-square"
                }`}
              >
                <img
                  src={photo.url}
                  alt={String("alt" in photo ? photo.alt : photo.title)}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-secondary/20 bg-white p-8 text-center text-secondary">
            <Images className="mx-auto mb-4 h-10 w-10 text-primary" />
            {content.emptyText}
          </div>
        )}

        <div className="mt-7 text-center">
          <Link
            href={content.secondaryCta.href}
            className="inline-flex rounded-full bg-primary px-7 py-3 font-black text-white transition hover:bg-secondary"
          >
            {content.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
