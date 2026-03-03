"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, X, Smile, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  onSend: (content: string, parentId?: string) => Promise<void>;
  onTyping?: () => void;
  replyingTo?: { id: string; author: string; content: string } | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatComposer({
  onSend,
  onTyping,
  replyingTo,
  onCancelReply,
  disabled = false,
  placeholder = "Type a message...",
}: ChatComposerProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
  }, [content]);

  // Focus when replying
  useEffect(() => {
    if (replyingTo) textareaRef.current?.focus();
  }, [replyingTo]);

  const handleSend = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    try {
      await onSend(trimmed, replyingTo?.id);
      setContent("");
      onCancelReply?.();
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setIsSending(false);
    }
  }, [content, isSending, onSend, replyingTo, onCancelReply]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    onTyping?.();
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      {/* Reply indicator */}
      {replyingTo && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
          <div className="h-4 w-0.5 rounded-full bg-primary" />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-gray-900">
              Replying to {replyingTo.author}
            </span>
            <p className="truncate text-muted-foreground text-xs">
              {replyingTo.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={onCancelReply}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Input */}
        <div
          className={cn(
            "flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 transition-colors",
            "focus-within:border-primary/30 focus-within:bg-white"
          )}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            rows={1}
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
            style={{ maxHeight: 160 }}
          />
        </div>

        {/* Emoji */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <Smile className="h-4 w-4" />
        </Button>

        {/* Send */}
        <Button
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 rounded-xl transition-all",
            content.trim()
              ? "bg-primary text-white"
              : "bg-gray-100 text-muted-foreground"
          )}
          disabled={!content.trim() || isSending || disabled}
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
