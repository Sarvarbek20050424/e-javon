// src/hooks/use-documents.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Document } from "@/types/database";

export function useDocuments() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["documents", "mine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Document[];
    },
  });
}

export function useToggleShare() {
  const supabase = createClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, shared }: { id: string; shared: boolean }) => {
      const { error } = await supabase
        .from("documents")
        .update({ shared_with_teacher: shared, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useDeleteDocument() {
  const supabase = createClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}