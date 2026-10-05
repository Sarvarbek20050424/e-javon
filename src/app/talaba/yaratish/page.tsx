// src/app/talaba/yaratish/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import CreateForm from "./create-form";

export default async function YaratishPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();
  const { data: student } = await supabase
    .from("students").select("*, groups(name, faculties(name))").eq("id", user.id).single();

  const profileIncomplete = !student?.student_no;

  return (
    <AppShell
      role="student"
      user={{ name: profile?.full_name ?? "Talaba", sub: student?.groups?.name }}
      title="Hujjat yaratish"
      subtitle="Shablon tanlang, maydonlarni to'ldiring, javonga saqlang"
    >
      {profileIncomplete && (
        <FoldCard className="mb-6 border-gold bg-gold-bg p-4">
          <p className="text-[13px] text-gold-text">
            Profilingiz to'liq emas —{" "}
            <a href="/talaba/profil" className="font-semibold underline">profilni to'ldiring</a>,
            aks holda hujjat saqlanmaydi.
          </p>
        </FoldCard>
      )}

      <CreateForm
        profileIncomplete={profileIncomplete}
        studentData={{
          full_name: profile?.full_name ?? "Noma'lum",
          student_no: student?.student_no ?? "",
          birth_date: student?.birth_date ?? null,
          passport: student?.passport ?? null,
          phone: student?.phone ?? null,
          address: student?.address ?? null,
          course: student?.course ?? null,
          group_name: student?.groups?.name ?? "—",
          faculty_name: student?.groups?.faculties?.name ?? "—",
        }}
      />
    </AppShell>
  );
}   