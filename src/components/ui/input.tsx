"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5",
              "text-text-primary placeholder:text-text-muted",
              "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/50",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-accent-rose focus:border-accent-rose focus:ring-accent-rose/50",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-accent-rose">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
