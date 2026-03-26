"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary",
  {
    variants: {
      variant: {
        primary: "bg-accent-cyan text-bg-primary hover:brightness-110 focus:ring-accent-cyan",
        secondary: "border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 focus:ring-accent-cyan",
        ghost: "text-text-secondary hover:bg-bg-hover hover:text-text-primary focus:ring-border",
        danger: "bg-accent-rose text-white hover:brightness-110 focus:ring-accent-rose",
        success: "bg-accent-emerald text-white hover:brightness-110 focus:ring-accent-emerald",
        outline: "border border-border text-text-secondary hover:bg-bg-tertiary hover:text-text-primary focus:ring-border",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
