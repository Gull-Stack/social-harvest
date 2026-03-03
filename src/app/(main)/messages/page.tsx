import { Header } from "@/components/layout/header";
import { MessagesView } from "@/components/messages/MessagesView";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface MessagesPageProps {
  searchParams: Promise<{ dm?: string }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const { dm } = await searchParams;
  const supabase = await createServerSupabaseClient();

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

  // Get all community members for starting new conversations
  const { data: members } = await supabase
    .from("users")
    .select("id, username, displayName, avatarUrl")
    .neq("id", user?.id || "")
    .order("displayName", { ascending: true });

  return (
    <>
      <Header title="Messages" />
      <MessagesView
        currentUser={currentUser}
        members={members || []}
        initialDmUserId={dm}
      />
    </>
  );
}
