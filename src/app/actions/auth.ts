// src/app/actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Noto'g'ri email formati"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Email yoki parol noto'g'ri. Iltimos, qaytadan urinib ko'ring." };
  }

  // Role ni tekshirib yo'naltirish
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "teacher") {
      redirect("/oqituvchi");
    }
    redirect("/talaba");
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/kirish");
}