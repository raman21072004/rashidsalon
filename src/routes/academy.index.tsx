import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Users, Award } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useCourses, useSettings } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import academyImg from "@/assets/academy.jpg";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Rashid Academy — Beauty & hairdressing training in Jalandhar" },
      {
        name: "description",
        content:
          "Diplomas in hairdressing, color, bridal makeup, skin and nails. Real chairs, real clients, certified.",
      },
      { property: "og:title", content: "Rashid Academy" },
      {
        property: "og:description",
        content: "Hands-on beauty and hairdressing training in Model Town, Jalandhar.",
      },
      { property: "og:image", content: "/og-academy.jpg" },
    ],
  }),
  component: AcademyPage,
});

function AcademyPage() {
  const { data: s } = useSettings();
  const settings = (s ?? {}) as Record<string, string>;
  const { data: courses = [] } = useCourses();

  return (
    <SiteLayout>
      <div className="bg-espresso text-stone-paper">
        <Section className="pt-20 pb-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-brass">
                Rashid Academy
              </div>
              <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02]">
                {settings.academy_title || "Learn behind the chair."}
              </h1>
              <p className="mt-6 text-lg text-stone-paper/70 max-w-xl">
                {settings.academy_description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#courses"
                  className="bg-copper text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-stone-paper hover:text-espresso transition-colors inline-flex items-center gap-2"
                >
                  See courses <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <Link
                  to="/contact"
                  className="border border-stone-paper/30 px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-stone-paper/10 transition-colors"
                >
                  Talk to admissions
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <img
                src={academyImg}
                alt="Academy classroom"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Why train here */}
      <Section className="py-20">
        <Eyebrow>Why train here</Eyebrow>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl max-w-2xl">
          Three things we won't compromise on.
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Small batches",
              text: "No oversold classrooms. Every student gets bench time and one-on-one feedback.",
            },
            {
              icon: GraduationCap,
              title: "Real-floor practicum",
              text: "Final weeks are spent on real, paying clients — supervised, but real.",
            },
            {
              icon: Award,
              title: "Certified educators",
              text: "Taught by stylists with 6–15 years on the floor, not slide-deck instructors.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="border-l-2 border-copper pl-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-copper">0{i + 1}</span>
                <Icon className="h-4 w-4 text-copper" />
              </div>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Courses */}
      <div id="courses" className="bg-card border-y border-border scroll-mt-20">
        <Section className="py-20">
          <Eyebrow>Course catalogue</Eyebrow>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Pick where to begin.</h2>

          <div className="mt-12 grid gap-6">
            {courses.map((c, i) => {
              const v = c as Record<string, string | number>;
              return (
                <Link
                  key={String(v.id)}
                  to="/academy/$slug"
                  params={{ slug: String(v.slug) }}
                  className="group block border border-border bg-background p-6 lg:p-8 hover:border-copper transition-colors"
                >
                  <div className="grid lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-1">
                      <span className="font-mono text-sm text-brass">
                        M.{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="lg:col-span-7">
                      <h3 className="font-display text-3xl leading-tight">{String(v.name)}</h3>
                      <p className="mt-3 text-muted-foreground line-clamp-2">
                        {String(v.description || "")}
                      </p>
                      {v.certification ? (
                        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-brass border border-brass/40 px-2 py-1">
                          <Award className="h-3 w-3" /> {String(v.certification)}
                        </div>
                      ) : null}
                    </div>
                    <div className="lg:col-span-4 lg:text-right">
                      <div className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Duration
                      </div>
                      <div className="mt-1 font-display text-2xl">{String(v.duration || "—")}</div>
                      <div className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        Fee
                      </div>
                      <div className="mt-1 font-display text-2xl text-copper">
                        {formatINR(v.fee as number)}
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] group-hover:text-copper transition-colors">
                        View &amp; apply <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      </div>
    </SiteLayout>
  );
}
