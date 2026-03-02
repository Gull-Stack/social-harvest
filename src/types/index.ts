export type SpaceType = "DISCUSSION" | "COURSE" | "EVENT" | "CHAT" | "RESOURCE";
export type SpaceVisibility = "PUBLIC" | "PRIVATE" | "PAID";
export type SpaceRole = "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
export type GlobalRole = "OWNER" | "ADMIN" | "MEMBER";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: GlobalRole;
  onboarded: boolean;
}

export interface SpaceData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  type: SpaceType;
  visibility: SpaceVisibility;
  memberCount?: number;
  postCount?: number;
}

export interface PostData {
  id: string;
  title: string | null;
  content: Record<string, unknown>;
  author: Pick<UserProfile, "id" | "username" | "displayName" | "avatarUrl">;
  space: Pick<SpaceData, "id" | "name" | "slug" | "color">;
  commentCount: number;
  reactionCount: number;
  isPinned: boolean;
  createdAt: string;
}
