import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/queries";
import { Instagram, Facebook, MapPin } from "lucide-react";

export function Footer() {
  const { data: s } = useSettings();
  const settings = (s ?? {}) as Record<string, string>;
  const hours = (s?.business_hours ?? {}) as Record<string, string>;
  const days = [
    ["mon", "Mon"],
    ["tue", "Tue"],
    ["wed", "Wed"],
    ["thu", "Thu"],
    ["fri", "Fri"],
    ["sat", "Sat"],
    ["sun", "Sun"],
  ] as const;

  return (
    <footer className="border-t border-border bg-espresso text-stone-paper">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">Rashid Salon &amp; Academy</div>
          <p className="mt-3 text-sm text-stone-paper/70 max-w-sm">
            A unisex salon and training academy in Model Town, Jalandhar. Sit in the chair, or learn
            behind it.
          </p>
          <div className="mt-5 flex items-start gap-2 text-sm text-stone-paper/80">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-copper" />
            <span>{settings.address || "Model Town, Jalandhar"}</span>
          </div>
          <div className="mt-4 flex gap-3">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 border border-stone-paper/20 hover:border-copper hover:text-copper transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2 border border-stone-paper/20 hover:border-copper hover:text-copper transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-copper">Visit</div>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link to="/services" className="hover:text-copper">
                Services
              </Link>
            </li>
            <li>
              <Link to="/academy" className="hover:text-copper">
                Academy
              </Link>
            </li>
            <li>
              <Link to="/stylists" className="hover:text-copper">
                Stylists
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-copper">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-copper">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-copper">Hours</div>
          <ul className="mt-3 space-y-1 text-sm">
            {days.map(([k, label]) => (
              <li key={k} className="flex justify-between gap-4 max-w-[180px]">
                <span className="text-stone-paper/60">{label}</span>
                <span className="font-mono text-xs">{hours[k] || "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-paper/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5 text-xs text-stone-paper/50 flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Rashid Salon and Academy</span>
          <Link to="/auth" className="hover:text-copper">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}
