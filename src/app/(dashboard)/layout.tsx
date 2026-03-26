"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarOpen ? "ml-60" : "ml-16"
        )}
      >
        {children}
      </main>
    </div>
  );
}
