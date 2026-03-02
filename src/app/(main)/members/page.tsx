import { Header } from "@/components/layout/header";
import { MemberCard } from "@/components/members/member-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const mockMembers = [
  { name: "Bryce Morgan", username: "bryce", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harvest", bio: "Building communities and breaking things.", role: "OWNER", joinedAgo: "6 months ago" },
  { name: "Sarah Chen", username: "sarahc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", bio: "Product designer. Coffee enthusiast. Community builder.", role: "ADMIN", joinedAgo: "5 months ago" },
  { name: "Marcus Lee", username: "marcusl", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus", bio: "Full-stack dev, Austin TX. Always learning.", role: "MODERATOR", joinedAgo: "4 months ago" },
  { name: "Alex Rivera", username: "alexr", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex", bio: "Content creator & growth strategist.", role: "MEMBER", joinedAgo: "3 months ago" },
  { name: "Jordan Kim", username: "jordank", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan", bio: "Brand designer. Obsessed with type and color.", role: "MEMBER", joinedAgo: "2 months ago" },
  { name: "Priya Patel", username: "priyap", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", bio: "Community manager by day, podcast host by night.", role: "MEMBER", joinedAgo: "1 month ago" },
  { name: "Tom Baker", username: "tomb", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom", bio: "Startup founder. SaaS nerd.", role: "MEMBER", joinedAgo: "3 weeks ago" },
  { name: "Nina Rossi", username: "ninar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nina", bio: "UX researcher. Making things easier to use.", role: "MEMBER", joinedAgo: "2 weeks ago" },
];

export default function MembersPage() {
  return (
    <>
      <Header title="Members" />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Member Directory</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mockMembers.length} members in this community
              </p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
        <div className="grid gap-3">
          {mockMembers.map((member) => (
            <MemberCard key={member.username} {...member} />
          ))}
        </div>
      </div>
    </>
  );
}
