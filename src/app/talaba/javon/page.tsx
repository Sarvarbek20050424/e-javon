import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import JavonClient from "./javon-client";

export default async function JavonPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  // ✅ CAST: Supabase nested select tipi noto'g'ri chiqadi
  const { data: studentRaw } = await supabase
    .from("students")
    .select("groups(name)")
    .eq("id", user.id)
    .maybeSingle();
  const student = studentRaw as any;

  return (
    <AppShell
      role="student"
      user={{ name: profile?.full_name ?? "Talaba", sub: student?.groups?.name }}
      title="Mening javonim"
      subtitle="Barcha saqlangan hujjatlaringiz"
    >
      <JavonClient />
    </AppShell>
  );
}
