"use server";

import { createClient } from "@supabase/supabase-js";

export async function getLeaderboard(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ admin access
  );

  // Step 1: Get top 10 users from your Users table
  const { data: topUsersRaw, error: topUsersError } = await supabase
    .from("Users")
    .select("id, profile_image_url, total_won")
    .order("total_won", { ascending: false })
    .limit(10);

  if (topUsersError || !topUsersRaw) {
    return {
      success: false,
      message: topUsersError?.message ?? "Failed to fetch top users",
    };
  }

  // Step 2: Fetch auth users and match displayName
  const { data: authUserList, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    return {
      success: false,
      message: "Failed to fetch auth metadata: " + authError.message,
    };
  }

  const getDisplayName = (id: string): string =>
    authUserList.users.find((u) => u.id === id)?.user_metadata?.displayName ??
    "Anonymous";

  const topUsers = topUsersRaw.map((u) => ({
    ...u,
    username: getDisplayName(u.id),
  }));

  // Step 3: Get current user's rank
  let currentUser = null;
  if (userId) {
    const { data: allRanked } = await supabase
      .from("Users")
      .select("id")
      .order("total_won", { ascending: false });

    const rank = allRanked!.findIndex((u) => u.id === userId) + 1;

    const { data: userRaw } = await supabase
      .from("Users")
      .select("id, profile_image_url, total_won")
      .eq("id", userId)
      .single();

    if (userRaw) {
      currentUser = {
        rank,
        user: {
          ...userRaw,
          username: getDisplayName(userRaw.id),
        },
      };
    }
  }

  return {
    success: true,
    topUsers,
    currentUser,
  };
}
