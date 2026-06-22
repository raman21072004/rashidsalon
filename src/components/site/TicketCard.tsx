import type { ReactNode } from "react";

/** Ticket-stub style card with notched edges. Used for services and courses. */
export function TicketCard({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}) {
  return (
    <As className={`ticket relative p-5 ${className}`}>
      <div className="ticket-dashed py-4 -mx-5 px-5">{children}</div>
    </As>
  );
}
