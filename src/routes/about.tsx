import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useSettings } from "@/lib/queries";
import aboutImg from "@/assets/about-salon.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Rashid Salon & Academy" },
      {
        name: "description",
        content:
          "Two rooms, one craft — meet the team and the studio at Rashid Salon & Academy in Model Town, Jalandhar.",
      },
      { property: "og:title", content: "About Rashid Salon & Academy" },
      {
        property: "og:description",
        content: "Two rooms, one craft — meet the team and the studio.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: s } = useSettings();
  const settings = (s ?? {}) as Record<string, string>;

  return (
    <SiteLayout>
      <Section className="pt-16 pb-12">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl max-w-3xl leading-[1.05]">
          {settings.about_title || "Two rooms. One craft."}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{settings.about_description}</p>
      </Section>

      <Section className="pb-16">
        <img
          src={aboutImg}
          alt="Rashid Salon interior"
          className="w-full aspect-[16/9] object-cover"
          loading="lazy"
        />
      </Section>

      <div className="bg-card border-y border-border">
        <Section className="py-16 grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="font-display text-5xl text-copper">
                {settings[`about_stat_${i}_value`] || "—"}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {settings[`about_stat_${i}_label`] || ""}
              </div>
            </div>
          ))}
        </Section>
      </div>

      <Section className="py-16 grid md:grid-cols-2 gap-10 max-w-5xl">
        <div>
          <Eyebrow>Philosophy</Eyebrow>
          <h2 className="mt-3 font-display text-3xl">Take the time it takes.</h2>
          <p className="mt-4 text-muted-foreground">
            No rushed consultations. We ask about your hair history, the look you're after, and what
            you can actually maintain. Then we book the right amount of chair time and price
            honestly.
          </p>
        </div>
        <div>
          <Eyebrow>The Academy</Eyebrow>
          <h2 className="mt-3 font-display text-3xl">Real chairs, real clients.</h2>
          <p className="mt-4 text-muted-foreground">
            Our students learn the same way we did — on a working floor, supervised, with feedback
            the same day. Small batches, real curriculum, certified.
          </p>
        </div>
      </Section>
    </SiteLayout>
  );
}
