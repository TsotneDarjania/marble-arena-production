"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function saveHeroEmbedVideoLink(videoUrl: string) {
  const supabase = await createClient();

  // This will insert the row if it doesn't exist, or update it if it does (by id = 1)
  const { error } = await supabase
    .from("WebContent")
    .upsert({ id: 1, hero_embeded_video_link: videoUrl }, { onConflict: "id" });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
