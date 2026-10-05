// src/app/actions/admin.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Tizimga kirmagansiz");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Admin huquqi yo'q");
  return { userId: user.id };
}

const createTeacherSchema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(6, "Parol kamida 6 ta belgi"),
  full_name: z.string().min(2, "Ism kamida 2 ta belgi"),
});

export async function createTeacher(formData: FormData) {
  try {
    await checkAdmin();
    const validated = createTeacherSchema.safeParse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      full_name: formData.get("full_name") as string,
    });
    if (!validated.success) return { error: validated.error.errors[0].message };

    const admin = createAdminClient();
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: validated.data.email,
      password: validated.data.password,
      email_confirm: true,
      user_metadata: { full_name: validated.data.full_name, role: "teacher" },
    });
    if (authError) return { error: authError.message };

    // UPSERT — trigger avtomatik yaratgan profilni yangilaydi
    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        { id: authData.user.id, role: "teacher", full_name: validated.data.full_name },
        { onConflict: "id" }
      );
    if (profileError) return { error: profileError.message };

    revalidatePath("/admin/oqituvchilar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

const createStudentSchema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(6, "Parol kamida 6 ta belgi"),
  full_name: z.string().min(2, "Ism kamida 2 ta belgi"),
  student_no: z.string().min(1, "Talaba ID shart"),
  course: z.number().min(1).max(6),
  group_id: z.string().uuid("Guruh tanlang"),
});

export async function createStudent(formData: FormData) {
  try {
    await checkAdmin();
    const validated = createStudentSchema.safeParse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      full_name: formData.get("full_name") as string,
      student_no: formData.get("student_no") as string,
      course: parseInt(formData.get("course") as string),
      group_id: formData.get("group_id") as string,
    });
    if (!validated.success) return { error: validated.error.errors[0].message };

    const admin = createAdminClient();
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: validated.data.email,
      password: validated.data.password,
      email_confirm: true,
      user_metadata: { full_name: validated.data.full_name, role: "student" },
    });
    if (authError) return { error: authError.message };

    // UPSERT — trigger profilni yaratgan bo'lsa, bu yangilaydi
    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        { id: authData.user.id, role: "student", full_name: validated.data.full_name },
        { onConflict: "id" }
      );
    if (profileError) return { error: profileError.message };

    // students jadvaliga yozish
    const { error: studentError } = await admin
      .from("students")
      .upsert(
        {
          id: authData.user.id,
          student_no: validated.data.student_no,
          course: validated.data.course,
          group_id: validated.data.group_id,
        },
        { onConflict: "id" }
      );
    if (studentError) return { error: studentError.message };

    revalidatePath("/admin/talabalar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function assignTeacherToGroup(formData: FormData) {
  try {
    await checkAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("teacher_groups")
      .upsert(
        {
          teacher_id: formData.get("teacher_id") as string,
          group_id: formData.get("group_id") as string,
        },
        { onConflict: "teacher_id,group_id" }
      );
    if (error) return { error: error.message };
    revalidatePath("/admin/oqituvchilar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function assignStudentToGroup(formData: FormData) {
  try {
    await checkAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("students")
      .update({ group_id: formData.get("group_id") as string })
      .eq("id", formData.get("student_id") as string);
    if (error) return { error: error.message };
    revalidatePath("/admin/talabalar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createGroup(formData: FormData) {
  try {
    await checkAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("groups").insert({
      name: formData.get("name") as string,
      faculty_id: formData.get("faculty_id") as string,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin/guruhlar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createFaculty(formData: FormData) {
  try {
    await checkAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("faculties").insert({
      name: formData.get("name") as string,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin/fakultetlar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTeacher(teacher_id: string) {
  try {
    await checkAdmin();
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(teacher_id);
    if (error) return { error: error.message };
    revalidatePath("/admin/oqituvchilar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteStudent(student_id: string) {
  try {
    await checkAdmin();
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(student_id);
    if (error) return { error: error.message };
    revalidatePath("/admin/talabalar");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}