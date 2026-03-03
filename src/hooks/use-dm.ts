"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getDMMessages,
  sendDM,
} from "@/server/actions/conversations";
import type { ChatMessage } from "@/hooks/use-chat";

export function useDM(conversationId: string | null, currentUserId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const result = await getDMMessages(conversationId!);
        if (!cancelled) {
          setMessages(result.messages.map((m: Record<string, unknown>) => ({ ...m, spaceId: "", parentId: null } as unknown as ChatMessage)));
          setHasMore(result.hasMore);
          setNextCursor(result.nextCursor);
        }
      } catch (err) {
        console.error("Failed to load DM messages:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`dm:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversationId=eq.${conversationId}`,
        },
        async () => {
          // Refetch latest to get author info
          try {
            const result = await getDMMessages(conversationId, undefined, 1);
            if (result.messages.length > 0) {
              const latestMsg = { ...result.messages[0], spaceId: "", parentId: null } as unknown as ChatMessage;
              setMessages((prev) => {
                const exists = prev.some((m) => m.id === latestMsg.id);
                if (exists) return prev.map((m) => (m.id === latestMsg.id ? latestMsg : m));
                // Skip if we already have an optimistic version
                const hasOptimistic = prev.some(
                  (m) => m._optimistic && m.content === latestMsg.content
                );
                if (hasOptimistic) {
                  return prev.map((m) =>
                    m._optimistic && m.content === latestMsg.content
                      ? { ...latestMsg, _optimistic: false }
                      : m
                  );
                }
                return [...prev, latestMsg];
              });
            }
          } catch {
            // ignore
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `conversationId=eq.${conversationId}`,
        },
        (payload) => {
          const deleted = payload.old as Record<string, unknown>;
          setMessages((prev) => prev.filter((m) => m.id !== deleted.id));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !currentUserId) return;

      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticMsg: ChatMessage = {
        id: optimisticId,
        content,
        type: "TEXT",
        authorId: currentUserId,
        spaceId: "",
        parentId: null,
        editedAt: null,
        createdAt: new Date().toISOString(),
        author: {
          id: currentUserId,
          username: "",
          displayName: null,
          avatarUrl: null,
        },
        _optimistic: true,
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const real = await sendDM(conversationId, content);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...optimisticMsg, ...real, _optimistic: false } : m
          )
        );
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      }
    },
    [conversationId, currentUserId]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || !nextCursor || !conversationId) return;
    try {
      const result = await getDMMessages(conversationId, nextCursor);
      setMessages((prev) => [...(result.messages.map((m: Record<string, unknown>) => ({ ...m, spaceId: "", parentId: null } as unknown as ChatMessage))), ...prev]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (err) {
      console.error("Failed to load more:", err);
    }
  }, [conversationId, hasMore, nextCursor]);

  return {
    messages,
    isLoading,
    hasMore,
    sendMessage,
    loadMore,
  };
}
