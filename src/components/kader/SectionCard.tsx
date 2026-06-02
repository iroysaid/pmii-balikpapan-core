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
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_24px_80px_rgba(18,37,98,0.09)] backdrop-blur-xl md:p-7">
      <div className="mb-5">
        <h2 className="text-xl font-black text-[#122562]">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-secondary/70">{description}</p>}
      </div>
      {children}
    </section>
  );
}

