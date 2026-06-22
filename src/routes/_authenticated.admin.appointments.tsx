import { createFileRoute } from "@tanstack/react-router";
import { useAdminList } from "@/lib/admin-queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatDate } from "@/lib/format";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

const getWhatsAppLink = (v: Record<string, unknown>) => {
  const name = String(v.name || "");
  let phone = String(v.phone || "").replace(/[^0-9]/g, "");
  if (phone.length === 10) {
    phone = "91" + phone;
  }
  const dateStr = String(v.date || "");
  const timeStr = String(v.time || "");
  const statusStr = String(v.status || "pending");

  let msg = "";
  if (statusStr === "confirmed") {
    msg = `Hello ${name}, your appointment at Rashid Salon & Academy for ${dateStr} at ${timeStr} has been CONFIRMED. We look forward to seeing you!`;
  } else if (statusStr === "cancelled") {
    msg = `Hello ${name}, unfortunately we are unable to accept your appointment request for ${dateStr} at ${timeStr} due to unavailability. Please feel free to request another slot or call us directly.`;
  } else {
    msg = `Hello ${name}, your appointment request at Rashid Salon & Academy for ${dateStr} at ${timeStr} is currently pending review. We will contact you shortly to confirm.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

export const Route = createFileRoute("/_authenticated/admin/appointments")({
  component: AppointmentsAdmin,
});

function AppointmentsAdmin() {
  const { data = [], refetch } = useAdminList<Record<string, unknown>>(
    "appointments",
    "created_at",
    false,
  );
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const setStatusFor = async (id: string, s: string, row: Record<string, unknown>) => {
    const { error } = await supabase
      .from("appointments" as never)
      .update({ status: s } as never)
      .eq("id", id);
    if (error) return toast.error(error.message);

    if (s === "confirmed" || s === "cancelled") {
      const link = getWhatsAppLink({ ...row, status: s });
      window.open(link, "_blank");
      toast.success(`Status updated. Opening WhatsApp...`);
    } else {
      toast.success("Status updated");
    }

    refetch();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    const { error } = await supabase
      .from("appointments" as never)
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const filtered = data.filter((r) => {
    const v = r as Record<string, string>;
    if (status !== "all" && v.status !== status) return false;
    if (q && !`${v.name} ${v.phone} ${v.email ?? ""}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div>
      <PageHeader eyebrow="Bookings" title="Appointments" />
      <div className="px-8 pb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search name, phone, email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-[200px] bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-background border border-input px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="px-8 pb-10">
        <div className="bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card">
              <tr>
                {["Date", "Time", "Name", "Contact", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No appointments.
                  </td>
                </tr>
              )}
              {filtered.map((r) => {
                const v = r as Record<string, string>;
                return (
                  <tr key={v.id} className="border-t border-border hover:bg-card/50">
                    <td className="px-4 py-3 font-mono">{formatDate(v.date)}</td>
                    <td className="px-4 py-3 font-mono">{v.time}</td>
                    <td className="px-4 py-3">
                      <div>{v.name}</div>
                      {v.notes && (
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {v.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{v.phone}</div>
                      {v.email && <div className="text-muted-foreground">{v.email}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={v.status}
                          onChange={(e) => setStatusFor(v.id, e.target.value, v)}
                          className={`bg-background border border-input px-2 py-1 text-xs font-mono uppercase tracking-[0.14em] ${v.status === "confirmed" ? "text-copper" : v.status === "cancelled" ? "text-destructive" : v.status === "completed" ? "text-sage" : ""}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {(v.status === "confirmed" || v.status === "cancelled" || v.status === "pending") && (
                          <a
                            href={getWhatsAppLink(v)}
                            target="_blank"
                            rel="noreferrer"
                            title="Send WhatsApp Notification"
                            className="p-1.5 text-emerald-600 hover:text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded transition-colors inline-flex items-center justify-center shrink-0"
                          >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.729-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.793 1.452 5.568 0 10.1-4.529 10.104-10.096.002-2.699-1.047-5.236-2.951-7.143C16.59 1.458 14.058.409 11.36.409c-5.566 0-10.096 4.53-10.1 10.098-.001 1.882.5 3.716 1.451 5.318l-.99 3.618 3.702-.97c1.554.848 3.161 1.281 4.624 1.281zm11.332-7.505c-.312-.156-1.848-.91-2.128-1.012-.281-.102-.485-.153-.687.153-.202.306-.782.91-.958 1.113-.176.202-.352.228-.664.072-1.378-.69-2.39-1.2-3.344-2.834-.252-.43-.026-.66.19-.874.195-.19.43-.51.644-.765.215-.255.287-.435.43-.726.143-.29.072-.545-.036-.75-.109-.205-.87-2.128-1.196-2.923-.317-.775-.64-1.026-.877-1.026-.227-.001-.487-.001-.747.001-.26.002-.685.097-1.042.486-.358.388-1.367 1.334-1.367 3.251 0 1.917 1.393 3.763 1.587 4.02.196.255 2.742 4.187 6.643 5.87 1.545.667 2.742 1.07 3.684 1.368 1.55.493 2.96.422 4.073.256 1.24-.185 2.848-.714 3.252-1.403.404-.689.404-1.281.281-1.402-.122-.122-.328-.202-.64-.358z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(v.id)} className="p-1.5 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
