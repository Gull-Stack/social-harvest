"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Reply,
  Pencil,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import type { ChatMessage as ChatMessageType } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  currentUserId?: string;
  isGrouped?: boolean; // same author as previous, within 5 min
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
}

export function ChatMessage({
  message,
  currentUserId,
  isGrouped = false,
  onReply,
  onEdit,
  onDelete,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isHovered, setIsHovered] = useState(false);

  const isOwn = message.authorId === currentUserId;
  const displayName =
    message.author.displayName || message.author.username || "Unknown";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const threadCount = message._count?.children || 0;

  function handleEditSubmit() {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(message.content);
    }
  }

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-4 hover:bg-gray-50/80 transition-colors",
        isGrouped ? "py-0.5" : "pt-3 pb-0.5",
        message._optimistic && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar or spacer */}
      <div className="w-10 shrink-0 flex justify-center">
        {!isGrouped ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={message.author.avatarUrl || undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        ) : (
          // Show timestamp on hover for grouped messages
          isHovered && (
            <span className="text-[10px] text-muted-foreground/60 leading-[22px]">
              {format(new Date(message.createdAt), "h:mm")}
            </span>
          )
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {!isGrouped && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "h:mm a")}
            </span>
          </div>
        )}

        {isEditing ? (
          <div className="mt-1">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className="min-h-[60px] text-sm"
              autoFocus
            />
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Enter to save · Escape to cancel
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        )}

        {message.editedAt && !isEditing && (
          <span className="text-[10px] text-muted-foreground/60">(edited)</span>
        )}

        {/* Thread indicator */}
        {threadCount > 0 && (
          <button className="mt-1 flex items-center gap-1.5 text-xs text-primary hover:underline">
            <MessageSquare className="h-3 w-3" />
            {threadCount} {threadCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {/* Hover actions */}
      {isHovered && !isEditing && !message._optimistic && (
        <div className="absolute -top-3 right-4 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-1 py-0.5 shadow-sm">
          {onReply && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => onReply(message.id)}
            >
              <Reply className="h-3.5 w-3.5" />
            </Button>
          )}
          {(isOwn || true) && ( // admin check would go here
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {isOwn && (
                  <DropdownMenuItem
                    onClick={() => {
                      setEditContent(message.content);
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(message.id)}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
}
