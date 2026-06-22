import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useService } from "@/lib/queries";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useService(slug);
  const v = (data ?? {}) as Record<string, string | number>;

  if (isLoading)
    return (
      <SiteLayout>
        <Section className="py-20">
          <p className="text-muted-foreground">Loading…</p>
        </Section>
      </SiteLayout>
    );
  if (!data)
    return (
      <SiteLayout>
        <Section className="py-20">
          <p>Service not found.</p>
          <Link to="/services" className="text-copper">
            Back to services
          </Link>
        </Section>
      </SiteLayout>
    );

  return (
    <SiteLayout>
      <Section className="pt-16 pb-20 max-w-4xl">
        <Link
          to="/services"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-copper"
        >
          ← All services
        </Link>
        <Eyebrow>{String(v.category || "Service")}</Eyebrow>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl leading-[1.05]">{String(v.name)}</h1>

        <div className="mt-8 flex flex-wrap gap-5 border-y border-border py-5">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-copper" />
            <span className="font-mono text-base">{formatINR(v.price as number)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-copper" />
            <span className="font-mono text-base">{String(v.duration || "—")}</span>
          </div>
        </div>

        <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {String(v.description || "")}
        </p>

        <div className="mt-10 flex gap-3 flex-wrap">
          <Link
            to="/book-appointment"
            className="bg-espresso text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors inline-flex items-center gap-2"
          >
            Book this service <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/contact"
            className="border border-border px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-card transition-colors"
          >
            Ask a question
          </Link>
        </div>
      </Section>
    </SiteLayout>
  );
}
