import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { useEffect, useState } from "react";

type Profile = { id: string; email: string; full_name?: string };
type Role = { user_id: string; role: "super_admin" | "admin" };

export const Route = createFileRoute("/_authenticated/admin/admins")({
  component: AdminsPage,
});

function AdminsPage() {
  const [me, setMe] = useState<{ id: string } | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user ? { id: data.user.id } : null));
  }, []);

  const { data: profiles = [], refetch: refetchP } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles" as never)
        .select("id, email, full_name");
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });
  const { data: roles = [], refetch: refetchR } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles" as never).select("user_id, role");
      if (error) throw error;
      return (data ?? []) as Role[];
    },
  });

  const isSuper = roles.some((r) => r.user_id === me?.id && r.role === "super_admin");

  return (
    <div>
      <PageHeader eyebrow="Access" title="Admin accounts" />
      <div className="px-5 pb-8 md:px-8 md:pb-10 space-y-3 max-w-3xl">
        {!isSuper && (
          <p className="text-sm text-muted-foreground">
            Only super admins can manage other accounts.
          </p>
        )}
        <div className="bg-background border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-card">
              <tr>
                <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  User
                </th>
                <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Roles
                </th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const userRoles = roles.filter((r) => r.user_id === p.id).map((r) => r.role);
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div>{p.full_name || p.email}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {(["admin", "super_admin"] as const).map((role) => {
                          const has = userRoles.includes(role);
                          return (
                            <button
                              key={role}
                              disabled={!isSuper}
                              onClick={async () => {
                                if (has)
                                  await supabase
                                    .from("user_roles" as never)
                                    .delete()
                                    .eq("user_id", p.id)
                                    .eq("role", role);
                                else
                                  await supabase
                                    .from("user_roles" as never)
                                    .insert({ user_id: p.id, role } as never);
                                refetchP();
                                refetchR();
                              }}
                              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] border transition-colors ${has ? "bg-copper text-stone-paper border-copper" : "border-border hover:border-copper"} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {role.replace("_", " ")}
                            </button>
                          );
                        })}
                      </div>
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
