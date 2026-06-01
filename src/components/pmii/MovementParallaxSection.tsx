"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, GraduationCap, Handshake, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { MovementCard } from "@/lib/landing/types";

const icons = {
  graduation: GraduationCap,
  handshake: Handshake,
  users: Users,
};

function MovementSlide({
  card,
  index,
  total,
  direction,
}: {
  card: MovementCard;
  index: number;
  total: number;
  direction: number;
}) {
  const Icon = icons[card.icon];

  return (
    <motion.div
      key={card.title}
      initial={{ opacity: 0, x: direction * 90, scale: 0.985 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction * -90, scale: 1.015 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      <motion.div
        animate={{ scale: [1, 1.035, 1.015] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Image
          src={card.image}
          alt={card.alt || card.title}
          fill
          sizes="100vw"
          className="h-full w-full object-cover"
          priority={index === 0}
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,40,70,0.86),rgba(0,40,70,0.34)_58%,rgba(0,40,70,0)_100%)] md:bg-[linear-gradient(to_right,rgba(0,40,70,0.82),rgba(0,40,70,0.54)_40%,rgba(0,40,70,0)_100%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.45, ease: "easeOut" }}
        className="absolute inset-0 z-10 flex items-end px-6 py-8 will-change-transform sm:px-8 md:items-center md:px-12 md:py-12 lg:px-20"
      >
        <div className="max-w-[19rem] pb-3 text-left text-white sm:max-w-md md:max-w-2xl md:pb-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-secondary shadow-xl sm:h-12 sm:w-12 md:mb-5 md:h-16 md:w-16">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
          </div>
          <p className="mb-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.22em] text-accent sm:text-xs md:text-sm">
            0{index + 1} / 0{total}
          </p>
          <h2 className="text-[clamp(2rem,9.5vw,7.5rem)] font-black uppercase leading-[0.9] tracking-normal">
            {card.title}
          </h2>
          <p className="mt-4 max-w-[17rem] text-[clamp(0.95rem,3.8vw,2.35rem)] font-semibold leading-snug text-white/92 sm:max-w-sm md:mt-6 md:max-w-2xl">
            {card.text}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MovementParallaxSection({
  cards,
}: {
  cards: MovementCard[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function goTo(nextIndex: number, nextDirection?: number) {
    const normalizedIndex = (nextIndex + cards.length) % cards.length;
    setDirection(nextDirection ?? (normalizedIndex > activeIndex ? 1 : -1));
    setActiveIndex(normalizedIndex);
  }

  if (cards.length === 0) return null;

  return (
    <section className="bg-white px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="relative isolate h-[min(500px,calc(100svh-104px))] min-h-[380px] w-full overflow-hidden rounded-[2rem] bg-secondary shadow-2xl shadow-secondary/25 md:h-[min(680px,calc(100svh-64px))] md:min-h-[560px] md:rounded-[3rem]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <MovementSlide
              key={cards[activeIndex].title}
              card={cards[activeIndex]}
              index={activeIndex}
              total={cards.length}
              direction={direction}
            />
          </AnimatePresence>

          <button
            type="button"
            aria-label="Slide sebelumnya"
            onClick={() => goTo(activeIndex - 1, -1)}
            className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/16 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-accent md:left-5 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            type="button"
            aria-label="Slide berikutnya"
            onClick={() => goTo(activeIndex + 1, 1)}
            className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/16 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-accent md:right-5 md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/14 px-3 py-2 backdrop-blur-xl md:bottom-7">
            {cards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                aria-label={`Buka slide ${card.title}`}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index ? "w-8 bg-accent" : "w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
