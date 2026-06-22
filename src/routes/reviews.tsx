import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout, Section, Eyebrow } from "@/components/site/SiteLayout";
import { useReviews } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Rashid Salon & Academy" },
      {
        name: "description",
        content: "What our clients say about Rashid Salon and Academy in Jalandhar.",
      },
    ],
  }),
  component: ReviewsPage,
});

const reviewSchema = z.object({
  name: z.string().trim().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  review: z.string().trim().min(5).max(1000),
});

function ReviewsPage() {
  const { data: reviews = [], refetch } = useReviews();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({ name, rating, review: text });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your review");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews" as never).insert(parsed.data as never);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Thanks! Your review is posted.");
    setName("");
    setText("");
    setRating(5);
    refetch();
  };

  return (
    <SiteLayout>
      <Section className="pt-16 pb-10">
        <Eyebrow>Reviews</Eyebrow>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">In their words.</h1>
      </Section>

      <Section className="pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => {
            const v = r as Record<string, string | number>;
            return (
              <figure key={String(v.id)} className="border border-border bg-card p-6 flex flex-col">
                <div className="flex gap-1 text-copper mb-3">
                  {Array.from({ length: Number(v.rating) }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="font-display text-lg leading-snug flex-1">
                  "{String(v.review)}"
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-border font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  — {String(v.name)}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Section>

      <div className="border-t border-border bg-card">
        <Section className="py-16 max-w-2xl">
          <Eyebrow>Leave a review</Eyebrow>
          <h2 className="mt-3 font-display text-3xl">Tell us how it went.</h2>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                Your name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} className="p-1">
                    <Star
                      className={`h-6 w-6 ${n <= rating ? "fill-copper text-copper" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                Your review *
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1000}
                required
                rows={4}
                className="w-full bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:border-copper"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-espresso text-stone-paper px-5 py-3 text-xs font-mono uppercase tracking-[0.16em] hover:bg-copper transition-colors disabled:opacity-50"
            >
              {submitting ? "Posting…" : "Post review"}
            </button>
          </form>
        </Section>
      </div>
    </SiteLayout>
  );
}
