// src/app/talaba/profil/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { StudentForm } from "@/components/profile/student-form";

export default async function TalabaProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const { data: studentRaw } = await supabase
    .from("students")
    .select("*, groups(name, faculties(name))")
    .eq("id", user.id)
    .maybeSingle();
  const student = studentRaw as any;

  return (
    <AppShell
      role="student"
      user={{ name: profile?.full_name ?? "Talaba", sub: student?.groups?.name }}
      title="Shaxsiy profil"
      subtitle="Ma'lumotlaringizni to'ldiring yoki yangilang"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <FoldCard className="p-6">
          <h2 className="mb-4 font-serif text-[18px]">Talaba ma'lumotlari</h2>
          <StudentForm initial={student} />
        </FoldCard>

        <FoldCard className="h-fit p-6">
          <h2 className="mb-4 font-serif text-[18px]">Guruh</h2>
          <dl className="space-y-3 text-[14px]">
            <div>
              <dt className="text-[12px] text-mtext">Guruh</dt>
              <dd className="font-medium">{student?.groups?.name ?? "Biriktirilmagan"}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-mtext">Fakultet</dt>
              <dd className="font-medium">{student?.groups?.faculties?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-mtext">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-[4px] bg-line-soft px-3 py-2 text-[11px] text-mtext2">
            Guruh va emailni o'zgartirib bo'lmaydi — administratorga murojaat qiling.
          </p>
        </FoldCard>
      </div>
    </AppShell>
  );
}