"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const username = formData.get("username") as string;

  if (!email || !password || !confirmPassword || !username) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = createClient();

  // Create the user in Supabase Auth
  const createResult = await (await supabase).auth.signUp({
    email,
    password,
  });

  if (createResult.error) {
    console.error("Auth creation error:", createResult.error.message);
    return { error: createResult.error.message };
  }

  const userId = createResult.data.user?.id;

  if (!userId) {
    console.error("Failed to retrieve user ID after signup");
    return { error: "Failed to retrieve user ID after signup." };
  }

  // Insert additional user data into the `user` table
  const { error: dbError } = await (await supabase).from("user").insert({
    id: userId, // Use the UUID from Supabase Auth
    username, // Save the username to the username column
  });

  if (dbError) {
    console.error("Database insert error:", dbError.message);
    return { error: dbError.message };
  }

  // Automatically sign in the user after successful signup
  const { error: loginError } = await (await supabase).auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error("Login error after signup:", loginError.message);
    return { error: loginError.message };
  }

  return { success: true };
}
