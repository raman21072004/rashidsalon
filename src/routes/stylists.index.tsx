import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useStylists } from "@/lib/queries";

export const Route = createFileRoute("/stylists/")({
  head: () => ({
    meta: [
      { title: "Stylists — Rashid Salon & Academy" },
      {
        name: "description",
        content: "Meet the senior stylists and educators at Rashid Salon & Academy.",
      },
    ],
  }),
  component: StylistsPage,
});

function StylistsPage() {
  const { data: stylists = [] } = useStylists();
  const navigate = useNavigate();
  return (
    <SiteLayout>
      <Section className="pt-16 pb-10">
        <Eyebrow>The team</Eyebrow>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Stylists</h1>
      </Section>
 
      <Section className="pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylists.map((s) => {
            const v = s as Record<string, string>;
            return (
              <div
                key={v.id}
                onClick={() => navigate({ to: "/stylists/$id", params: { id: v.id } })}
                className="group block border border-border bg-card p-6 hover:border-copper transition-colors cursor-pointer"
              >
                <div className="aspect-square bg-secondary mb-5 grid place-items-center font-display text-6xl text-muted-foreground">
                  {v.photo_url ? (
                    <img
                      src={v.photo_url}
                      alt={v.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    (v.name?.[0] ?? "—")
                  )}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-copper">
                  {v.specialization}
                </div>
                <h2 className="mt-1 font-display text-2xl">{v.name}</h2>
                <div className="mt-1 font-mono text-xs text-muted-foreground">{v.experience}</div>
                {v.instagram && (
                  <a
                    href={v.instagram}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-copper"
                  >
                    <Instagram className="h-3.5 w-3.5" /> Instagram
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </SiteLayout>
  );
}
