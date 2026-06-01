import type { NdpContent } from "@/lib/landing/types";

export default function NdpSection({ content }: { content: NdpContent }) {
  return (
    <section className="bg-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-primary md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
            {content.description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-secondary/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-black text-secondary">
                {index + 1}
              </div>
              <h3 className="mb-3 text-xl font-black text-primary">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-secondary">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
