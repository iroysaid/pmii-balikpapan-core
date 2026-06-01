import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronRight } from "lucide-react";
import ActivitySlider from "@/components/ActivitySlider";
import type { AgendaContent, LandingActivity } from "@/lib/landing/types";

export default function AgendaLearningSection({
  content,
  activities,
}: {
  content: AgendaContent;
  activities: LandingActivity[];
}) {
  return (
    <section id="agenda" className="bg-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
            className="inline-flex items-center rounded-full bg-white px-6 py-3 font-black text-primary shadow-sm transition hover:bg-primary hover:text-white"
          >
            {content.cta.label}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <ActivitySlider kegiatan={activities} />

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-5 p-6 md:p-8">
              {content.learningImage?.src ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={content.learningImage.src}
                    alt={content.learningImage.alt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                  <BookOpen className="h-7 w-7" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-black text-primary">
                  {content.learningTitle}
                </h3>
                <p className="mt-2 max-w-xl text-secondary">
                  {content.learningDescription}
                </p>
              </div>
            </div>
            <Link
              href={content.learningCta.href}
              className="mx-6 mb-6 inline-flex justify-center rounded-full bg-primary px-7 py-3 font-black text-white transition hover:bg-secondary md:mx-8 md:mb-0 md:mr-8"
            >
              {content.learningCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
