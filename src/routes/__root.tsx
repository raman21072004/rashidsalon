import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import logo from "../assets/logo.png?url";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-3 font-display text-4xl">This page isn't on the appointment book.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The link may have moved. Head back home and try again.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center bg-espresso text-stone-paper px-4 py-2.5 text-xs font-mono uppercase tracking-[0.14em] hover:bg-copper transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something didn't load.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back to the start.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-espresso text-stone-paper px-4 py-2.5 text-xs font-mono uppercase tracking-[0.14em] hover:bg-copper transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-border px-4 py-2.5 text-xs font-mono uppercase tracking-[0.14em] hover:bg-card transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rashid Salon & Academy — Hair, beauty and training in Jalandhar" },
      {
        name: "description",
        content:
          "Unisex salon and beauty training academy in Model Town, Jalandhar. Book a chair, or apply to the academy.",
      },
      {
        property: "og:title",
        content: "Rashid Salon & Academy — Hair, beauty and training in Jalandhar",
      },
      {
        property: "og:description",
        content:
          "Unisex salon and beauty training academy in Model Town, Jalandhar. Book a chair, or apply to the academy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Rashid Salon & Academy — Hair, beauty and training in Jalandhar",
      },
      {
        name: "twitter:description",
        content:
          "Unisex salon and beauty training academy in Model Town, Jalandhar. Book a chair, or apply to the academy.",
      },
      {
        property: "og:image",
        content: logo,
      },
      {
        name: "twitter:image",
        content: logo,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
