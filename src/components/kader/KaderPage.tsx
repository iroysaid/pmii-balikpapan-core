import type { ReactNode } from "react";

export default function KaderPage({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full min-w-0 space-y-4 md:space-y-5">
      <header className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-2xl font-black leading-tight text-[#122562] md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary/70">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {children}
    </div>
  );
}
