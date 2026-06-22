import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useGallery } from "@/lib/queries";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";
import hero from "@/assets/hero-salon.jpg";

const defaults = [
  { image_url: g1, caption: "The floor" },
  { image_url: g3, caption: "Bridal" },
  { image_url: g4, caption: "Balayage" },
  { image_url: g2, caption: "Precision cut" },
  { image_url: hero, caption: "Reception" },
  { image_url: g5, caption: "Grooming" },
  { image_url: g7, caption: "The academy" },
  { image_url: g6, caption: "The tools" },
  { image_url: g8, caption: "Nails" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Rashid Salon & Academy" },
      {
        name: "description",
        content: "Color, cut, bridal and academy work from Rashid Salon in Jalandhar.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: gallery = [] } = useGallery();
  const items = gallery.length > 0 ? gallery : defaults;

  return (
    <SiteLayout>
      <Section className="pt-16 pb-10">
        <Eyebrow>The work</Eyebrow>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Gallery</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          A look inside the salon — the floor, the chairs, the work that walks out.
        </p>
      </Section>

      <Section className="pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((g, i) => {
            const v = g as Record<string, string>;
            return (
              <figure
                key={String(v.id ?? i)}
                className="group relative aspect-[3/4] overflow-hidden bg-card border border-border"
              >
                <img
                  src={v.image_url}
                  alt={v.caption || "Gallery"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {v.caption && (
                  <figcaption className="absolute left-2 bottom-2 bg-background/85 backdrop-blur px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
                    {v.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </Section>
    </SiteLayout>
  );
}
