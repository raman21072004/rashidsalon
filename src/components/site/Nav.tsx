import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/academy", label: "Academy" },
  { to: "/gallery", label: "Gallery" },
  { to: "/stylists", label: "Stylists" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Rashid Salon & Academy"
            className="h-11 w-11 object-contain"
            width={44}
            height={44}
          />
          <div className="leading-tight">
            <div className="font-display text-lg">Rashid</div>
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              Salon · Academy
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-foreground/80 hover:text-copper transition-colors"
              activeProps={{ className: "text-copper" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/academy"
            className="text-xs font-mono uppercase tracking-[0.14em] border border-border px-3 py-2 hover:bg-card transition-colors"
          >
            Apply
          </Link>
          <Link
            to="/book-appointment"
            className="text-xs font-mono uppercase tracking-[0.14em] bg-espresso text-stone-paper px-3 py-2 hover:bg-copper transition-colors"
          >
            Book a chair
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-5 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm"
                activeProps={{ className: "text-copper" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 pb-2">
              <Link
                to="/academy"
                onClick={() => setOpen(false)}
                className="flex-1 text-center text-xs font-mono uppercase tracking-[0.14em] border border-border px-3 py-2.5"
              >
                Apply
              </Link>
              <Link
                to="/book-appointment"
                onClick={() => setOpen(false)}
                className="flex-1 text-center text-xs font-mono uppercase tracking-[0.14em] bg-espresso text-stone-paper px-3 py-2.5"
              >
                Book a chair
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
