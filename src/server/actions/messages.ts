"use server";

import { prisma } from "@/lib/prisma";
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

  const message = await prisma.message.create({
    data: {
      content,
      authorId: userId,
      spaceId,
      parentId: parentId || null,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });

  return message;
}

export async function getMessages(
  spaceId: string,
  cursor?: string,
  limit: number = 50
) {
  const messages = await prisma.message.findMany({
    where: { spaceId },
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { children: true },
      },
    },
  });

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();

  return {
    messages: messages.reverse(), // oldest first for display
    hasMore,
    nextCursor: hasMore ? messages[0]?.id : undefined,
  };
}

export async function editMessage(messageId: string, content: string) {
  const userId = await getAuthUserId();

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) throw new Error("Message not found");
  if (message.authorId !== userId) throw new Error("Not authorized");

  return prisma.message.update({
    where: { id: messageId },
    data: { content, editedAt: new Date() },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export async function deleteMessage(messageId: string) {
  const userId = await getAuthUserId();

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { space: { include: { members: true } } },
  });

  if (!message) throw new Error("Message not found");

  // Allow author or space admins/owners
  const isAuthor = message.authorId === userId;
  const membership = message.space.members.find((m) => m.userId === userId);
  const isAdmin =
    membership?.role === "OWNER" ||
    membership?.role === "ADMIN" ||
    membership?.role === "MODERATOR";

  if (!isAuthor && !isAdmin) throw new Error("Not authorized");

  await prisma.message.delete({ where: { id: messageId } });
  return { success: true };
}

export async function markAsRead(spaceId: string, messageId: string) {
  const userId = await getAuthUserId();

  await prisma.userChannelState.upsert({
    where: {
      userId_spaceId: { userId, spaceId },
    },
    update: {
      lastReadMessageId: messageId,
      unreadCount: 0,
    },
    create: {
      userId,
      spaceId,
      lastReadMessageId: messageId,
      unreadCount: 0,
    },
  });

  return { success: true };
}

export async function getSpaceMembers(spaceId: string) {
  const members = await prisma.spaceMember.findMany({
    where: { spaceId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });

  return members.map((m) => m.user);
}
