"use server";

// TODO: Wire up Supabase auth
export async function signInWithMagicLink(email: string) {
  // const supabase = await createServerSupabaseClient();
  // const { error } = await supabase.auth.signInWithOtp({ email });
  return { success: true };
}

export async function signOut() {
  // const supabase = await createServerSupabaseClient();
  // await supabase.auth.signOut();
  return { success: true };
}
