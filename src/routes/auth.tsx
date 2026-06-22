import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Staff login — Rashid" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome back.");
      navigate({ to: "/admin/dashboard" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Signing you in…");
      navigate({ to: "/admin/dashboard" });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-card px-5">
      <div className="w-full max-w-md bg-background border border-border p-8">
        <Link
          to="/"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-copper"
        >
          ← Back to site
        </Link>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-copper">
          Staff
        </div>
        <h1 className="mt-2 font-display text-3xl">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Salon and academy admins only."
            : "The first account becomes super admin."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                Full name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={100}
                className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
              />
            </div>
          )}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-espresso text-stone-paper py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors disabled:opacity-50"
          >
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-5 text-xs text-muted-foreground hover:text-copper"
        >
          {mode === "signin"
            ? "Need to create the first admin account?"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
