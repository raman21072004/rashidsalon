import { createFileRoute } from "@tanstack/react-router";
import { useAdminList } from "@/lib/admin-queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/contacts")({
  component: ContactsAdmin,
});

function ContactsAdmin() {
  const { data = [], refetch } = useAdminList<Record<string, unknown>>(
    "contacts",
    "created_at",
    false,
  );
  const qc = useQueryClient();

  const toggle = async (id: string, resolved: boolean) => {
    const { error } = await supabase
      .from("contacts" as never)
      .update({ resolved } as never)
      .eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase
      .from("contacts" as never)
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refetch();
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  return (
    <div>
      <PageHeader eyebrow="Inbox" title="Contact messages" />
      <div className="px-8 pb-10 space-y-3">
        {data.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
        {data.map((m) => {
          const v = m as Record<string, string | boolean>;
          return (
            <div
              key={String(v.id)}
              className={`bg-background border p-5 ${v.resolved ? "border-border opacity-60" : "border-copper/40"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display text-lg">{v.name}</span>
                    {v.email && (
                      <a
                        href={`mailto:${v.email}`}
                        className="text-xs text-muted-foreground hover:text-copper"
                      >
                        {v.email}
                      </a>
                    )}
                    {v.phone && (
                      <a
                        href={`tel:${v.phone}`}
                        className="text-xs text-muted-foreground hover:text-copper"
                      >
                        {v.phone}
                      </a>
                    )}
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {formatDateTime(String(v.created_at))}
                    </span>
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{v.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em]">
                    <input
                      type="checkbox"
                      checked={Boolean(v.resolved)}
                      onChange={(e) => toggle(String(v.id), e.target.checked)}
                      className="accent-copper"
                    />
                    Resolved
                  </label>
                  <button
                    onClick={() => remove(String(v.id))}
                    className="p-1.5 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
