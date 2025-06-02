"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function addPromotionTeamToDatabase(data: FormData) {
  const supabase = await createClient();

  const file = data.get("team_logo_url") as File;
  let imageUrl = "";

  if (file && file.name) {
    const filename = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("logos") // your bucket name
      .upload(`promotion_teams/${filename}`, file);

    if (uploadError) {
      return { success: false, message: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("logos")
      .getPublicUrl(`promotion_teams/${filename}`);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("PromotionTeams").insert({
    team_name: data.get("team_name"),
    team_logo_url: imageUrl,
    voted_coins: "0", // default as string
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
