import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Clock, Tag } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useCourse } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/academy/$slug")({
  component: CourseDetail,
});

const enrollSchema = z.object({
  name: z.string().trim().min(2, "Required").max(100),
  phone: z.string().trim().min(7, "Required").max(20),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  preferred_batch: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useCourse(slug);
  const v = (data ?? {}) as Record<string, string | number>;
  const curriculum = (data?.curriculum as Array<{ title: string; description: string }>) || [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferred_batch: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

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
          <p>Course not found.</p>
          <Link to="/academy" className="text-copper">
            Back to academy
          </Link>
        </Section>
      </SiteLayout>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = enrollSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("course_enrollments" as never).insert({
      ...parsed.data,
      course_id: String(v.id),
    } as never);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Application received. We'll be in touch.");
    setForm({ name: "", phone: "", email: "", preferred_batch: "", message: "" });
  };

  return (
    <SiteLayout>
      <Section className="pt-12 pb-6">
        <Link
          to="/academy"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-copper"
        >
          ← All courses
        </Link>
      </Section>

      <Section className="pb-12 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>Academy course</Eyebrow>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl leading-[1.05]">
            {String(v.name)}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">{String(v.description || "")}</p>

          <div className="mt-8 flex flex-wrap gap-6 border-y border-border py-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-copper" />
              <span className="font-mono">{String(v.duration || "—")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-copper" />
              <span className="font-mono text-copper">{formatINR(v.fee as number)}</span>
            </div>
            {v.certification && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-brass" />
                <span className="font-mono text-sm">{String(v.certification)}</span>
              </div>
            )}
          </div>

          <h2 className="mt-12 font-display text-3xl">Curriculum</h2>
          <ol className="mt-6 space-y-5">
            {curriculum.map((m, i) => (
              <li key={i} className="border-l-2 border-copper pl-6">
                <div className="font-mono text-xs text-copper">
                  M.{String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-xl mt-1">{m.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{m.description}</div>
              </li>
            ))}
            {curriculum.length === 0 && (
              <li className="text-muted-foreground text-sm">Curriculum details on request.</li>
            )}
          </ol>
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-card border border-border p-7 lg:sticky lg:top-24">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-copper">Apply</div>
            <h3 className="mt-2 font-display text-2xl">Tell us about you.</h3>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field
                label="Your name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                required
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                required
              />
              <Field
                label="Email (optional)"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              />
              <Field
                label="Preferred batch (e.g. Morning)"
                value={form.preferred_batch}
                onChange={(v) => setForm((f) => ({ ...f, preferred_batch: v }))}
              />
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                  Anything to add?
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-espresso text-stone-paper py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Submit application"}
              </button>
            </form>
          </div>
        </aside>
      </Section>
    </SiteLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={255}
        className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
      />
    </div>
  );
}
