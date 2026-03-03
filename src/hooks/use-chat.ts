"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getMessages,
  sendMessage as sendMessageAction,
  editMessage as editMessageAction,
  deleteMessage as deleteMessageAction,
} from "@/server/actions/messages";

export interface ChatMessage {
  id: string;
  content: string;
  type: string;
  authorId: string;
  spaceId: string;
  parentId: string | null;
  editedAt: string | Date | null;
  createdAt: string | Date;
  author: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  _count?: {
    children: number;
  };
  // Optimistic flag
  _optimistic?: boolean;
}

// Normalize dates to strings for consistency
function serializeMessage(msg: Record<string, unknown>): ChatMessage {
  return {
    ...msg,
    createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
    editedAt: msg.editedAt instanceof Date ? msg.editedAt.toISOString() : msg.editedAt,
  } as ChatMessage;
}

interface TypingUser {
  userId: string;
  username: string;
  displayName: string | null;
}

export function useChat(spaceId: string, currentUserId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial messages
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const result = await getMessages(spaceId);
        if (!cancelled) {
          setMessages(result.messages.map((m: Record<string, unknown>) => serializeMessage(m)));
          setHasMore(result.hasMore);
          setNextCursor(result.nextCursor);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [spaceId]);

  // Subscribe to Supabase Realtime
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`chat:${spaceId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `spaceId=eq.${spaceId}`,
        },
        async (payload) => {
          // Fetch the full message with author info
          // (Realtime only gives us raw row data)
          const newMsg = payload.new as Record<string, unknown>;
          // Skip if it's our optimistic message
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMsg.id);
            if (exists) {
              // Replace optimistic with real
              return prev.map((m) =>
                m.id === newMsg.id ? { ...m, _optimistic: false } : m
              );
            }
            // New message from someone else - append
            // We need author info, so we'll refetch
            return prev;
          });

          // Refetch to get author data for messages from others
          try {
            const result = await getMessages(spaceId, undefined, 1);
            if (result.messages.length > 0) {
              const latestMsg = serializeMessage(result.messages[0] as Record<string, unknown>);
              setMessages((prev) => {
                const exists = prev.some((m) => m.id === latestMsg.id);
                if (!exists) {
                  return [...prev, latestMsg];
                }
                // Update existing with full data
                return prev.map((m) =>
                  m.id === latestMsg.id ? { ...latestMsg, _optimistic: false } : m
                );
              });
            }
          } catch {
            // Ignore refetch errors
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `spaceId=eq.${spaceId}`,
        },
        (payload) => {
          const updated = payload.new as Record<string, unknown>;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updated.id
                ? {
                    ...m,
                    content: updated.content as string,
                    editedAt: updated.editedAt as string,
                  }
                : m
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `spaceId=eq.${spaceId}`,
        },
        (payload) => {
          const deleted = payload.old as Record<string, unknown>;
          setMessages((prev) => prev.filter((m) => m.id !== deleted.id));
        }
      )
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const typing: TypingUser[] = [];
        Object.values(state).forEach((presences) => {
          (presences as Array<Record<string, unknown>>).forEach((p) => {
            if (
              p.typing &&
              p.userId !== currentUserId
            ) {
              typing.push({
                userId: p.userId as string,
                username: p.username as string,
                displayName: p.displayName as string | null,
              });
            }
          });
        });
        setTypingUsers(typing);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [spaceId, currentUserId]);

  // Send message with optimistic update
  const sendMessage = useCallback(
    async (content: string, parentId?: string) => {
      // Optimistic message
      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticMsg: ChatMessage = {
        id: optimisticId,
        content,
        type: "TEXT",
        authorId: currentUserId || "",
        spaceId,
        parentId: parentId || null,
        editedAt: null,
        createdAt: new Date().toISOString(),
        author: {
          id: currentUserId || "",
          username: "",
          displayName: null,
          avatarUrl: null,
        },
        _optimistic: true,
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const real = await sendMessageAction(spaceId, content, parentId);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId
              ? { ...serializeMessage(real as Record<string, unknown>), _optimistic: false }
              : m
          )
        );
      } catch (err) {
        // Remove optimistic on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        throw err;
      }
    },
    [spaceId, currentUserId]
  );

  const editMessage = useCallback(async (messageId: string, content: string) => {
    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, content, editedAt: new Date().toISOString() }
          : m
      )
    );

    try {
      await editMessageAction(messageId, content);
    } catch (err) {
      // Revert - refetch
      const result = await getMessages(spaceId);
      setMessages(result.messages.map((m: Record<string, unknown>) => serializeMessage(m)));
      throw err;
    }
  }, [spaceId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    try {
      await deleteMessageAction(messageId);
    } catch (err) {
      const result = await getMessages(spaceId);
      setMessages(result.messages.map((m: Record<string, unknown>) => serializeMessage(m)));
      throw err;
    }
  }, [spaceId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || !nextCursor) return;
    try {
      const result = await getMessages(spaceId, nextCursor);
      setMessages((prev) => [...(result.messages.map((m: Record<string, unknown>) => serializeMessage(m))), ...prev]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (err) {
      console.error("Failed to load more:", err);
    }
  }, [spaceId, hasMore, nextCursor]);

  // Broadcast typing indicator
  const broadcastTyping = useCallback(
    (username: string, displayName: string | null) => {
      if (!channelRef.current || !currentUserId) return;
      channelRef.current.track({
        userId: currentUserId,
        username,
        displayName,
        typing: true,
      });

      // Clear typing after 3 seconds
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.track({
          userId: currentUserId,
          username,
          displayName,
          typing: false,
        });
      }, 3000);
    },
    [currentUserId]
  );

  return {
    messages,
    isLoading,
    hasMore,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMore,
    broadcastTyping,
  };
}
