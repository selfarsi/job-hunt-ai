"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "w-full appearance-none bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 pr-10",
              "text-text-primary",
              "focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/50",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-accent-rose",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" className="text-text-muted">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-xs text-accent-rose">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
