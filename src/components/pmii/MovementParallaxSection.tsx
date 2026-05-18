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

const imagePadding = 12;
const icons = {
  graduation: GraduationCap,
  handshake: Handshake,
  users: Users,
};

function MovementPanel({
  card,
  index,
  total,
}: {
  card: MovementCard;
  index: number;
  total: number;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const Icon = icons[card.icon];

  const { scrollYProgress: imageProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });
  const { scrollYProgress: copyProgress } = useScroll({
    target: copyRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(imageProgress, [0, 1], [1, 0.86]);
  const imageOpacity = useTransform(imageProgress, [0, 1], [1, 0]);
  const y = useTransform(copyProgress, [0, 1], [170, -170]);
  const copyOpacity = useTransform(copyProgress, [0.2, 0.48, 0.82], [0, 1, 0]);

  return (
    <div className="px-3 md:px-4">
      <div className="relative h-[145svh]">
        <motion.div
          ref={targetRef}
          style={{
            backgroundImage: `url(${card.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: `calc(100svh - ${imagePadding * 2}px)`,
            top: imagePadding,
            scale,
          }}
          className="sticky z-0 overflow-hidden rounded-[2rem] shadow-2xl shadow-secondary/25 md:rounded-[3rem]"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-primary/35"
            style={{ opacity: imageOpacity }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        </motion.div>

        <motion.div
          ref={copyRef}
          style={{ y, opacity: copyOpacity }}
          className="absolute left-0 top-0 z-10 flex h-screen w-full flex-col items-center justify-center px-5 text-center text-white"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-secondary shadow-xl md:h-16 md:w-16">
            <Icon className="h-7 w-7 md:h-8 md:w-8" />
          </div>
          <p className="mb-4 font-mono text-xs font-black uppercase tracking-[0.24em] text-accent md:text-sm">
            0{index + 1} / 0{total}
          </p>
          <h2 className="text-[clamp(3.25rem,17vw,11rem)] font-black uppercase leading-[0.84] tracking-normal">
            {card.title}
          </h2>
          <p className="mt-6 max-w-2xl text-2xl font-semibold leading-tight text-white/92 md:text-4xl">
            {card.text}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function MovementParallaxSection({
  cards,
}: {
  cards: MovementCard[];
}) {
  return (
    <section className="bg-white py-3 md:py-4">
      {cards.map((card, index) => (
        <MovementPanel
          key={card.title}
          card={card}
          index={index}
          total={cards.length}
        />
      ))}
    </section>
  );
}
