"use server";

import { createClient } from "../server";
import path from "path";
import fs from "fs";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const balance = 10; // starting coins (default value)

  // Step 1: Sign up user and add public metadata
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: username,
      },
    },
  });

  if (signUpError) {
    return { success: false, message: signUpError.message };
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    return { success: false, message: "User ID not returned." };
  }

  // Step 2: Upload default profile image
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/images/user-profile.png`;
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  const fileName = `${userId}-default-user-image.png`;

  const { error: uploadError } = await supabase.storage
    .from("user-profile-pictures")
    .upload(fileName, buffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  const profile_image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-profile-pictures/${fileName}`;

  // Step 3: Insert into your custom Users table
  const { error: insertError } = await supabase.from("Users").insert([
    {
      id: userId,
      profile_image_url,
      balance,
    },
  ]);

  if (insertError) {
    return { success: false, message: insertError.message };
  }

  return { success: true };
}
