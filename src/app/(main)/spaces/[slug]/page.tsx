import { Header } from "@/components/layout/header";
import { PostComposer } from "@/components/feed/post-composer";
import { PostCard } from "@/components/feed/post-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Settings } from "lucide-react";

interface SpacePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SpacePage({ params }: SpacePageProps) {
  const { slug } = await params;

  // Mock data — will come from DB
  const space = {
    name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    description: "A space for the community to connect and share.",
    color: "#6366f1",
    memberCount: 248,
    postCount: 120,
  };

  const mockPosts = [
    {
      author: { name: "Sarah Chen", username: "sarahc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
      space: { name: space.name, color: space.color },
      content: "Just launched the new feature! Really excited to see how the community uses it. What do you all think?",
      timeAgo: "1h ago",
      likes: 18,
      comments: 7,
      isPinned: true,
    },
    {
      author: { name: "Marcus Lee", username: "marcusl", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus" },
      space: { name: space.name, color: space.color },
      content: "Has anyone tried the new integration? I'm curious about performance benchmarks.",
      timeAgo: "3h ago",
      likes: 5,
      comments: 3,
    },
    {
      author: { name: "Priya Patel", username: "priyap", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
      space: { name: space.name, color: space.color },
      content: "Sharing my workflow setup — took me a while to get it right but now it's running smoothly. Happy to answer questions!",
      timeAgo: "5h ago",
      likes: 22,
      comments: 11,
    },
  ];

  return (
    <>
      <Header title={space.name} />
      {/* Space Header Banner */}
      <div className="border-b border-gray-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: space.color + "15" }}
                >
                  <MessageSquare className="h-5 w-5" style={{ color: space.color }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{space.name}</h2>
                  <p className="text-sm text-muted-foreground">{space.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {space.memberCount} members
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {space.postCount} posts
                </span>
                <Badge variant="secondary">Public</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      {/* Posts */}
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
        <PostComposer />
        {mockPosts.map((post, i) => (
          <PostCard key={i} {...post} />
        ))}
      </div>
    </>
  );
}
