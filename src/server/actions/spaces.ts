"use server";

export async function createSpace(data: {
  name: string;
  description?: string;
  type: string;
  visibility: string;
}) {
  // TODO: Prisma create space
  return { success: true };
}

export async function joinSpace(spaceId: string) {
  return { success: true };
}

export async function leaveSpace(spaceId: string) {
  return { success: true };
}
