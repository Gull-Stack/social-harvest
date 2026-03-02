"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Users, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app/feed", icon: Home, label: "Feed" },
  { href: "/app/spaces", icon: Grid3X3, label: "Spaces" },
  { href: "/app/members", icon: Users, label: "Members" },
  { href: "/app/notifications", icon: Bell, label: "Alerts" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
