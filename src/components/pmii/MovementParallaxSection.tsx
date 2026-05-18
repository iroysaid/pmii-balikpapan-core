"use client";

import { GraduationCap, Handshake, Users } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
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

function progressRange(index: number, total: number) {
  const start = index / total;
  const center = (index + 0.5) / total;
  const end = (index + 1) / total;

  return {
    fade: [
      Math.max(0, start - 0.08),
      Math.max(0, start + 0.08),
      Math.min(1, end - 0.08),
      Math.min(1, end + 0.08),
    ],
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
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const Icon = icons[card.icon];
  const range = progressRange(index, total);
  const opacity = useTransform(progress, range.fade, [0, 1, 1, 0]);
  const imageScale = useTransform(
    progress,
    [Math.max(0, range.center - 0.18), range.center, Math.min(1, range.center + 0.18)],
    [1.06, 1, 1.08]
  );
  const textY = useTransform(
    progress,
    [Math.max(0, range.center - 0.18), range.center, Math.min(1, range.center + 0.18)],
    [34, 0, -34]
  );

  return (
    <>
      <motion.div
        style={{
          backgroundImage: `url(${card.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity,
          scale: imageScale,
        }}
        className="absolute inset-0"
      />
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,37,98,0.84)_0%,rgba(18,37,98,0.74)_34%,rgba(38,46,237,0.28)_62%,rgba(38,46,237,0)_100%)]"
      />
      <motion.div
        style={{ opacity, y: textY }}
        className="absolute inset-0 z-10 flex items-center px-5 py-10 sm:px-8 md:px-12 lg:px-20"
      >
        <div className="max-w-[19rem] text-left text-white sm:max-w-md md:max-w-2xl">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-secondary shadow-xl sm:h-12 sm:w-12 md:h-16 md:w-16">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
          </div>
          <p className="mb-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.22em] text-accent sm:text-xs md:text-sm">
            0{index + 1} / 0{total}
          </p>
          <h2 className="text-[clamp(2.35rem,12vw,9rem)] font-black uppercase leading-[0.86] tracking-normal">
            {card.title}
          </h2>
          <p className="mt-4 max-w-[17rem] text-[clamp(1.05rem,4.8vw,2.8rem)] font-semibold leading-tight text-white/92 sm:max-w-sm md:mt-6 md:max-w-2xl">
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
  const { scrollYProgress: imageProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const frameScale = useTransform(imageProgress, [0, 0.08, 0.92, 1], [0.96, 1, 1, 0.96]);

  return (
    <section ref={sectionRef} className="relative h-[320svh] bg-white px-3 py-3 md:px-4 md:py-4">
      <div className="sticky top-3 h-[calc(100svh-1.5rem)] overflow-hidden md:top-4 md:h-[calc(100svh-2rem)]">
        <motion.div
          style={{ scale: frameScale }}
          className="relative h-full overflow-hidden rounded-[1.75rem] bg-secondary shadow-2xl shadow-secondary/25 md:rounded-[3rem]"
        >
          {cards.map((card, index) => (
            <StoryLayer
              key={card.title}
              card={card}
              index={index}
              total={cards.length}
              progress={imageProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
