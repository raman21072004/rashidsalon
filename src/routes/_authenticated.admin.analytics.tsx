import { createFileRoute } from "@tanstack/react-router";
import { useAdminList } from "@/lib/admin-queries";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: Analytics,
});

const COLORS = ["#B5572A", "#5B2333", "#8C7A4B", "#818C78", "#2B2420"];

function Analytics() {
  const { data: appts = [] } = useAdminList<Record<string, string>>(
    "appointments",
    "created_at",
    false,
  );
  const { data: enrolls = [] } = useAdminList<Record<string, string>>(
    "course_enrollments",
    "created_at",
    false,
  );

  const byMonth = useMemo(() => {
    const m: Record<string, { month: string; appointments: number; enrollments: number }> = {};
    const push = (rows: Record<string, string>[], key: "appointments" | "enrollments") => {
      rows.forEach((r) => {
        const d = new Date(r.created_at);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        m[k] = m[k] || { month: k, appointments: 0, enrollments: 0 };
        m[k][key] += 1;
      });
    };
    push(appts, "appointments");
    push(enrolls, "enrollments");
    return Object.values(m).sort((a, b) => a.month.localeCompare(b.month));
  }, [appts, enrolls]);

  const byStatus = useMemo(() => {
    const m: Record<string, number> = {};
    appts.forEach((a) => {
      m[a.status] = (m[a.status] ?? 0) + 1;
    });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [appts]);

  return (
    <div>
      <PageHeader eyebrow="Insight" title="Analytics" />
      <div className="px-8 pb-10 grid lg:grid-cols-2 gap-6">
        <div className="bg-background border border-border p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-4">
            By month
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byMonth}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#B5572A" />
              <Bar dataKey="enrollments" fill="#5B2333" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-background border border-border p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-4">
            Appointment status
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                {byStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
