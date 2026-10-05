// src/hooks/use-teacher.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useTeacherGroups() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["teacher", "groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_groups")
        .select("group_id, groups(id, name, faculties(name))")
        .order("groups(name)");
      if (error) throw error;
      return data?.map((tg: any) => tg.groups) ?? [];
    },
  });
}

export function useGroupStudents(groupId: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["group", "students", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students_public")
        .select("*")
        .eq("group_id", groupId);
      if (error) throw error;
      return (data ?? []) as any[];
    },
    enabled: !!groupId,
  });
}

export function useStudentDocuments(studentId: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["student", "documents", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("student_id", studentId)
        .eq("shared_with_teacher", true)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
    enabled: !!studentId,
  });
}