import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { TicketCard } from "@/components/site/TicketCard";
import { useServices } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Rashid Salon & Academy" },
      {
        name: "description",
        content: "Hair, color, grooming, bridal, skin and nails — the full salon menu at Rashid.",
      },
      { property: "og:title", content: "Salon Services — Rashid" },
      { property: "og:description", content: "Hair, color, grooming, bridal, skin and nails." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [] } = useServices();
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      const c = (s as Record<string, string>).category;
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set)];
  }, [services]);

  const filtered =
    category === "All"
      ? services
      : services.filter((s) => (s as Record<string, string>).category === category);

  return (
    <SiteLayout>
      <Section className="pt-16 pb-10">
        <Eyebrow>Salon menu</Eyebrow>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Services</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Prices are starting points. Final quote happens at the chair, after a real consultation.
        </p>
      </Section>

      <Section className="pb-6">
        <div className="flex flex-wrap gap-2 border-b border-border pb-5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] border transition-colors ${
                category === c
                  ? "bg-espresso text-stone-paper border-espresso"
                  : "border-border hover:border-copper hover:text-copper"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((svc) => {
            const v = svc as Record<string, string | number>;
            return (
              <Link key={String(v.id)} to="/services/$slug" params={{ slug: String(v.slug) }}>
                <TicketCard className="h-full hover:border-copper transition-colors">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-3">
                    <span>{String(v.category || "—")}</span>
                    <span>{String(v.duration || "")}</span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight">{String(v.name)}</h3>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {String(v.description || "")}
                  </p>
                  <div className="mt-5 flex items-end justify-between">
                    <span className="font-mono text-lg text-copper">
                      {formatINR(v.price as number)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TicketCard>
              </Link>
            );
          })}
        </div>
      </Section>
    </SiteLayout>
  );
}
