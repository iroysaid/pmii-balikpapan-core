import Link from "next/link";
import Image from "next/image";
import type { FinalCtaContent } from "@/lib/landing/types";

export default function FinalCtaSection({
  content,
}: {
  content: FinalCtaContent;
}) {
  return (
    <section className="bg-white px-4 py-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary p-7 text-center text-white md:p-14">
        {content.backgroundImage?.src && (
          <Image
            src={content.backgroundImage.src}
            alt={content.backgroundImage.alt}
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black md:text-5xl">{content.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            {content.description}
          </p>
          <Link
            href={content.cta.href}
            className="mt-7 inline-flex rounded-full bg-accent px-8 py-4 font-black text-secondary transition hover:bg-white"
          >
            {content.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
