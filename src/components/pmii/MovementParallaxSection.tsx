"use client";

import Image from "next/image";
import { GraduationCap, Handshake, Users } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type MovementCard = {
  title: string;
  text: string;
  image: string;
  icon: "graduation" | "handshake" | "users";
};

const icons = {
  graduation: GraduationCap,
  handshake: Handshake,
  users: Users,
};

const opacityStops = [
  {
    input: [0, 0.3, 0.38],
    output: [1, 1, 0],
    center: 0.17,
  },
  {
    input: [0.3, 0.38, 0.62, 0.7],
    output: [0, 1, 1, 0],
    center: 0.5,
  },
  {
    input: [0.62, 0.7, 1],
    output: [0, 1, 1],
    center: 0.84,
  },
];

function progressRange(index: number, total: number) {
  if (total === 3) {
    return opacityStops[index];
  }

  const start = index / total;
  const center = (index + 0.5) / total;
  const end = (index + 1) / total;
  const fade = 0.06;

  return {
    input: [
      Math.max(0, start - fade),
      Math.min(1, start + fade),
      Math.max(0, end - fade),
      Math.min(1, end + fade),
    ],
    output: [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0],
    center,
  };
}

function StoryLayer({
  card,
  index,
  total,
  progress,
}: {
  card: MovementCard;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const Icon = icons[card.icon];
  const range = progressRange(index, total);
  const opacity = useTransform(progress, range.input, range.output);
  const imageScale = useTransform(
    progress,
    [Math.max(0, range.center - 0.2), range.center, Math.min(1, range.center + 0.2)],
    [1.025, 1, 1.035]
  );
  const textY = useTransform(
    progress,
    [Math.max(0, range.center - 0.18), range.center, Math.min(1, range.center + 0.18)],
    [22, 0, -22]
  );

  return (
    <>
      <motion.div
        style={{ opacity, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="100vw"
          className="h-full w-full object-cover"
          priority={index === 0}
        />
      </motion.div>
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,40,70,0.86),rgba(0,40,70,0.28)_58%,rgba(0,40,70,0)_100%)] md:bg-[linear-gradient(to_right,rgba(0,40,70,0.8),rgba(0,40,70,0.58)_38%,rgba(0,40,70,0)_100%)]"
      />
      <motion.div
        style={{ opacity, y: textY }}
        className="absolute inset-0 z-10 flex items-end px-6 py-8 will-change-transform sm:px-8 md:items-center md:px-12 md:py-12 lg:px-20"
      >
        <div className="max-w-[19rem] pb-3 text-left text-white sm:max-w-md md:max-w-2xl md:pb-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-secondary shadow-xl sm:h-12 sm:w-12 md:mb-5 md:h-16 md:w-16">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
          </div>
          <p className="mb-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.22em] text-accent sm:text-xs md:text-sm">
            0{index + 1} / 0{total}
          </p>
          <h2 className="text-[clamp(2rem,9.8vw,8.5rem)] font-black uppercase leading-[0.9] tracking-normal">
            {card.title}
          </h2>
          <p className="mt-4 max-w-[17rem] text-[clamp(0.95rem,4vw,2.65rem)] font-semibold leading-snug text-white/92 sm:max-w-sm md:mt-6 md:max-w-2xl">
            {card.text}
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default function MovementParallaxSection({
  cards,
}: {
  cards: MovementCard[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[330svh] bg-white"
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center px-4 py-4 md:px-8">
        <div className="relative isolate h-[calc(100svh-32px)] w-full overflow-hidden rounded-[2rem] bg-secondary shadow-2xl shadow-secondary/25 md:rounded-[3rem]">
          {cards.map((card, index) => (
            <StoryLayer
              key={card.title}
              card={card}
              index={index}
              total={cards.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
