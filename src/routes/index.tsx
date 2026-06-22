import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { TicketCard } from "@/components/site/TicketCard";
import { useSettings, useServices, useCourses, useReviews } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import aboutImg from "@/assets/about-salon.jpg";
import heroSalon from "@/assets/hero-salon.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rashid Salon & Academy — Hair, beauty and training in Jalandhar" },
      {
        name: "description",
        content:
          "A unisex salon and training academy in Model Town, Jalandhar. Book a chair, or apply to the academy.",
      },
      { property: "og:title", content: "Rashid Salon & Academy" },
      {
        property: "og:description",
        content: "Hair, beauty and training in Model Town, Jalandhar.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: s } = useSettings();
  const settings = (s ?? {}) as Record<string, string>;
  const { data: services = [] } = useServices(true);
  const { data: courses = [] } = useCourses(true);
  const { data: reviews = [] } = useReviews();

  return (
    <SiteLayout>
      {/* HERO */}
      <Section className="pt-12 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Salon · Academy · Model Town, Jalandhar</Eyebrow>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02]">
              {settings.hero_title || "Where pigment meets practice."}
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl">
              {settings.hero_subtitle ||
                "A unisex salon and training academy in Model Town, Jalandhar — sit in the chair, or learn behind it."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/book-appointment"
                className="group inline-flex items-center gap-2 bg-espresso text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors"
              >
                Book a chair{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/academy"
                className="group inline-flex items-center gap-2 border border-espresso px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-card transition-colors"
              >
                Apply to the academy{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-end justify-between gap-4 mb-3">
              <div className="eyebrow">Inside Rashid</div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-[0.16em]">
                Model Town · Jalandhar
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden border border-border bg-card">
              <img
                src={heroSalon}
                alt="Inside Rashid Salon — reception and lounge"
                className="absolute inset-0 h-full w-full object-cover"
                width={1080}
                height={1350}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ABOUT BAND */}
      <div className="bg-card border-y border-border">
        <Section className="py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <img
                src={aboutImg}
                alt="Inside Rashid Salon"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
                width={1024}
                height={1280}
              />
            </div>
            <div className="lg:col-span-7">
              <Eyebrow>About</Eyebrow>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight">
                {settings.about_title || "Two rooms. One craft."}
              </h2>
              <p className="mt-5 text-muted-foreground max-w-xl">{settings.about_description}</p>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <dt className="font-display text-3xl text-copper">
                      {settings[`about_stat_${i}_value`] || "—"}
                    </dt>
                    <dd className="mt-1 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      {settings[`about_stat_${i}_label`] || ""}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm hover:text-copper transition-colors"
              >
                Read more about Rashid <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Section>
      </div>

      {/* FEATURED SERVICES */}
      <Section className="py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <Eyebrow>Salon</Eyebrow>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">From the menu</h2>
          </div>
          <Link to="/services" className="text-sm hover:text-copper inline-flex items-center gap-2">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((svc) => {
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

      {/* ACADEMY BAND */}
      <div className="bg-espresso text-stone-paper">
        <Section className="py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-copper">
                The other half
              </div>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                {settings.academy_title || "Rashid Academy"}
              </h2>
              <p className="mt-5 text-stone-paper/70 max-w-xl">{settings.academy_description}</p>
              <div className="mt-8">
                <Link
                  to="/academy"
                  className="inline-flex items-center gap-2 bg-copper text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-stone-paper hover:text-espresso transition-colors"
                >
                  See all courses <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <dl className="lg:col-span-5 grid grid-cols-3 gap-5 border-t border-stone-paper/15 pt-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <dt className="font-display text-3xl text-brass">
                    {settings[`academy_stat_${i}_value`] || "—"}
                  </dt>
                  <dd className="mt-1 text-[11px] font-mono uppercase tracking-[0.14em] text-stone-paper/60">
                    {settings[`academy_stat_${i}_label`] || ""}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 3).map((c, i) => {
              const v = c as Record<string, string | number>;
              return (
                <Link
                  key={String(v.id)}
                  to="/academy/$slug"
                  params={{ slug: String(v.slug) }}
                  className="group block border border-stone-paper/15 p-6 hover:border-copper transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs tracking-[0.14em] text-brass">
                      M.{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-paper/50">
                      {String(v.duration || "")}
                    </span>
                  </div>
                  <h3 className="font-display text-xl leading-tight">{String(v.name)}</h3>
                  <p className="mt-3 text-sm text-stone-paper/60 line-clamp-3">
                    {String(v.description || "")}
                  </p>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-paper/10">
                    <span className="font-mono text-sm text-stone-paper/80">
                      {formatINR(v.fee as number)}
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:text-copper transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      </div>

      {/* REVIEWS */}
      <Section className="py-16 lg:py-24">
        <Eyebrow>The room</Eyebrow>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">What our chairs have heard.</h2>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r) => {
            const v = r as Record<string, string | number>;
            return (
              <figure key={String(v.id)} className="border border-border bg-card p-6 flex flex-col">
                <div className="flex gap-1 text-copper mb-4">
                  {Array.from({ length: Number(v.rating) || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="font-display text-lg leading-snug flex-1">
                  "{String(v.review)}"
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-border font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  — {String(v.name)}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Section>

      {/* CTA STRIP */}
      <div className="border-t border-border">
        <Section className="py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display text-3xl">Ready when you are.</h3>
            <p className="mt-2 text-sm text-muted-foreground">Two front doors, one craft.</p>
          </div>
          <div className="flex gap-3 md:justify-end flex-wrap">
            <Link
              to="/book-appointment"
              className="bg-espresso text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors"
            >
              Book a chair
            </Link>
            <Link
              to="/academy"
              className="border border-espresso px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-card transition-colors"
            >
              Apply to the academy
            </Link>
          </div>
        </Section>
      </div>
    </SiteLayout>
  );
}
