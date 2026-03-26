"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  color?: "cyan" | "emerald" | "amber" | "rose" | "violet";
}

export function Progress({
  value,
  max = 100,
  size = "md",
  showLabel = false,
  className,
  color = "cyan",
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses = {
    cyan: "bg-accent-cyan",
    emerald: "bg-accent-emerald",
    amber: "bg-accent-amber",
    rose: "bg-accent-rose",
    violet: "bg-accent-violet",
  };

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-bg-tertiary rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-secondary mt-1 block">{Math.round(percentage)}%</span>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
  color?: "cyan" | "emerald" | "amber" | "rose" | "violet";
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  className,
  color = "cyan",
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    cyan: "stroke-accent-cyan",
    emerald: "stroke-accent-emerald",
    amber: "stroke-accent-amber",
    rose: "stroke-accent-rose",
    violet: "stroke-accent-violet",
  };

  const getColor = () => {
    if (color !== "cyan") return color;
    if (percentage >= 80) return "emerald";
    if (percentage >= 60) return "amber";
    return "rose";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-bg-tertiary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-700 ease-out", colorClasses[getColor()])}
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-text-primary">{Math.round(percentage)}%</span>
          <span className="text-xs text-text-muted">Match</span>
        </div>
      )}
    </div>
  );
}
