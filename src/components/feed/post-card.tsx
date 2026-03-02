"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal, Pin } from "lucide-react";

interface PostCardProps {
  author: { name: string; username: string; avatar: string };
  space: { name: string; color: string };
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
}

export function PostCard({
  author,
  space,
  content,
  timeAgo,
  likes,
  comments,
  isPinned,
}: PostCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {isPinned && (
        <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Pin className="h-3 w-3" />
          Pinned post
        </div>
      )}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{author.name}</span>
            <span className="text-xs text-muted-foreground">@{author.username}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            <Badge
              variant="secondary"
              className="ml-auto text-[10px] px-2 py-0"
              style={{
                backgroundColor: space.color + "15",
                color: space.color,
              }}
            >
              {space.name}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {content}
          </p>
          <div className="mt-4 flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-red-500">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-primary">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
