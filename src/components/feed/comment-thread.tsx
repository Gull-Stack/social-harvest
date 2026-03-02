"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Reply } from "lucide-react";

interface CommentProps {
  author: { name: string; avatar: string };
  content: string;
  timeAgo: string;
  likes: number;
  replies?: CommentProps[];
}

export function CommentThread({ comments }: { comments: CommentProps[] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment, i) => (
        <div key={i} className="flex gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                <Heart className="mr-1 h-3 w-3" /> {comment.likes}
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">
                <Reply className="mr-1 h-3 w-3" /> Reply
              </Button>
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 ml-2 border-l-2 border-gray-100 pl-4">
                <CommentThread comments={comment.replies} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
