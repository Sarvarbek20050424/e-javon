// src/app/actions/document.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveDocument(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Tizimga kirmagansiz" };
  }

  // Profil to'ldirilganligini tekshirish
  const { data: student } = await supabase
    .from("students")
    .select("student_no")
    .eq("id", user.id)
    .single();

  if (!student) {
    redirect("/talaba/profil?error=profile_required");
  }

  const templateSlug = formData.get("template_slug") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const body = formData.get("body") as string;
  const formDataJson = formData.get("form_data") as string;
  const shared = formData.get("shared_with_teacher") === "on";

  if (!templateSlug || !title || !body) {
    return { error: "Barcha maydonlar to'ldirilishi shart" };
  }

  const { error } = await supabase.from("documents").insert({
    student_id: user.id,
    template_slug: templateSlug,
    title,
    category,
    body,
    form_data: formDataJson ? JSON.parse(formDataJson) : null,
    shared_with_teacher: shared,
  });

  if (error) {
    return { error: "Hujjatni saqlashda xatolik: " + error.message };
  }

  revalidatePath("/talaba/javon");
  return { success: true };
}