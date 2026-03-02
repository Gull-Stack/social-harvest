"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  GraduationCap,
  Calendar,
  MessagesSquare,
  FolderOpen,
  Users,
  Settings,
  Bell,
  Plus,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/app/feed", icon: Home, label: "Home Feed" },
  { href: "/app/members", icon: Users, label: "Members" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

// Mock spaces — will come from DB
const spaces = [
  { slug: "general", name: "General", icon: MessageSquare, color: "#6366f1", type: "DISCUSSION" },
  { slug: "introductions", name: "Introductions", icon: MessageSquare, color: "#8b5cf6", type: "DISCUSSION" },
  { slug: "getting-started", name: "Getting Started", icon: GraduationCap, color: "#06b6d4", type: "COURSE" },
  { slug: "weekly-events", name: "Weekly Events", icon: Calendar, color: "#f59e0b", type: "EVENT" },
  { slug: "watercooler", name: "Watercooler", icon: MessagesSquare, color: "#10b981", type: "CHAT" },
  { slug: "resources", name: "Resources", icon: FolderOpen, color: "#ef4444", type: "RESOURCE" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground">
      {/* Community Header */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
          SH
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">Social Harvest</h2>
          <p className="text-xs text-sidebar-foreground/50">Community</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Spaces */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Spaces
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-0.5">
            {spaces.map((space) => (
              <Link
                key={space.slug}
                href={`/app/spaces/${space.slug}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === `/app/spaces/${space.slug}`
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded"
                  style={{ backgroundColor: space.color + "20" }}
                >
                  <space.icon
                    className="h-3 w-3"
                    style={{ color: space.color }}
                  />
                </div>
                <span className="truncate">{space.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* User Footer */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=harvest" />
                <AvatarFallback>BM</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">Bryce Morgan</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">@bryce</p>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/40" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
