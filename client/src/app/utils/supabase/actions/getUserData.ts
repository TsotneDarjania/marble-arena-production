"use server";

import { cache } from "react";
import { createClient } from "@/app/utils/supabase/server";
import { UserType } from "@/app/types/userTypes";

export const getUserData = cache(async (): Promise<UserType> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data, error: userError } = await supabase
    .from("Users")
    .select("balance, profile_image_url, last_reward_date")
    .eq("id", user.id)
    .single();

  if (userError || !data) return null;

  return {
    username: user.user_metadata.displayName,
    coins: data.balance,
    profileImage: data.profile_image_url,
    id: user.id,
  };
});
