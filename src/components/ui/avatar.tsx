"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getGradient = (name: string) => {
    const colors = [
      ["#00D4FF", "#8B5CF6"],
      ["#10B981", "#00D4FF"],
      ["#FFB800", "#F43F5E"],
      ["#8B5CF6", "#F43F5E"],
      ["#00D4FF", "#10B981"],
    ];
    const index = name.charCodeAt(0) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
  };

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden",
          sizeClasses[size],
          className
        )}
      >
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium text-white",
        sizeClasses[size],
        className
      )}
      style={{ background: getGradient(name) }}
    >
      {getInitials(name)}
    </div>
  );
}
