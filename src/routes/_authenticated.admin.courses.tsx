import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  component: () => (
    <CrudPage
      table="courses"
      eyebrow="Academy"
      title="Courses"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "slug", label: "Slug", required: true },
        { key: "duration", label: "Duration" },
        { key: "fee", label: "Fee (₹)", type: "number", render: (v) => formatINR(v as number) },
        { key: "certification", label: "Certification", hideInTable: true },
        { key: "description", label: "Description", type: "textarea", hideInTable: true },
        {
          key: "curriculum",
          label: "Curriculum (JSON array of {title, description})",
          type: "json",
          hideInTable: true,
        },
        { key: "image_url", label: "Image URL", hideInTable: true },
        { key: "featured", label: "Featured", type: "checkbox" },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
    />
  ),
});
