import { Header } from "@/components/layout/header";
import { SpaceCard } from "@/components/spaces/space-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const mockSpaces = [
  { name: "General", slug: "general", description: "The main discussion hub for our community. Share ideas, ask questions, and connect with fellow members.", type: "DISCUSSION", color: "#6366f1", visibility: "PUBLIC", memberCount: 248, postCount: 1203 },
  { name: "Introductions", slug: "introductions", description: "New here? Introduce yourself and tell us what you're working on!", type: "DISCUSSION", color: "#8b5cf6", visibility: "PUBLIC", memberCount: 195, postCount: 412 },
  { name: "Getting Started", slug: "getting-started", description: "A step-by-step course to help you get the most out of the community.", type: "COURSE", color: "#06b6d4", visibility: "PUBLIC", memberCount: 180, postCount: 24 },
  { name: "Weekly Events", slug: "weekly-events", description: "AMAs, workshops, and community meetups. Never miss an event.", type: "EVENT", color: "#f59e0b", visibility: "PUBLIC", memberCount: 156, postCount: 89 },
  { name: "Watercooler", slug: "watercooler", description: "Off-topic chat, memes, and general good vibes.", type: "CHAT", color: "#10b981", visibility: "PUBLIC", memberCount: 210, postCount: 3421 },
  { name: "Resources", slug: "resources", description: "Curated tools, templates, guides, and links shared by the community.", type: "RESOURCE", color: "#ef4444", visibility: "PUBLIC", memberCount: 145, postCount: 67 },
  { name: "Pro Masterclass", slug: "pro-masterclass", description: "Exclusive advanced content for Pro members only.", type: "COURSE", color: "#d946ef", visibility: "PAID", memberCount: 42, postCount: 18 },
  { name: "Inner Circle", slug: "inner-circle", description: "Private space for founding members and advisors.", type: "DISCUSSION", color: "#0ea5e9", visibility: "PRIVATE", memberCount: 12, postCount: 89 },
];

export default function SpacesPage() {
  return (
    <>
      <Header title="Spaces" />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">All Spaces</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse and join spaces that interest you
            </p>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Space
          </Button>
        </div>
        <div className="grid gap-4">
          {mockSpaces.map((space) => (
            <SpaceCard key={space.slug} {...space} />
          ))}
        </div>
      </div>
    </>
  );
}
