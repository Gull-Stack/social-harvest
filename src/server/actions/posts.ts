"use server";

export async function createPost(spaceId: string, content: string, title?: string) {
  // TODO: Prisma create post
  return { success: true };
}

export async function deletePost(postId: string) {
  return { success: true };
}

export async function toggleReaction(postId: string, emoji: string) {
  return { success: true };
}
