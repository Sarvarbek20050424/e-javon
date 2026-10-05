// src/app/actions/profile.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Admin va o'qituvchi uchun: faqat ism
export async function updateFullName(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tizimga kirmagansiz" };

  const raw = formData.get("full_name") as string;
  if (!raw || raw.trim().length < 2) return { error: "Ism kamida 2 ta belgi" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: raw.trim(), updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// Talaba uchun: students jadvali maydonlari
const studentSchema = z.object({
  student_no: z.string().min(1, "Talaba ID shart"),
  birth_date: z.string().min(1, "Tug'ilgan sana shart"),
  passport: z.string().min(9, "Pasport 9 belgidan kam"),
  phone: z.string().min(9, "Telefon noto'g'ri"),
  address: z.string().min(5, "Manzil shart"),
  course: z.number().min(1).max(6),
});

export async function updateStudentProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tizimga kirmagansiz" };

  const parsed = studentSchema.safeParse({
    student_no: formData.get("student_no") as string,
    birth_date: formData.get("birth_date") as string,
    passport: formData.get("passport") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    course: parseInt(formData.get("course") as string),
  });
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { error } = await supabase
    .from("students")
    .upsert(
      { id: user.id, ...parsed.data, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) return { error: error.message };
  revalidatePath("/talaba/profil");
  revalidatePath("/talaba");
  return { success: true };
}