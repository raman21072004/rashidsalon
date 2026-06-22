import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useServices, useStylists } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/book-appointment")({
  head: () => ({
    meta: [
      { title: "Book an appointment — Rashid Salon" },
      { name: "description", content: "Reserve a chair at Rashid Salon in Model Town, Jalandhar." },
    ],
  }),
  component: BookPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  service_id: z.string().uuid().optional().or(z.literal("")),
  stylist_id: z.string().uuid().optional().or(z.literal("")),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function BookPage() {
  const { data: services = [] } = useServices();
  const { data: stylists = [] } = useStylists();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service_id: "",
    stylist_id: "",
    date: "",
    time: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...parsed.data,
      service_id: parsed.data.service_id || null,
      stylist_id: parsed.data.stylist_id || null,
    };
    const { error } = await supabase.from("appointments" as never).insert(payload as never);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Booked. We'll confirm by phone.");
    setForm({
      name: "",
      phone: "",
      email: "",
      service_id: "",
      stylist_id: "",
      date: "",
      time: "",
      notes: "",
    });
  };

  return (
    <SiteLayout>
      <Section className="pt-16 pb-10">
        <Eyebrow>Booking</Eyebrow>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl max-w-2xl">Reserve a chair.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Pick a service, day and time. We'll confirm by phone shortly after. For academy
          applications, see the{" "}
          <a href="/academy" className="text-copper underline">
            Academy page
          </a>
          .
        </p>
      </Section>

      <Section className="pb-20 max-w-2xl">
        <form onSubmit={submit} className="bg-card border border-border p-7 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Name *"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <Field
              label="Phone *"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              required
            />
          </div>
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField
              label="Service"
              value={form.service_id}
              onChange={(v) => setForm((f) => ({ ...f, service_id: v }))}
              options={services.map((s) => ({
                value: (s as Record<string, string>).id,
                label: (s as Record<string, string>).name,
              }))}
            />
            <SelectField
              label="Stylist (optional)"
              value={form.stylist_id}
              onChange={(v) => setForm((f) => ({ ...f, stylist_id: v }))}
              options={stylists.map((s) => ({
                value: (s as Record<string, string>).id,
                label: (s as Record<string, string>).name,
              }))}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Date *"
              type="date"
              value={form.date}
              onChange={(v) => setForm((f) => ({ ...f, date: v }))}
              required
            />
            <Field
              label="Time *"
              type="time"
              value={form.time}
              onChange={(v) => setForm((f) => ({ ...f, time: v }))}
              required
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
              Anything we should know?
            </label>
            <textarea
              maxLength={500}
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-espresso text-stone-paper py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors disabled:opacity-50"
          >
            {submitting ? "Booking…" : "Request booking"}
          </button>
        </form>
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
      >
        <option value="">— any —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
