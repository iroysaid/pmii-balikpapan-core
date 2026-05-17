"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
};

export function Marquee({
  children,
  className,
  reverse,
  pauseOnHover,
  vertical,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:34s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          aria-hidden={index === 1}
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)]",
            vertical
              ? "animate-marquee-vertical flex-col"
              : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
          key={index}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
