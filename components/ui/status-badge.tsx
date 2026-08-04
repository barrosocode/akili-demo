import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  inactive: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

interface StatusBadgeProps extends ComponentProps<typeof Badge> {
  status: string;
  label: string;
}

export function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", STATUS_STYLES[status] ?? STATUS_STYLES.inactive, className)}
      {...props}
    >
      {label}
    </Badge>
  );
}
