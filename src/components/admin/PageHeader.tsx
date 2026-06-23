import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="px-5 pt-6 pb-4 md:px-8 md:pt-10 md:pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="mt-1 font-display text-3xl md:text-4xl truncate">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
