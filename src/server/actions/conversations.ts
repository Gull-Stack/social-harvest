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

/** Find or create a 1:1 DM conversation between current user and another user */
export async function getOrCreateDM(otherUserId: string) {
  const userId = await getAuthUserId();
  if (userId === otherUserId) throw new Error("Cannot DM yourself");

  const supabase = await createServerSupabaseClient();

  // Find existing DM between these two users
  const { data: myConvos } = await supabase
    .from("conversation_participants")
    .select("conversationId")
    .eq("userId", userId);

  if (myConvos && myConvos.length > 0) {
    const myConvoIds = myConvos.map((c) => c.conversationId);

    const { data: shared } = await supabase
      .from("conversation_participants")
      .select("conversationId")
      .eq("userId", otherUserId)
      .in("conversationId", myConvoIds);

    if (shared && shared.length > 0) {
      // Verify it's a DIRECT conversation
      const { data: conv } = await supabase
        .from("conversations")
        .select("id, type")
        .eq("id", shared[0].conversationId)
        .eq("type", "DIRECT")
        .single();

      if (conv) return conv.id;
    }
  }

  // Create new conversation
  const { data: newConv, error: convErr } = await supabase
    .from("conversations")
    .insert({ type: "DIRECT" })
    .select("id")
    .single();

  if (convErr || !newConv) throw new Error("Failed to create conversation");

  // Add both participants
  await supabase.from("conversation_participants").insert([
    { conversationId: newConv.id, userId },
    { conversationId: newConv.id, userId: otherUserId },
  ]);

  return newConv.id;
}

/** Get all DM conversations for current user with last message and other participant */
export async function getConversations() {
  const userId = await getAuthUserId();
  const supabase = await createServerSupabaseClient();

  // Get user's conversation IDs
  const { data: participations } = await supabase
    .from("conversation_participants")
    .select("conversationId")
    .eq("userId", userId);

  if (!participations || participations.length === 0) return [];

  const convIds = participations.map((p) => p.conversationId);

  // Get conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, type, updatedAt")
    .in("id", convIds)
    .eq("type", "DIRECT")
    .order("updatedAt", { ascending: false });

  if (!conversations) return [];

  // For each conversation, get the other participant and last message
  const results = await Promise.all(
    conversations.map(async (conv) => {
      // Get other participant
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("userId")
        .eq("conversationId", conv.id)
        .neq("userId", userId);

      const otherUserId = participants?.[0]?.userId;
      let otherUser = null;

      if (otherUserId) {
        const { data: profile } = await supabase
          .from("users")
          .select("id, username, displayName, avatarUrl")
          .eq("id", otherUserId)
          .single();
        otherUser = profile;
      }

      // Get last message
      const { data: lastMessages } = await supabase
        .from("messages")
        .select("id, content, createdAt, authorId")
        .eq("conversationId", conv.id)
        .order("createdAt", { ascending: false })
        .limit(1);

      const lastMessage = lastMessages?.[0] || null;

      return {
        id: conv.id,
        updatedAt: conv.updatedAt,
        otherUser,
        lastMessage,
      };
    })
  );

  return results;
}

/** Send a DM */
export async function sendDM(conversationId: string, content: string) {
  const userId = await getAuthUserId();
  const supabase = await createServerSupabaseClient();

  const { data: msg, error } = await supabase
    .from("messages")
    .insert({
      content,
      authorId: userId,
      conversationId,
      type: "TEXT",
    })
    .select("id, content, authorId, conversationId, type, createdAt")
    .single();

  if (error) throw new Error("Failed to send message");

  // Update conversation timestamp
  await supabase
    .from("conversations")
    .update({ updatedAt: new Date().toISOString() })
    .eq("id", conversationId);

  return msg;
}

/** Get messages for a conversation */
export async function getDMMessages(
  conversationId: string,
  cursor?: string,
  limit: number = 50
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("messages")
    .select("id, content, type, authorId, conversationId, editedAt, createdAt")
    .eq("conversationId", conversationId)
    .order("createdAt", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    // Get the createdAt of the cursor message for pagination
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
  }));

  return {
    messages: enriched,
    hasMore,
    nextCursor: hasMore ? messages[0]?.id : undefined,
  };
}
