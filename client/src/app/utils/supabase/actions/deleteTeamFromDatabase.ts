"use server";

import { createClient } from "../server";

export async function deleteTeamFromDatabase(teamId: number) {
  const supabase = await createClient();

  // Step 1: Get team info (to access the image path)
  const { data: teamData, error: fetchError } = await supabase
    .from("Teams")
    .select("team_logo_url")
    .eq("id", teamId)
    .single();

  if (fetchError) {
    return {
      success: false,
      message: "Failed to fetch team: " + fetchError.message,
    };
  }

  // Step 2: Parse the file path from the public URL
  let imagePath: string | null = null;
  if (teamData?.team_logo_url) {
    try {
      const url = new URL(teamData.team_logo_url);
      const pathParts = url.pathname.split("/");
      const fileIndex = pathParts.findIndex((p) => p === "teams");
      if (fileIndex !== -1) {
        imagePath = `teams/${pathParts.slice(fileIndex + 1).join("/")}`;
      }
    } catch (e) {
      return { success: false, message: "Invalid logo URL" };
    }
  }

  // Step 3: Delete image from bucket if it exists
  if (imagePath) {
    const { error: imageDeleteError } = await supabase.storage
      .from("logos")
      .remove([imagePath]);

    if (imageDeleteError) {
      return {
        success: false,
        message: "Image delete failed: " + imageDeleteError.message,
      };
    }
  }

  // Step 4: Delete the team from the database
  const { error: deleteError } = await supabase
    .from("Teams")
    .delete()
    .eq("id", teamId);

  if (deleteError) {
    return {
      success: false,
      message: "Team delete failed: " + deleteError.message,
    };
  }

  return { success: true };
}
