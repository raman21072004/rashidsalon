import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => (
    <CrudPage
      table="services"
      eyebrow="Salon"
      title="Services"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "category", label: "Category" },
        { key: "price", label: "Price (₹)", type: "number", render: (v) => formatINR(v as number) },
        { key: "duration", label: "Duration" },
        { key: "description", label: "Description", type: "textarea", hideInTable: true },
        { key: "image_url", label: "Image URL", hideInTable: true },
        { key: "featured", label: "Featured", type: "checkbox" },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
    />
  ),
});
