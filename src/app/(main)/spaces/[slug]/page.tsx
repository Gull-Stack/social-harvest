import { Header } from "@/components/layout/header";
import { PostComposer } from "@/components/feed/post-composer";
import { PostCard } from "@/components/feed/post-card";
import { ChatView } from "@/components/chat/ChatView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Settings } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface SpacePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SpacePage({ params }: SpacePageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch space from DB
  const { data: space } = await supabase
    .from("spaces")
    .select("id, name, slug, description, color, type, visibility")
    .eq("slug", slug)
    .single();

  // Fetch member count
  const { count: memberCount } = await supabase
    .from("space_members")
    .select("*", { count: "exact", head: true })
    .eq("spaceId", space?.id || "");

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUser = null;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("id, username, displayName, avatarUrl")
      .eq("id", user.id)
      .single();
    currentUser = profile;
  }

  // Fallback if space not found
  if (!space) {
    return (
      <>
        <Header title="Space Not Found" />
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">This space doesn&apos;t exist.</p>
        </div>
      </>
    );
  }

  const spaceName = space.name || slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const spaceColor = space.color || "#6366f1";

  // If it's a CHAT space, render the chat view
  if (space.type === "CHAT") {
    return (
      <div className="flex h-full flex-col">
        <ChatView
          spaceId={space.id}
          spaceName={spaceName}
          spaceColor={spaceColor}
          memberCount={memberCount || 0}
          currentUserId={currentUser?.id}
          currentUsername={currentUser?.username}
          currentDisplayName={currentUser?.displayName}
        />
      </div>
    );
  }

  // Otherwise render the standard posts view
  const mockPosts = [
    {
      author: { name: "Sarah Chen", username: "sarahc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
      space: { name: spaceName, color: spaceColor },
      content: "Just launched the new feature! Really excited to see how the community uses it. What do you all think?",
      timeAgo: "1h ago",
      likes: 18,
      comments: 7,
      isPinned: true,
    },
    {
      author: { name: "Marcus Lee", username: "marcusl", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus" },
      space: { name: spaceName, color: spaceColor },
      content: "Has anyone tried the new integration? I'm curious about performance benchmarks.",
      timeAgo: "3h ago",
      likes: 5,
      comments: 3,
    },
    {
      author: { name: "Priya Patel", username: "priyap", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
      space: { name: spaceName, color: spaceColor },
      content: "Sharing my workflow setup — took me a while to get it right but now it's running smoothly. Happy to answer questions!",
      timeAgo: "5h ago",
      likes: 22,
      comments: 11,
    },
  ];

  return (
    <>
      <Header title={spaceName} />
      <div className="border-b border-gray-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: spaceColor + "15" }}
                >
                  <MessageSquare className="h-5 w-5" style={{ color: spaceColor }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{spaceName}</h2>
                  <p className="text-sm text-muted-foreground">{space.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {memberCount || 0} members
                </span>
                <Badge variant="secondary">{space.visibility}</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
        <PostComposer />
        {mockPosts.map((post, i) => (
          <PostCard key={i} {...post} />
        ))}
      </div>
    </>
  );
}
