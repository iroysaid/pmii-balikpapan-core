import type { ReactNode } from "react";

export default function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="w-full min-w-0 rounded-[1.5rem] border border-white/70 bg-white/82 p-4 shadow-[0_20px_60px_rgba(18,37,98,0.08)] backdrop-blur-xl md:rounded-[2rem] md:p-6">
      <div className="mb-4 md:mb-5">
        <h2 className="text-xl font-black text-[#122562]">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-secondary/70">{description}</p>}
      </div>
      {children}
    </section>
  );
}
