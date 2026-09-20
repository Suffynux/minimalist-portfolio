"use server";

import "server-only";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  status: "idle" | "code-sent" | "error";
  message?: string;
  email?: string;
};

const emailSchema = z.string().trim().toLowerCase().email();
const codeSchema = z.string().trim().regex(/^\d{6}$/, "That code should be six digits.");

/**
 * Sends a one-time code.
 *
 * `shouldCreateUser: false` matters: without it, anyone who guesses the login
 * URL can create an account on your Supabase project just by typing an email.
 * The admin user is created once, deliberately, by the setup script.
 *
 * The response is identical whether or not the address is the admin's, so this
 * form cannot be used to discover which email owns the site.
 */
export async function sendCode(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return { status: "error", message: "That doesn't look like an email address." };
  }

  const supabase = await createClient();
  await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { shouldCreateUser: false }
  });

  return {
    status: "code-sent",
    email: parsed.data,
    message: "If that address can sign in, a six-digit code is on its way."
  };
}

export async function verifyCode(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const code = codeSchema.safeParse(formData.get("code"));

  if (!email.success || !code.success) {
    return {
      status: "error",
      email: email.success ? email.data : undefined,
      message: code.success ? "Something went wrong. Start again." : code.error.issues[0].message
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: email.data,
    token: code.data,
    type: "email"
  });

  if (error) {
    return {
      status: "error",
      email: email.data,
      message: "That code didn't work. It may have expired - request a new one."
    };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
