import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PlaceholderPage({
  title,
  description,
  href,
  cta = "Buka halaman terkait",
}: {
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/20 bg-white p-8 shadow-sm">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
        Placeholder CMS
      </p>
      <h1 className="text-2xl font-black text-secondary">{title}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-600">
        {description}
      </p>
      {href && (
        <Link
          href={href}
          className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-3 font-bold text-white transition hover:bg-secondary"
        >
          {cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
