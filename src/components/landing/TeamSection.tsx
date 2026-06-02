import Image from "next/image";
import type { TeamContent } from "@/lib/landing/types";

export default function TeamSection({ content }: { content: TeamContent }) {
  const members = content.members
    .filter((member) => member.showOnHomepage !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <section className="overflow-hidden bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
              {content.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-black md:text-5xl">
              {content.title}
            </h2>
          </div>
          <p className="max-w-xl text-secondary">{content.description}</p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6">
          {members.map((member) => (
            <article
              key={`${member.name}-${member.role}`}
              tabIndex={0}
              className="group w-[72vw] max-w-[18rem] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-secondary/10 bg-white shadow-sm outline-none transition focus-within:shadow-xl focus:shadow-xl active:scale-[0.99] md:w-auto md:max-w-none"
            >
              <div className="relative h-80 overflow-hidden bg-secondary/5 md:h-72">
                <Image
                  src={member.image}
                  alt={member.alt || member.name}
                  fill
                  sizes="(max-width: 768px) 72vw, 180px"
                  className="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-focus:grayscale-0 group-active:grayscale-0"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-black text-black">{member.name}</h3>
                <p className="mt-1 text-sm text-secondary">{member.role}</p>
                {member.department && (
                  <p className="mt-2 inline-flex rounded-full bg-primary/8 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-primary">
                    {member.department}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
