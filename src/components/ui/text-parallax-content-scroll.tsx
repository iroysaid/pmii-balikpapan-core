"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export const TextParallaxContentExample = () => {
  return (
    <div className="bg-white">
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
        subheading="Kaderisasi"
        heading="Dibangun untuk bertumbuh bersama."
      >
        <ExampleContent
          title="Ruang belajar yang hidup"
          body="PMII menjadi tempat kader mengasah pengetahuan, keberanian bicara, dan kepekaan sosial melalui forum kaderisasi, diskusi, serta pendampingan."
        />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2564&auto=format&fit=crop"
        subheading="Gerakan"
        heading="Berpihak pada masyarakat."
      >
        <ExampleContent
          title="Aksi yang punya arah"
          body="Setiap agenda dirancang untuk menyambungkan gagasan kampus dengan kebutuhan warga, dari advokasi, literasi publik, sampai kerja sosial."
        />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2416&auto=format&fit=crop"
        subheading="Solidaritas"
        heading="Sahabat dalam satu barisan."
      >
        <ExampleContent
          title="Kebersamaan yang terorganisir"
          body="Di PMII, persahabatan tidak berhenti pada pertemuan. Ia tumbuh menjadi jejaring kader yang saling menguatkan dalam proses panjang."
        />
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

type TextParallaxContentProps = {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: React.ReactNode;
};

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
}: TextParallaxContentProps) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }: { imgUrl: string }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div className="absolute inset-0 bg-neutral-950/70" style={{ opacity }} />
    </motion.div>
  );
};

const OverlayCopy = ({
  subheading,
  heading,
}: {
  subheading: string;
  heading: string;
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center px-4 text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">{subheading}</p>
      <p className="text-center text-4xl font-bold tracking-normal md:text-7xl">
        {heading}
      </p>
    </motion.div>
  );
};

const ExampleContent = ({ title, body }: { title: string; body: string }) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold text-primary md:col-span-4">
      {title}
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl">{body}</p>
      <a
        href="/profil"
        className="inline-flex w-full items-center justify-center rounded bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit"
      >
        Pelajari lagi <FiArrowUpRight className="ml-2 inline" />
      </a>
    </div>
  </div>
);
