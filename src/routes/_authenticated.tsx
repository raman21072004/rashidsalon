import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthGate,
});

function AuthGate() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Bypassing authentication check temporarily to preview the admin dashboard frontend
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-card">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Checking session…
        </p>
      </div>
    );
  }
  return <Outlet />;
}
