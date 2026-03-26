"use client";

import { useState, ReactNode } from "react";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { Avatar, Input } from "@/components/ui";
import { Search, Bell, Menu } from "lucide-react";

interface HeaderProps {
  title?: ReactNode;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, toggleSidebar } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-bg-hover text-text-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && (
            <div>
              <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
              {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block w-72">
            <Input
              placeholder="Search jobs, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-rose rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text-primary">{user?.name || "Guest User"}</p>
              <p className="text-xs text-text-muted">{user?.email || "guest@example.com"}</p>
            </div>
            <Avatar name={user?.name || "Guest"} size="md" />
          </div>
        </div>
      </div>
    </header>
  );
}
