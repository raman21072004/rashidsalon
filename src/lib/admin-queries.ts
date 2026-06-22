import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminCounts() {
  return useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const tables = [
        "appointments",
        "course_enrollments",
        "contacts",
        "services",
        "courses",
        "stylists",
        "reviews",
        "gallery",
      ] as const;
      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase
            .from(t as never)
            .select("*", { count: "exact", head: true });
          return [t, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(results) as Record<(typeof tables)[number], number>;
    },
  });
}

export function useAdminList<T = Record<string, unknown>>(
  table: string,
  order = "created_at",
  asc = false,
) {
  return useQuery({
    queryKey: ["admin-list", table, order, asc],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as never)
        .select("*")
        .order(order, { ascending: asc });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}
