import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Green = Approved, Yellow = Pending, Red = Rejected */
const STATUS_STYLES: Record<
  string,
  { className: string }
> = {
  approved: {
    className: "bg-emerald-600 text-white hover:bg-emerald-600 border-0",
  },
  passed: {
    className: "bg-emerald-600 text-white hover:bg-emerald-600 border-0",
  },
  pending: {
    className: "bg-amber-500 text-white hover:bg-amber-500 border-0",
  },
  pending_review: {
    className: "bg-amber-500 text-white hover:bg-amber-500 border-0",
  },
  pending_government_approval: {
    className: "bg-amber-500 text-white hover:bg-amber-500 border-0",
  },
  rejected: {
    className: "bg-red-600 text-white hover:bg-red-600 border-0",
  },
  failed: {
    className: "bg-red-600 text-white hover:bg-red-600 border-0",
  },
};

export interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");
  const style = STATUS_STYLES[normalized] ?? {
    className: "bg-muted text-muted-foreground border-0",
  };
  const displayLabel =
    label ??
    (normalized === "pending_government_approval"
      ? "Pending Government Approval"
      : normalized === "pending_review"
        ? "Pending Review"
        : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "));
  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      {displayLabel}
    </Badge>
  );
}
