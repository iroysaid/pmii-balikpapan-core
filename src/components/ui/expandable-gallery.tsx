"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import React, { useState, useId, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PHOTOS = [
  {
    id: "photo-1",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop",
    alt: "Kader berkolaborasi",
    rotation: -15,
    x: -90,
    y: 10,
    zIndex: 10,
  },
  {
    id: "photo-2",
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=900&auto=format&fit=crop",
    alt: "Forum diskusi organisasi",
    rotation: -3,
    x: -10,
    y: -15,
    zIndex: 20,
  },
  {
    id: "photo-3",
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop",
    alt: "Kegiatan komunitas mahasiswa",
    rotation: 12,
    x: 75,
    y: 5,
    zIndex: 30,
  },
  {
    id: "photo-4",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop",
    alt: "Kebersamaan kader",
  },
  {
    id: "photo-5",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=900&auto=format&fit=crop",
    alt: "Rapat program kerja",
  },
  {
    id: "photo-6",
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=900&auto=format&fit=crop",
    alt: "Agenda mahasiswa",
  },
  {
    id: "photo-7",
    src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=900&auto=format&fit=crop",
    alt: "Belajar bersama",
  },
  {
    id: "photo-8",
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=900&auto=format&fit=crop",
    alt: "Diskusi strategi",
  },
  {
    id: "photo-9",
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=900&auto=format&fit=crop",
    alt: "Kolaborasi program",
  },
];

const transition = {
  type: "spring",
  stiffness: 160,
  damping: 18,
  mass: 1,
} as const;

export function ExpandableGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const layoutGroupId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  return (
    <section className="relative flex min-h-[850px] w-full flex-col items-center justify-start overflow-hidden bg-background px-4 py-20 md:px-8">
      <LayoutGroup id={layoutGroupId}>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
          <div className="mb-2 flex h-12 w-full items-center justify-between px-4">
            <AnimatePresence>
              {isExpanded && (
                <motion.button
                  animate={{ opacity: 1, x: 0 }}
                  className="group z-50 flex items-center gap-2 text-primary/70 transition-all hover:text-primary"
                  exit={{ opacity: 0, x: -10 }}
                  initial={{ opacity: 0, x: -10 }}
                  key="back-button"
                  onClick={() => setIsExpanded(false)}
                >
                  <div className="rounded-full bg-white p-2 text-primary shadow-sm transition-colors group-hover:bg-accent/20">
                    <ArrowLeft className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Kembali</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            ref={containerRef}
            layout
            className={cn(
              "relative w-full",
              isExpanded
                ? "grid grid-cols-2 gap-6 px-4 md:gap-8 lg:grid-cols-3"
                : "flex flex-col items-center justify-start pt-4"
            )}
            transition={transition}
          >
            <div
              className={cn(
                "relative",
                isExpanded
                  ? "contents"
                  : "mb-8 flex h-[450px] w-full items-center justify-center"
              )}
            >
              {PHOTOS.map((photo, index) => {
                const isPrimary = index < 3;
                if (!isPrimary && !isExpanded) return null;

                return (
                  <motion.div
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: !isExpanded ? photo.rotation || 0 : 0,
                      x: !isExpanded ? photo.x || 0 : 0,
                      y: !isExpanded ? photo.y || 0 : 0,
                      zIndex: !isExpanded ? photo.zIndex || index : 10,
                    }}
                    className={cn(
                      "cursor-pointer overflow-hidden bg-muted",
                      isExpanded
                        ? "relative aspect-square rounded-[2rem] border-4 border-background shadow-lg md:rounded-[3rem] md:border-[6px]"
                        : "absolute h-44 w-44 rounded-[2.5rem] border-[6px] border-background shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:h-60 md:w-60 md:rounded-[3rem]"
                    )}
                    initial={{ opacity: 0, scale: 0.9 }}
                    key={`card-${photo.id}`}
                    layout
                    layoutId={`card-container-${photo.id}`}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                    transition={transition}
                    whileHover={
                      !isExpanded
                        ? {
                            scale: 1.05,
                            y: (photo.y || 0) - 15,
                            rotate: (photo.rotation || 0) * 0.8,
                            zIndex: 50,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            },
                          }
                        : { scale: 1.02 }
                    }
                  >
                    <motion.div
                      className="relative h-full w-full"
                      layout="position"
                      layoutId={`image-inner-${photo.id}`}
                      transition={transition}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="pointer-events-none select-none object-cover"
                        sizes={isExpanded ? "(max-width: 1024px) 50vw, 33vw" : "240px"}
                        priority={isPrimary}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  className="max-w-2xl space-y-8 text-center"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 1 }}
                  key="stack-content"
                >
                  <h2 className="text-2xl font-normal leading-tight tracking-normal text-primary md:text-4xl">
                    Dokumentasi bukan sekadar arsip.
                    <br className="hidden md:block" />
                    Ia adalah ingatan gerakan yang terus hidup.
                  </h2>

                  <div className="flex justify-center">
                    <Button
                      onClick={() => setIsExpanded(true)}
                      className="cursor-pointer rounded-full border-border/40 px-8 py-6 font-normal"
                    >
                      Buka galeri
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>
    </section>
  );
}

export default ExpandableGallery;
