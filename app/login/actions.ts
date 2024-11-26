"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(data: { email: string; password: string }) {
  const supabase = createClient();

  // Attempt to sign in with email and password
  const { error } = await (await supabase).auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message }; // Return the exact error message from Supabase
  }

  return { success: true };
}
