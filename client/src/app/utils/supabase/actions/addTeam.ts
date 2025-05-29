"use server";

import { createClient } from "@/app/utils/supabase/server";
import { TeamDataType } from "@/app/types/gameDataTypes";

export async function addTeamToDatabase(data: FormData) {
  const supabase = await createClient();

  const file = data.get("team_logo_url") as File;
  let imageUrl = "";

  if (file && file.name) {
    const filename = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("logos") // ✅ your bucket name
      .upload(`teams/${filename}`, file);

    if (uploadError) {
      return { success: false, message: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("logos")
      .getPublicUrl(`teams/${filename}`);

    imageUrl = publicUrlData.publicUrl;
  }

  const insertData: Omit<TeamDataType, "id"> = {
    name: data.get("name") as string,
    tablo_name: data.get("tablo_name") as string,
    team_logo_url: imageUrl,
    primary_color: data.get("primary_color") as string,
    secondary_color: data.get("secondary_color") as string,
    attack_speed: data.get("attack_speed") as string,
    attack_strategy: data.get("attack_strategy") as string,
    default_strategy: data.get("default_strategy") as string,
    defence_strategy: data.get("defence_strategy") as string,
    midfielder_strategy: data.get("midfielder_strategy") as string,
    goalkeeper_speed: Number(data.get("goalkeeper_speed")),
    defence_speed: Number(data.get("defence_speed")),
    midfielder_speed: Number(data.get("midfielder_speed")),
    pass_accuracy: Number(data.get("pass_accuracy")),
    pass_speed: Number(data.get("pass_speed")),
    shoot_accuracy: Number(data.get("shoot_accuracy")),
    fault_possibility: Number(data.get("fault_possibility")),
    fifa_raiting: Number(data.get("fifa_raiting")),
  };

  const { error: insertError } = await supabase
    .from("Teams")
    .insert([insertData]);

  if (insertError) {
    return { success: false, message: insertError.message };
  }

  return { success: true };
}
