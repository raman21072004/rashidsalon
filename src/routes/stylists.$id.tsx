import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, Facebook } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useStylist } from "@/lib/queries";

export const Route = createFileRoute("/stylists/$id")({
  component: StylistDetail,
});

function StylistDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useStylist(id);
  const v = (data ?? {}) as Record<string, string>;

  if (isLoading)
    return (
      <SiteLayout>
        <Section className="py-20">
          <p>Loading…</p>
        </Section>
      </SiteLayout>
    );
  if (!data)
    return (
      <SiteLayout>
        <Section className="py-20">
          <p>Stylist not found.</p>
          <Link to="/stylists" className="text-copper">
            Back
          </Link>
        </Section>
      </SiteLayout>
    );

  return (
    <SiteLayout>
      <Section className="pt-12 pb-20">
        <Link
          to="/stylists"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-copper"
        >
          ← All stylists
        </Link>
        <div className="mt-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-card border border-border grid place-items-center font-display text-8xl text-muted-foreground">
              {v.photo_url ? (
                <img src={v.photo_url} alt={v.name} className="h-full w-full object-cover" />
              ) : (
                v.name?.[0]
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>{v.specialization}</Eyebrow>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">{v.name}</h1>
            <div className="mt-3 font-mono text-sm text-muted-foreground">{v.experience}</div>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">{v.bio}</p>
            {v.availability && (
              <p className="mt-4 text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-copper">
                  Available
                </span>{" "}
                · {v.availability}
              </p>
            )}
            <div className="mt-8 flex gap-3">
              {v.instagram && (
                <a
                  href={v.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-border hover:border-copper hover:text-copper"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {v.facebook && (
                <a
                  href={v.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-border hover:border-copper hover:text-copper"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
            <Link
              to="/book-appointment"
              className="mt-10 inline-block bg-espresso text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors"
            >
              Book with {v.name?.split(" ")[0]}
            </Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
