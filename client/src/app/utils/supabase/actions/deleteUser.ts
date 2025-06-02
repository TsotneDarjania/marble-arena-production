// utils/supabase/actions/deleteUser.ts
"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function deleteUser(userId: string) {
  const supabase = await createClient();

  // Delete tickets
  const { error: ticketsError } = await supabase
    .from("Tickets")
    .delete()
    .eq("user_id", userId);
  if (ticketsError) return { success: false, message: ticketsError.message };

  // Delete profile image from storage
  const fileName = `${userId}-default-user-image.png`;
  const { error: storageError } = await supabase.storage
    .from("user-profile-pictures")
    .remove([fileName]);
  if (storageError) return { success: false, message: storageError.message };

  // Delete user from custom Users table
  const { error: userTableError } = await supabase
    .from("Users")
    .delete()
    .eq("id", userId);
  if (userTableError)
    return { success: false, message: userTableError.message };

  return { success: true };
}
