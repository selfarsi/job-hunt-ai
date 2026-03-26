"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-bg-tertiary text-text-secondary",
        primary: "bg-accent-cyan/20 text-accent-cyan",
        success: "bg-accent-emerald/20 text-accent-emerald",
        warning: "bg-accent-amber/20 text-accent-amber",
        danger: "bg-accent-rose/20 text-accent-rose",
        violet: "bg-accent-violet/20 text-accent-violet",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  status?: string;
  dot?: boolean;
}

function Badge({ className, variant, status, dot, children, ...props }: BadgeProps) {
  const statusColors = status ? getStatusColor(status) : null;

  return (
    <span
      className={cn(
        badgeVariants({ variant }),
        statusColors && `${statusColors.bg} ${statusColors.text}`,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", statusColors?.dot || "bg-current")}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
