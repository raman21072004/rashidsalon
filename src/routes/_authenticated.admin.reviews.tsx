import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: () => (
    <CrudPage
      table="reviews"
      eyebrow="Voices"
      title="Reviews"
      orderBy="created_at"
      asc={false}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "rating", label: "Rating (1-5)", type: "number", required: true },
        { key: "review", label: "Review", type: "textarea" },
        { key: "photo_url", label: "Photo URL", hideInTable: true },
      ]}
    />
  ),
});
