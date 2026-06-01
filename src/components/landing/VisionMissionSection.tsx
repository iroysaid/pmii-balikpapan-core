import { Leaf, Sparkles } from "lucide-react";
import type { VisionMissionContent } from "@/lib/landing/types";

export default function VisionMissionSection({
  content,
}: {
  content: VisionMissionContent;
}) {
  return (
    <section
      id="profil"
      className="relative z-20 -mt-10 rounded-t-[2.5rem] bg-white px-4 py-16 shadow-[0_-20px_50px_rgba(18,37,98,0.16)] md:-mt-14 md:rounded-t-[3.5rem] md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
            {content.eyebrow}
          </p>
          <h2 className="text-3xl font-black leading-tight text-black md:text-5xl">
            {content.title}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[2rem] border border-secondary/10 bg-background p-6 text-center md:p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-primary">
              {content.visionTitle}
            </h3>
            <p className="text-base leading-relaxed text-secondary md:text-lg">
              {content.vision}
            </p>
          </article>
          <article className="rounded-[2rem] border border-secondary/10 bg-secondary p-6 text-center text-white md:p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-secondary">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-accent">
              {content.missionTitle}
            </h3>
            <ul className="space-y-4 text-base leading-relaxed text-white/88 md:text-lg">
              {content.missions.map((mission) => (
                <li key={mission}>{mission}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
