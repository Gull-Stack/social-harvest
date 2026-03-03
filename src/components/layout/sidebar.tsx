"use client";

import { useEffect, useState } from "react";
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
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const mainNav = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/members", icon: Users, label: "Members" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const typeIcons: Record<string, LucideIcon> = {
  DISCUSSION: MessageSquare,
  COURSE: GraduationCap,
  EVENT: Calendar,
  CHAT: MessagesSquare,
  RESOURCE: FolderOpen,
};

interface SpaceItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: string;
  icon: string | null;
}

export function Sidebar() {
  const pathname = usePathname();
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [user, setUser] = useState<{
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      // Get current user
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, username, displayName, avatarUrl")
          .eq("id", authUser.id)
          .single();
        if (profile) setUser(profile);

        // Get spaces the user is a member of
        const { data: memberships } = await supabase
          .from("space_members")
          .select("spaceId")
          .eq("userId", authUser.id);

        if (memberships && memberships.length > 0) {
          const spaceIds = memberships.map((m) => m.spaceId);
          const { data: spaceData } = await supabase
            .from("spaces")
            .select("id, name, slug, color, type, icon")
            .in("id", spaceIds)
            .order("sortOrder", { ascending: true });

          if (spaceData) setSpaces(spaceData);
        }
      }
    }

    load();
  }, []);

  const displayName = user?.displayName || user?.username || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground">
      {/* Community Header */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
          G
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">Gigg</h2>
          <p className="text-xs text-sidebar-foreground/50">{spaces.length} spaces</p>
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
            {spaces.map((space) => {
              const Icon = typeIcons[space.type] || MessageSquare;
              const color = space.color || "#6366f1";
              return (
                <Link
                  key={space.slug}
                  href={`/spaces/${space.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === `/spaces/${space.slug}`
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded"
                    style={{ backgroundColor: color + "20" }}
                  >
                    <Icon
                      className="h-3 w-3"
                      style={{ color }}
                    />
                  </div>
                  <span className="truncate">{space.name}</span>
                  {space.type === "CHAT" && (
                    <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* User Footer */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">
                  @{user?.username || "..."}
                </p>
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
