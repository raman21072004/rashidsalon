import { createFileRoute } from "@tanstack/react-router";
import { useAdminList } from "@/lib/admin-queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";
import { Trash2 } from "lucide-react";

const STATUSES = ["new", "contacted", "enrolled", "closed"] as const;

export const Route = createFileRoute("/_authenticated/admin/enrollments")({
  component: EnrollmentsAdmin,
});

function EnrollmentsAdmin() {
  const { data = [], refetch } = useAdminList<Record<string, unknown>>(
    "course_enrollments",
    "created_at",
    false,
  );
  const qc = useQueryClient();

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("course_enrollments" as never)
      .update({ status } as never)
      .eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this enrollment enquiry?")) return;
    const { error } = await supabase
      .from("course_enrollments" as never)
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  return (
    <div>
      <PageHeader eyebrow="Academy" title="Enrollments" />
      <div className="px-5 pb-8 md:px-8 md:pb-10 space-y-3">
        {data.length === 0 && <p className="text-muted-foreground text-sm">No enquiries yet.</p>}
        {data.map((e) => {
          const v = e as Record<string, string>;
          return (
            <div key={v.id} className="bg-background border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-display text-lg">{v.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground space-x-3">
                    <a href={`tel:${v.phone}`} className="hover:text-copper">
                      {v.phone}
                    </a>
                    {v.email && (
                      <a href={`mailto:${v.email}`} className="hover:text-copper">
                        {v.email}
                      </a>
                    )}
                    {v.preferred_batch && <span>Batch: {v.preferred_batch}</span>}
                    <span className="font-mono">{formatDateTime(v.created_at)}</span>
                  </div>
                  {v.message && <p className="mt-3 text-sm">{v.message}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={v.status}
                    onChange={(ev) => setStatus(v.id, ev.target.value)}
                    className="bg-background border border-input px-2 py-1 text-xs font-mono uppercase tracking-[0.14em]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => remove(v.id)} className="p-1.5 hover:text-destructive">
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
