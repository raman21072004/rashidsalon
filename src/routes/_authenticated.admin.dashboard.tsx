import { createFileRoute } from "@tanstack/react-router";
import { useAdminCounts } from "@/lib/admin-queries";
import {
  Calendar,
  ClipboardList,
  Inbox,
  Scissors,
  GraduationCap,
  Users,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: c } = useAdminCounts();
  const stats: { key: string; label: string; icon: typeof Calendar; copper?: boolean }[] = [
    { key: "appointments", label: "Appointments", icon: Calendar, copper: true },
    { key: "course_enrollments", label: "Enrollments", icon: ClipboardList, copper: true },
    { key: "contacts", label: "Messages", icon: Inbox },
    { key: "services", label: "Services", icon: Scissors },
    { key: "courses", label: "Courses", icon: GraduationCap },
    { key: "stylists", label: "Stylists", icon: Users },
    { key: "reviews", label: "Reviews", icon: Star },
    { key: "gallery", label: "Gallery", icon: ImageIcon },
  ];

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" />
      <div className="px-8 pb-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ key, label, icon: Icon, copper }) => (
          <div key={key} className="bg-background border border-border p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </div>
              <Icon className={`h-4 w-4 ${copper ? "text-copper" : "text-muted-foreground"}`} />
            </div>
            <div className="mt-3 font-display text-4xl">{c?.[key as keyof typeof c] ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
