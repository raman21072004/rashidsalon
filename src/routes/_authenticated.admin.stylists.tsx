import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/stylists")({
  component: () => (
    <CrudPage
      table="stylists"
      eyebrow="Team"
      title="Stylists"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "specialization", label: "Specialization" },
        { key: "experience", label: "Experience" },
        { key: "bio", label: "Bio", type: "textarea", hideInTable: true },
        { key: "availability", label: "Availability", hideInTable: true },
        { key: "photo_url", label: "Photo URL", hideInTable: true },
        { key: "instagram", label: "Instagram", hideInTable: true },
        { key: "facebook", label: "Facebook", hideInTable: true },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
    />
  ),
});
