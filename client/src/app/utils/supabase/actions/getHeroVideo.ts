"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function getHeroEmbedVideoLink(): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("WebContent")
    .select("hero_embeded_video_link")
    .eq("id", 1)
    .single();

  if (error || !data?.hero_embeded_video_link) {
    return null;
  }

  return data.hero_embeded_video_link;
}
