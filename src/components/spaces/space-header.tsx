"use client";

import { MessageSquare, Users, Settings, Lock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SpaceHeaderProps {
  name: string;
  description: string;
  color: string;
  visibility: string;
  memberCount: number;
  postCount: number;
}

export function SpaceHeader({
  name,
  description,
  color,
  visibility,
  memberCount,
  postCount,
}: SpaceHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: color + "15" }}
            >
              <MessageSquare className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{name}</h2>
                {visibility === "PRIVATE" && <Lock className="h-4 w-4 text-muted-foreground" />}
                {visibility === "PAID" && <CreditCard className="h-4 w-4 text-amber-500" />}
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" /> {memberCount} members
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" /> {postCount} posts
          </span>
          <Badge variant="secondary">
            {visibility.charAt(0) + visibility.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
    </div>
  );
}
