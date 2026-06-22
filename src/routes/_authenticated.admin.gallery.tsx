import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: () => (
    <CrudPage
      table="gallery"
      eyebrow="Media"
      title="Gallery"
      fields={[
        { key: "image_url", label: "Image URL", required: true },
        { key: "caption", label: "Caption" },
        { key: "category", label: "Category" },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
    />
  ),
});
