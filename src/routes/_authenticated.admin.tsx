import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Image as ImageIcon,
  Star,
  Inbox,
  GraduationCap,
  ClipboardList,
  Settings,
  Shield,
  BarChart3,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/appointments", label: "Appointments", icon: Calendar },
  { to: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { to: "/admin/contacts", label: "Contacts", icon: Inbox },
  { to: "/admin/services", label: "Services", icon: Scissors },
  { to: "/admin/courses", label: "Courses", icon: GraduationCap },
  { to: "/admin/stylists", label: "Stylists", icon: Users },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/admins", label: "Admins", icon: Shield },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen flex bg-stone-paper">
      <aside className="w-60 shrink-0 bg-espresso text-stone-paper flex flex-col">
        <Link to="/" className="px-5 py-5 border-b border-stone-paper/10">
          <div className="font-display text-xl">Rashid</div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-stone-paper/50">
            Admin console
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto py-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${active ? "bg-copper/15 text-copper border-l-2 border-copper" : "text-stone-paper/70 hover:text-stone-paper hover:bg-stone-paper/5"}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-paper/10 p-4">
          <div className="text-[11px] text-stone-paper/50 truncate mb-2">{email}</div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-stone-paper/70 hover:text-copper"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
