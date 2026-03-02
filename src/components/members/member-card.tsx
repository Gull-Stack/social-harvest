"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface MemberCardProps {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  role: string;
  joinedAgo: string;
}

export function MemberCard({ name, username, avatar, bio, role, joinedAgo }: MemberCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <Avatar className="h-12 w-12 shrink-0">
        <AvatarImage src={avatar} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{name}</span>
          {role !== "MEMBER" && (
            <Badge variant="secondary" className="text-[10px]">
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">@{username}</p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{bio}</p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-2">
        <span className="text-xs text-muted-foreground">Joined {joinedAgo}</span>
        <Button variant="outline" size="sm" className="h-7">
          <MessageCircle className="mr-1.5 h-3 w-3" />
          Message
        </Button>
      </div>
    </div>
  );
}
