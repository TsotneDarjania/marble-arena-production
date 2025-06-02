"use server";

import { createClient } from "@/app/utils/supabase/server";

type VoteResult =
  | {
      success: true;
      newUserCoins: number;
      newTeamVotes: number;
    }
  | {
      success: false;
      message: string;
    };

export async function userVoteTeam(
  userId: string,
  teamName: string,
  voteAmount: number
): Promise<VoteResult> {
  const supabase = await createClient();

  // Fetch user coins
  const { data: userData, error: userError } = await supabase
    .from("Users") // ✅ use consistent casing
    .select("balance")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    return { success: false, message: "User not found" };
  }

  if (userData.balance < voteAmount) {
    return { success: false, message: "Not enough coins" };
  }

  // Fetch current team votes
  const { data: teamData, error: teamError } = await supabase
    .from("PromotionTeams")
    .select("voted_coins")
    .eq("team_name", teamName)
    .single();

  if (teamError || !teamData) {
    return { success: false, message: "Team not found" };
  }

  const newUserCoins = userData.balance - voteAmount;
  const newTeamVotes = parseInt(teamData.voted_coins) + voteAmount;

  // Update both in parallel
  const [{ error: updateUserErr }, { error: updateVoteErr }] =
    await Promise.all([
      supabase.from("Users").update({ balance: newUserCoins }).eq("id", userId),
      supabase
        .from("PromotionTeams")
        .update({ voted_coins: newTeamVotes.toString() })
        .eq("team_name", teamName),
    ]);

  if (updateUserErr || updateVoteErr) {
    return {
      success: false,
      message:
        updateUserErr?.message ||
        updateVoteErr?.message ||
        "Failed to update vote",
    };
  }

  return {
    success: true,
    newUserCoins,
    newTeamVotes,
  };
}
