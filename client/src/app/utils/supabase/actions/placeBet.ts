"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function placeBetInDatabase(betInfo: {
  user_id: string;
  option: "host" | "draw" | "guest";
  amount: number;
  multiplier: number;
  potential_win: number;
  teams: {
    host: string;
    guest: string;
    hostTeamLogoUrl: string;
    guestTeamLogoUrl: string;
  };
  coefficients: {
    host: number;
    draw: number;
    guest: number;
  };
  result: string;
  week: number;
}) {
  const supabase = await createClient();

  // Step 1: Get user current balance
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("balance")
    .eq("id", betInfo.user_id)
    .single();

  if (userError || !userData) {
    return { success: false, message: "Failed to fetch user balance" };
  }

  const currentBalance = userData.balance;

  if (currentBalance < betInfo.amount) {
    return { success: false, message: "Insufficient balance" };
  }

  const newBalance = currentBalance - betInfo.amount;

  // Step 2: Run both operations in a transaction-like way
  const { error: insertError } = await supabase
    .from("Tickets")
    .insert([betInfo]);

  if (insertError) {
    return {
      success: false,
      message: "Failed to place bet: " + insertError.message,
    };
  }

  const { error: updateError } = await supabase
    .from("Users")
    .update({ balance: newBalance })
    .eq("id", betInfo.user_id);

  if (updateError) {
    return {
      success: false,
      message: "Bet placed, but failed to update balance",
    };
  }

  return { success: true, newBalance };
}
