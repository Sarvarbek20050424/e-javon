// src/app/actions/teacher.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { teacherProfileSchema } from "@/lib/validations";

export async function updateTeacherProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tizimga kirmagansiz" };

  const rawData = {
    full_name: formData.get("full_name") as string,
  };

  const validated = teacherProfileSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  // ✅ updated_at olib tashlandi (profiles jadvalida bunday ustun yo'q)
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: validated.data.full_name })
    .eq("id", user.id);

  if (error) {
    return { error: "Ma'lumotlarni saqlashda xatolik: " + error.message };
  }

  revalidatePath("/oqituvchi/profil");
  return { success: true };
}