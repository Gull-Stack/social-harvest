"use client";

import Link from "next/link";
import {
  MessageSquare,
  GraduationCap,
  Calendar,
  MessagesSquare,
  FolderOpen,
  Users,
  Lock,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeIcons: Record<string, React.ElementType> = {
  DISCUSSION: MessageSquare,
  COURSE: GraduationCap,
  EVENT: Calendar,
  CHAT: MessagesSquare,
  RESOURCE: FolderOpen,
};

interface SpaceCardProps {
  name: string;
  slug: string;
  description: string;
  type: string;
  color: string;
  visibility: string;
  memberCount: number;
  postCount: number;
}

export function SpaceCard({
  name,
  slug,
  description,
  type,
  color,
  visibility,
  memberCount,
  postCount,
}: SpaceCardProps) {
  const Icon = typeIcons[type] || MessageSquare;

  return (
    <Link href={`/app/spaces/${slug}`}>
      <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 cursor-pointer">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ backgroundColor: color + "15" }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{name}</h3>
              {visibility === "PRIVATE" && (
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {visibility === "PAID" && (
                <CreditCard className="h-3.5 w-3.5 text-amber-500" />
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {memberCount} members
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {postCount} posts
              </span>
              <Badge variant="secondary" className="text-[10px]">
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
