import { useState } from "react";
import { PageHeader } from "./PageHeader";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminList } from "@/lib/admin-queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "select" | "json";
  options?: { value: string; label: string }[];
  required?: boolean;
  hideInTable?: boolean;
  render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode;
};

export function CrudPage({
  table,
  eyebrow,
  title,
  fields,
  orderBy = "sort_order",
  asc = true,
}: {
  table: string;
  eyebrow?: string;
  title: string;
  fields: FieldDef[];
  orderBy?: string;
  asc?: boolean;
}) {
  const {
    data = [],
    refetch,
    isLoading,
  } = useAdminList<Record<string, unknown>>(table, orderBy, asc);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);

  const onSave = async (row: Record<string, unknown>) => {
    const id = row.id as string | undefined;
    const payload = { ...row };
    delete payload.id;
    delete payload.created_at;
    if (id) {
      const { error } = await supabase
        .from(table as never)
        .update(payload as never)
        .eq("id", id);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    } else {
      const { error } = await supabase.from(table as never).insert(payload as never);
      if (error) return toast.error(error.message);
      toast.success("Created");
    }
    setEditing(null);
    setCreating(false);
    refetch();
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this row?")) return;
    const { error } = await supabase
      .from(table as never)
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refetch();
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const visible = fields.filter((f) => !f.hideInTable);

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 bg-espresso text-stone-paper px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] hover:bg-copper"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        }
      />
      <div className="px-5 pb-8 md:px-8 md:pb-10">
        <div className="bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card">
              <tr>
                {visible.map((f) => (
                  <th
                    key={f.key}
                    className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={visible.length + 1}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={visible.length + 1}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No entries yet.
                  </td>
                </tr>
              )}
              {data.map((row) => (
                <tr key={String(row.id)} className="border-t border-border hover:bg-card/50">
                  {visible.map((f) => (
                    <td key={f.key} className="px-4 py-3 align-top max-w-xs truncate">
                      {f.render ? f.render(row[f.key], row) : renderCell(row[f.key], f)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setEditing(row)}
                      className="p-1.5 hover:text-copper"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(String(row.id))}
                      className="p-1.5 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <Editor
          fields={fields}
          initial={editing ?? {}}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={onSave}
          title={editing ? "Edit" : "New"}
        />
      )}
    </div>
  );
}

function renderCell(v: unknown, f: FieldDef) {
  if (v === null || v === undefined || v === "")
    return <span className="text-muted-foreground">—</span>;
  if (f.type === "checkbox") return v ? "Yes" : "No";
  if (f.type === "json")
    return (
      <span className="font-mono text-xs">{Array.isArray(v) ? `${v.length} items` : "—"}</span>
    );
  const str = String(v);
  return str.length > 60 ? str.slice(0, 60) + "…" : str;
}

function Editor({
  fields,
  initial,
  onClose,
  onSave,
  title,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  onClose: () => void;
  onSave: (row: Record<string, unknown>) => void;
  title: string;
}) {
  const [row, setRow] = useState<Record<string, unknown>>({ ...initial });

  const set = (k: string, v: unknown) => setRow((r) => ({ ...r, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm grid place-items-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-background border border-border w-full max-w-2xl my-4 md:my-8">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-border">
          <h2 className="font-display text-xl md:text-2xl">{title}</h2>
          <button onClick={onClose} className="p-2 hover:text-copper cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(row);
          }}
          className="p-4 md:p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                {f.label}
                {f.required ? " *" : ""}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  rows={4}
                  required={f.required}
                  value={String(row[f.key] ?? "")}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
                />
              ) : f.type === "json" ? (
                <textarea
                  rows={8}
                  value={
                    typeof row[f.key] === "string"
                      ? String(row[f.key])
                      : JSON.stringify(row[f.key] ?? [], null, 2)
                  }
                  onChange={(e) => {
                    try {
                      set(f.key, JSON.parse(e.target.value));
                    } catch {
                      set(f.key, e.target.value);
                    }
                  }}
                  className="w-full bg-background border border-input px-3 py-2 text-xs font-mono focus:outline-none focus:border-copper"
                />
              ) : f.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={Boolean(row[f.key])}
                  onChange={(e) => set(f.key, e.target.checked)}
                  className="h-4 w-4 accent-copper"
                />
              ) : f.type === "select" ? (
                <select
                  value={String(row[f.key] ?? "")}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
                >
                  <option value="">—</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "number" ? (
                <input
                  type="number"
                  required={f.required}
                  value={String(row[f.key] ?? "")}
                  onChange={(e) =>
                    set(f.key, e.target.value === "" ? null : Number(e.target.value))
                  }
                  className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
                />
              ) : (
                <input
                  type="text"
                  required={f.required}
                  value={String(row[f.key] ?? "")}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-border px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] hover:bg-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-espresso text-stone-paper px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] hover:bg-copper"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
