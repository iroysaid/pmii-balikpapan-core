import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroContent } from "@/lib/landing/types";
import RotatingStudyButton from "./RotatingStudyButton";

export default function HeroSection({ content }: { content: HeroContent }) {
  const [firstFloating, secondFloating] = content.floatingImages;

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-primary text-white">
      {content.backgroundImage?.src && (
        <Image
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
      )}
      {content.backgroundImage?.src && (
        <div className="absolute inset-0 bg-primary/70" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:3.25rem_3.25rem]" />
      <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] flex-col px-4 py-6 md:py-12">
        <div className="flex flex-1 items-center justify-center py-5 md:py-8">
          <div className="relative w-full max-w-6xl text-center">
            {content.mainImage?.src && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/20 opacity-25 shadow-2xl md:h-96 md:w-96">
                <Image
                  src={content.mainImage.src}
                  alt={content.mainImage.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 256px, 384px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="relative z-20 space-y-0.5 md:space-y-3">
              <div className="flex items-start justify-start gap-2 pl-[4%] md:items-center md:gap-5 md:pl-[18%]">
                <h1
                  className="text-[clamp(3.7rem,16vw,10rem)] font-black uppercase leading-[0.82] tracking-normal text-accent"
                  style={{
                    fontFamily: '"Arial Black", Impact, sans-serif',
                    textShadow:
                      "1px 1px 0 #122562, 2px 2px 0 #122562, 3px 3px 0 #122562, 4px 4px 0 #122562, 5px 5px 0 #122562, 6px 6px 0 #122562, 7px 7px 0 #122562",
                  }}
                >
                  {content.title}
                </h1>
                <RotatingStudyButton
                  cta={content.studyCta}
                  className="mt-0 h-[5rem] w-[5rem] sm:h-32 sm:w-32 md:h-36 md:w-36"
                />
              </div>
              <h2
                className="text-[clamp(2.8rem,11.5vw,7rem)] font-black uppercase leading-[0.83] tracking-normal"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "1px 1px 0 #122562, 2px 2px 0 #122562, 3px 3px 0 #122562, 4px 4px 0 #122562, 5px 5px 0 #122562, 6px 6px 0 #122562",
                }}
              >
                {content.titleHighlight}
              </h2>
              <div className="flex justify-start pl-[14%] md:pl-[30%]">
                <h2
                  className="text-[clamp(2.45rem,10.5vw,6rem)] font-black uppercase leading-[0.83] tracking-normal"
                  style={{
                    fontFamily: '"Arial Black", Impact, sans-serif',
                    textShadow:
                      "1px 1px 0 #122562, 2px 2px 0 #122562, 3px 3px 0 #122562, 4px 4px 0 #122562, 5px 5px 0 #122562",
                  }}
                >
                  {content.titleSuffix}
                </h2>
              </div>
            </div>

            <p className="relative z-30 mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-white/88 md:mt-8 md:text-xl">
              {content.description}
            </p>

            <div className="relative z-30 mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={content.primaryCta.href}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3 font-black text-secondary shadow-xl transition hover:bg-white"
              >
                {content.primaryCta.label}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="pointer-events-none absolute inset-0 z-10">
              {firstFloating && (
                <div className="absolute -left-2 bottom-[4%] w-28 -rotate-6 rounded-[1.35rem] border border-white/30 bg-white/14 p-2.5 opacity-75 shadow-2xl backdrop-blur-md motion-safe:animate-[pmii-float-soft_7s_ease-in-out_infinite] sm:w-36 md:-left-8 md:bottom-[8%] md:w-44 md:-rotate-12 md:p-4 md:opacity-100">
                  <div className="relative mb-2 h-14 overflow-hidden rounded-xl md:mb-3 md:h-20 md:rounded-2xl">
                    <Image
                      src={firstFloating.image}
                      alt={firstFloating.alt}
                      fill
                      sizes="(max-width: 768px) 112px, 176px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-left text-[11px] font-black md:text-sm">
                    {firstFloating.title}
                  </p>
                  <p className="text-left text-[9px] text-white/75 md:text-xs">
                    {firstFloating.description}
                  </p>
                </div>
              )}
              {secondFloating && (
                <div className="absolute right-0 top-[8%] w-24 rotate-6 rounded-[1.35rem] border border-white/30 bg-white/14 p-2.5 opacity-70 shadow-2xl backdrop-blur-md motion-safe:animate-[pmii-float-soft_8s_ease-in-out_infinite] sm:w-36 md:-right-8 md:w-44 md:rotate-12 md:p-4 md:opacity-100">
                  <div className="relative mb-2 h-12 overflow-hidden rounded-xl md:mb-3 md:h-20 md:rounded-2xl">
                    <Image
                      src={secondFloating.image}
                      alt={secondFloating.alt}
                      fill
                      sizes="(max-width: 768px) 96px, 176px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-left text-[11px] font-black md:text-sm">
                    {secondFloating.title}
                  </p>
                  <p className="text-left text-[9px] text-white/75 md:text-xs">
                    {secondFloating.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
