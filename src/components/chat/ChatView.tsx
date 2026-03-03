"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChat, type ChatMessage as ChatMessageType } from "@/hooks/use-chat";
import { ChatMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";
import { ChatDateDivider } from "./ChatDateDivider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDown, Users, Hash } from "lucide-react";
import { isSameDay, differenceInMinutes } from "date-fns";

interface ChatViewProps {
  spaceId: string;
  spaceName: string;
  spaceColor?: string;
  memberCount?: number;
  currentUserId?: string;
  currentUsername?: string;
  currentDisplayName?: string | null;
}

export function ChatView({
  spaceId,
  spaceName,
  spaceColor = "#6366f1",
  memberCount = 0,
  currentUserId,
  currentUsername,
  currentDisplayName,
}: ChatViewProps) {
  const {
    messages,
    isLoading,
    hasMore,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMore,
    broadcastTyping,
  } = useChat(spaceId, currentUserId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    author: string;
    content: string;
  } | null>(null);
  const isNearBottom = useRef(true);

  // Auto-scroll to bottom on new messages (if near bottom)
  useEffect(() => {
    if (isNearBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initial scroll to bottom
  useEffect(() => {
    if (!isLoading) {
      bottomRef.current?.scrollIntoView();
    }
  }, [isLoading]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottom.current = distFromBottom < 100;
    setShowScrollDown(distFromBottom > 300);

    // Load more when scrolled to top
    if (el.scrollTop < 50 && hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  function handleReply(messageId: string) {
    const msg = messages.find((m) => m.id === messageId);
    if (msg) {
      setReplyingTo({
        id: msg.id,
        author: msg.author.displayName || msg.author.username,
        content: msg.content,
      });
    }
  }

  function handleTyping() {
    if (currentUsername) {
      broadcastTyping(currentUsername, currentDisplayName || null);
    }
  }

  // Check if message should be grouped with previous
  function shouldGroup(
    msg: ChatMessageType,
    prev: ChatMessageType | undefined
  ): boolean {
    if (!prev) return false;
    if (prev.authorId !== msg.authorId) return false;
    const diff = differenceInMinutes(
      new Date(msg.createdAt),
      new Date(prev.createdAt)
    );
    return diff < 5;
  }

  // Check if we need a date divider
  function needsDateDivider(
    msg: ChatMessageType,
    prev: ChatMessageType | undefined
  ): boolean {
    if (!prev) return true;
    return !isSameDay(new Date(msg.createdAt), new Date(prev.createdAt));
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-5 py-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: spaceColor + "15" }}
        >
          <Hash className="h-4 w-4" style={{ color: spaceColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold">{spaceName}</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {memberCount} members
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* Load more indicator */}
        {hasMore && (
          <div className="flex justify-center py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMore}
              className="text-xs text-muted-foreground"
            >
              Load older messages
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: spaceColor + "15" }}
            >
              <Hash className="h-7 w-7" style={{ color: spaceColor }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Welcome to #{spaceName}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This is the start of the conversation. Say something!
              </p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            {messages.map((msg, i) => {
              const prev = i > 0 ? messages[i - 1] : undefined;
              const showDivider = needsDateDivider(msg, prev);
              const isGrouped = !showDivider && shouldGroup(msg, prev);

              return (
                <div key={msg.id}>
                  {showDivider && (
                    <ChatDateDivider date={new Date(msg.createdAt)} />
                  )}
                  <ChatMessage
                    message={msg}
                    currentUserId={currentUserId}
                    isGrouped={isGrouped}
                    onReply={handleReply}
                    onEdit={editMessage}
                    onDelete={deleteMessage}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom FAB */}
      {showScrollDown && (
        <div className="absolute bottom-20 right-6">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-lg"
            onClick={() =>
              bottomRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-5 py-1.5 text-xs text-muted-foreground">
          <span className="font-medium">
            {typingUsers
              .map((u) => u.displayName || u.username)
              .join(", ")}
          </span>{" "}
          {typingUsers.length === 1 ? "is" : "are"} typing...
        </div>
      )}

      {/* Composer */}
      <ChatComposer
        onSend={sendMessage}
        onTyping={handleTyping}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        disabled={!currentUserId}
        placeholder={`Message #${spaceName}`}
      />
    </div>
  );
}
