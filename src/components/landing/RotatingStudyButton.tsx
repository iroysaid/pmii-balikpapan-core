import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { CtaLink } from "@/lib/landing/types";

export default function RotatingStudyButton({
  cta,
  className = "",
}: {
  cta: CtaLink;
  className?: string;
}) {
  return (
    <Link
      href={cta.href}
      aria-label={cta.label}
      className={`group relative flex h-24 w-24 shrink-0 rotate-6 items-center justify-center rounded-full bg-white text-secondary shadow-2xl ring-4 ring-white/20 transition hover:rotate-0 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent/70 active:scale-95 motion-safe:animate-[pmii-float-soft_5.5s_ease-in-out_infinite,pmii-pulse-glow_3.8s_ease-in-out_infinite] sm:h-28 sm:w-28 ${className}`}
    >
      <div className="absolute inset-1 motion-safe:animate-[spin_12s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            id="studyCirclePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text
            className="text-[8px] font-black uppercase tracking-[0.2em] sm:text-[9px]"
            fill="#122562"
          >
            <textPath href="#studyCirclePath" startOffset="0%">
              {cta.label.toUpperCase()} • E-LEARNING KADER •
            </textPath>
          </text>
        </svg>
      </div>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-secondary transition group-hover:bg-primary group-hover:text-white sm:h-14 sm:w-14">
        <BookOpen className="h-6 w-6" />
      </span>
    </Link>
  );
}
