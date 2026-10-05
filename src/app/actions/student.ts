// src/app/actions/student.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { studentProfileSchema } from "@/lib/validations";

export async function updateStudentProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tizimga kirmagansiz" };

  const rawData = {
    student_no: formData.get("student_no") as string,
    birth_date: formData.get("birth_date") as string,
    passport: formData.get("passport") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
  };

  const validated = studentProfileSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { error } = await supabase
    .from("students")
    .upsert({
      id: user.id,
      ...validated.data,
    })
    .select();

  if (error) {
    return { error: "Ma'lumotlarni saqlashda xatolik: " + error.message };
  }

  revalidatePath("/talaba/profil");
  return { success: true };
}

export async function getStudentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("students")
    .select("*, groups(name, faculties(name))")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 = topilmadi (bu normal holat, hali to'ldirilmagan)
    console.error(error);
    return null;
  }
  return data;
}