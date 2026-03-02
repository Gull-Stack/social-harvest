"use server";

export async function updateProfile(data: {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}) {
  // TODO: Prisma update user
  return { success: true };
}

export async function searchMembers(query: string) {
  // TODO: Prisma search
  return [];
}
