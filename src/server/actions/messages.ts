"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getAuthUserId() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function sendMessage(
  spaceId: string,
  content: string,
  parentId?: string
) {
  const userId = await getAuthUserId();
  const supabase = await createServerSupabaseClient();

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      content,
      authorId: userId,
      spaceId,
      parentId: parentId || null,
      type: "TEXT",
    })
    .select(
      "id, content, type, authorId, spaceId, parentId, editedAt, createdAt"
    )
    .single();

  if (error) throw new Error("Failed to send message");

  // Get author info
  const { data: author } = await supabase
    .from("users")
    .select("id, username, displayName, avatarUrl")
    .eq("id", userId)
    .single();

  return { ...message, author };
}

export async function getMessages(
  spaceId: string,
  cursor?: string,
  limit: number = 50
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("messages")
    .select(
      "id, content, type, authorId, spaceId, parentId, editedAt, createdAt"
    )
    .eq("spaceId", spaceId)
    .order("createdAt", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    const { data: cursorMsg } = await supabase
      .from("messages")
      .select("createdAt")
      .eq("id", cursor)
      .single();
    if (cursorMsg) {
      query = query.lt("createdAt", cursorMsg.createdAt);
    }
  }

  const { data: messages } = await query;

  if (!messages) return { messages: [], hasMore: false, nextCursor: undefined };

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();

  // Get author info for all messages
  const authorIds = [...new Set(messages.map((m) => m.authorId))];
  const { data: authors } = await supabase
    .from("users")
    .select("id, username, displayName, avatarUrl")
    .in("id", authorIds);

  const authorMap = new Map(authors?.map((a) => [a.id, a]) || []);

  const enriched = messages.reverse().map((m) => ({
    ...m,
    author: authorMap.get(m.authorId) || {
      id: m.authorId,
      username: "unknown",
      displayName: null,
      avatarUrl: null,
    },
    _count: { children: 0 }, // TODO: count replies
  }));

  return {
    messages: enriched,
    hasMore,
    nextCursor: hasMore ? messages[0]?.id : undefined,
  };
}

export async function editMessage(messageId: string, content: string) {
  const userId = await getAuthUserId();
  const supabase = await createServerSupabaseClient();

  const { data: message } = await supabase
    .from("messages")
    .select("authorId")
    .eq("id", messageId)
    .single();

  if (!message) throw new Error("Message not found");
  if (message.authorId !== userId) throw new Error("Not authorized");

  const { data: updated, error } = await supabase
    .from("messages")
    .update({ content, editedAt: new Date().toISOString() })
    .eq("id", messageId)
    .select(
      "id, content, type, authorId, spaceId, parentId, editedAt, createdAt"
    )
    .single();

  if (error) throw new Error("Failed to edit message");

  const { data: author } = await supabase
    .from("users")
    .select("id, username, displayName, avatarUrl")
    .eq("id", userId)
    .single();

  return { ...updated, author };
}

export async function deleteMessage(messageId: string) {
  const userId = await getAuthUserId();
  const supabase = await createServerSupabaseClient();

  const { data: message } = await supabase
    .from("messages")
    .select("authorId, spaceId")
    .eq("id", messageId)
    .single();

  if (!message) throw new Error("Message not found");

  const isAuthor = message.authorId === userId;

  // Check if admin/moderator
  let isAdmin = false;
  if (message.spaceId) {
    const { data: membership } = await supabase
      .from("space_members")
      .select("role")
      .eq("userId", userId)
      .eq("spaceId", message.spaceId)
      .single();
    isAdmin =
      membership?.role === "ADMIN" || membership?.role === "MODERATOR";
  }

  if (!isAuthor && !isAdmin) throw new Error("Not authorized");

  await supabase.from("messages").delete().eq("id", messageId);
  return { success: true };
}

export async function markAsRead(spaceId: string, messageId: string) {
  const userId = await getAuthUserId();
  const supabase = await createServerSupabaseClient();

  await supabase.from("user_channel_state").upsert(
    {
      userId,
      spaceId,
      lastReadMessageId: messageId,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    },
    { onConflict: "userId,spaceId" }
  );

  return { success: true };
}

export async function getSpaceMembers(spaceId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: members } = await supabase
    .from("space_members")
    .select("userId")
    .eq("spaceId", spaceId);

  if (!members) return [];

  const userIds = members.map((m) => m.userId);
  const { data: users } = await supabase
    .from("users")
    .select("id, username, displayName, avatarUrl")
    .in("id", userIds);

  return users || [];
}
