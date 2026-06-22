import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

const TABS = ["General", "Hero", "About", "Academy", "Hours", "Social"] as const;
type Tab = (typeof TABS)[number];

function SettingsAdmin() {
  const { data, refetch } = useSettings();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("General");
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const setHour = (k: string, v: string) =>
    setForm((f) => ({
      ...f,
      business_hours: { ...((f.business_hours as Record<string, string>) ?? {}), [k]: v },
    }));

  const save = async () => {
    if (!data) return;
    setBusy(true);
    const payload = { ...form };
    delete payload.id;
    delete payload.updated_at;
    const { error } = await supabase
      .from("settings" as never)
      .update({ ...payload, updated_at: new Date().toISOString() } as never)
      .eq("id", (data as Record<string, string>).id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    refetch();
    qc.invalidateQueries({ queryKey: ["settings"] });
  };

  if (!data) return <div className="p-10 text-muted-foreground">Loading…</div>;

  const hours = (form.business_hours ?? {}) as Record<string, string>;
  const days = [
    ["mon", "Mon"],
    ["tue", "Tue"],
    ["wed", "Wed"],
    ["thu", "Thu"],
    ["fri", "Fri"],
    ["sat", "Sat"],
    ["sun", "Sun"],
  ] as const;

  return (
    <div>
      <PageHeader
        eyebrow="Site"
        title="Settings"
        action={
          <button
            onClick={save}
            disabled={busy}
            className="bg-espresso text-stone-paper px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] hover:bg-copper disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        }
      />

      <div className="px-8">
        <div className="flex gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-mono uppercase tracking-[0.14em] border-b-2 -mb-px ${tab === t ? "border-copper text-copper" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-8 max-w-3xl space-y-4">
        {tab === "General" && (
          <>
            <Input label="Salon name" k="salon_name" v={form} set={set} />
            <Input label="Address" k="address" v={form} set={set} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone" k="phone" v={form} set={set} />
              <Input label="WhatsApp" k="whatsapp" v={form} set={set} />
            </div>
            <Input label="Email" k="email" v={form} set={set} />
            <Input label="Logo URL" k="logo_url" v={form} set={set} />
            <Input label="Google Maps link" k="google_maps" v={form} set={set} />
          </>
        )}
        {tab === "Hero" && (
          <>
            <Input label="Hero title" k="hero_title" v={form} set={set} />
            <Textarea label="Hero subtitle" k="hero_subtitle" v={form} set={set} />
            <Input label="Hero image URL" k="hero_image_url" v={form} set={set} />
          </>
        )}
        {tab === "About" && (
          <>
            <Input label="About title" k="about_title" v={form} set={set} />
            <Textarea label="About description" k="about_description" v={form} set={set} />
            <Input label="About image URL" k="about_image_url" v={form} set={set} />
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4">
                <Input label={`Stat ${i} value`} k={`about_stat_${i}_value`} v={form} set={set} />
                <Input label={`Stat ${i} label`} k={`about_stat_${i}_label`} v={form} set={set} />
              </div>
            ))}
          </>
        )}
        {tab === "Academy" && (
          <>
            <Input label="Academy title" k="academy_title" v={form} set={set} />
            <Textarea label="Academy description" k="academy_description" v={form} set={set} />
            <Input label="Academy image URL" k="academy_image_url" v={form} set={set} />
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-4">
                <Input label={`Stat ${i} value`} k={`academy_stat_${i}_value`} v={form} set={set} />
                <Input label={`Stat ${i} label`} k={`academy_stat_${i}_label`} v={form} set={set} />
              </div>
            ))}
          </>
        )}
        {tab === "Hours" &&
          days.map(([k, label]) => (
            <div key={k} className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <label className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </label>
              <input
                value={hours[k] ?? ""}
                onChange={(e) => setHour(k, e.target.value)}
                placeholder="10:00 - 20:00"
                className="bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
              />
            </div>
          ))}
        {tab === "Social" && (
          <>
            <Input label="Instagram URL" k="instagram" v={form} set={set} />
            <Input label="Facebook URL" k="facebook" v={form} set={set} />
          </>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  k,
  v,
  set,
}: {
  label: string;
  k: string;
  v: Record<string, unknown>;
  set: (k: string, v: unknown) => void;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
        {label}
      </label>
      <input
        value={String(v[k] ?? "")}
        onChange={(e) => set(k, e.target.value)}
        className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
      />
    </div>
  );
}
function Textarea({
  label,
  k,
  v,
  set,
}: {
  label: string;
  k: string;
  v: Record<string, unknown>;
  set: (k: string, v: unknown) => void;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
        {label}
      </label>
      <textarea
        rows={3}
        value={String(v[k] ?? "")}
        onChange={(e) => set(k, e.target.value)}
        className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
      />
    </div>
  );
}
