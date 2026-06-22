import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useSettings } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rashid Salon & Academy" },
      {
        name: "description",
        content: "Visit, call, or message Rashid Salon and Academy in Model Town, Jalandhar.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(1000),
});

function ContactPage() {
  const { data: s } = useSettings();
  const settings = (s ?? {}) as Record<string, string>;
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contacts" as never).insert(parsed.data as never);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Message received. We'll be in touch shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <SiteLayout>
      <Section className="pt-16 pb-10">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Say hello.</h1>
      </Section>

      <Section className="pb-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="space-y-5 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-copper mt-0.5 shrink-0" />
              <span>{settings.address}</span>
            </div>
            {settings.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-copper" />
                <a href={`tel:${settings.phone}`} className="hover:text-copper">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-copper" />
                <a href={`mailto:${settings.email}`} className="hover:text-copper">
                  {settings.email}
                </a>
              </div>
            )}
            <div className="flex items-center gap-3 pt-3">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-border hover:border-copper hover:text-copper"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 border border-border hover:border-copper hover:text-copper"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={submit} className="bg-card border border-border p-7 space-y-4">
            <Eyebrow>Send a message</Eyebrow>
            <Field
              label="Name *"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                Message *
              </label>
              <textarea
                required
                maxLength={1000}
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-espresso text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
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
