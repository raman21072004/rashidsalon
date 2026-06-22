import heroPigment from "@/assets/hero-pigment.jpg";
import aboutSalon from "@/assets/about-salon.jpg";
import academy from "@/assets/academy.jpg";
import shadeCard from "@/assets/shade-card.jpg";

type Shade = { label: string; img: string; color: string };

const defaultShades: Shade[] = [
  { label: "Copper", img: heroPigment, color: "var(--copper)" },
  { label: "Plum", img: shadeCard, color: "var(--plum)" },
  { label: "Brass", img: academy, color: "var(--brass)" },
  { label: "Espresso", img: aboutSalon, color: "var(--espresso)" },
];

export function ShadeStrip({ shades = defaultShades }: { shades?: Shade[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {shades.map((s, i) => (
        <figure
          key={s.label + i}
          className="group relative aspect-[3/4] overflow-hidden bg-card border border-border"
        >
          <img
            src={s.img}
            alt={s.label}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <figcaption className="absolute left-2 bottom-2 flex items-center gap-2 bg-background/85 backdrop-blur px-2 py-1">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} aria-hidden />
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase">{s.label}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
