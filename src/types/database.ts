// src/types/database.ts
export type UserRole = "student" | "teacher" | "admin";
export type DocStatus = "draft" | "submitted" | "in_review" | "approved" | "rejected";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  created_at: string;
}

export interface Document {
  id: string;
  student_id: string;
  template_slug: string;
  title: string;
  category: string;
  body: string;
  form_data: Record<string, string> | null;
  status: DocStatus;
  shared_with_teacher: boolean;
  created_at: string;
  updated_at: string;
}