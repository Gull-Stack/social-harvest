import { Header } from "@/components/layout/header";
import { PostComposer } from "@/components/feed/post-composer";
import { PostCard } from "@/components/feed/post-card";

const mockPosts = [
  {
    author: { name: "Sarah Chen", username: "sarahc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
    space: { name: "General", color: "#6366f1" },
    content: "Just shipped the new onboarding flow! 🚀 Let me know what you think — feedback welcome in the replies.",
    timeAgo: "2h ago",
    likes: 12,
    comments: 5,
    isPinned: true,
  },
  {
    author: { name: "Marcus Lee", username: "marcusl", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus" },
    space: { name: "Introductions", color: "#8b5cf6" },
    content: "Hey everyone! 👋 I'm Marcus, a product designer based in Austin. Excited to be part of this community. Looking forward to learning from all of you!",
    timeAgo: "4h ago",
    likes: 24,
    comments: 8,
  },
  {
    author: { name: "Alex Rivera", username: "alexr", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
    space: { name: "Resources", color: "#ef4444" },
    content: "Compiled a list of the top 10 tools for community management in 2026. Link in the comments — includes some hidden gems that most people miss.",
    timeAgo: "6h ago",
    likes: 42,
    comments: 15,
  },
  {
    author: { name: "Jordan Kim", username: "jordank", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan" },
    space: { name: "Watercooler", color: "#10b981" },
    content: "What's everyone working on this week? I'm deep in a rebrand project and could use some accountability partners 💪",
    timeAgo: "8h ago",
    likes: 8,
    comments: 12,
  },
  {
    author: { name: "Priya Patel", username: "priyap", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
    space: { name: "Weekly Events", color: "#f59e0b" },
    content: "Reminder: Community AMA this Thursday at 3pm EST! We'll be chatting about growth strategies for 2026. Drop your questions below 👇",
    timeAgo: "12h ago",
    likes: 31,
    comments: 22,
  },
];

export default function FeedPage() {
  return (
    <>
      <Header title="Home Feed" />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-4">
        <PostComposer />
        {mockPosts.map((post, i) => (
          <PostCard key={i} {...post} />
        ))}
      </div>
    </>
  );
}
