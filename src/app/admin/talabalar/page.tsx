// src/app/admin/talabalar/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionForm } from "@/components/admin/action-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStudent, assignStudentToGroup } from "@/app/actions/admin";
import { BookOpen } from "lucide-react";

export default async function TalabalarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const { data: studentsRaw } = await supabase
    .from("students")
    .select("id, student_no, course, group_id, groups(name), profiles(full_name)")
    .order("created_at", { ascending: false });
  const students = (studentsRaw ?? []) as any[];

  const { data: groups } = await supabase.from("groups").select("id, name").order("name");

  return (
    <AppShell
      role="admin"
      user={{ name: profile?.full_name ?? "Admin", sub: "Administrator" }}
      title="Talabalar"
      subtitle={`${students.length} ta talaba`}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <FoldCard className="p-6">
          <h2 className="mb-4 font-serif text-[18px] flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-teal" /> Yangi talaba
          </h2>
          <ActionForm
            action={createStudent}
            successMessage="Talaba yaratildi"
            className="grid gap-3 sm:grid-cols-2"
            showSubmit
            submitLabel="Yaratish"
          >
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[13px]">Email</Label>
              <Input name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Parol</Label>
              <Input name="password" type="password" required minLength={6} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">To'liq ism</Label>
              <Input name="full_name" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Talaba ID</Label>
              <Input name="student_no" placeholder="22120001" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Kurs</Label>
              <Select name="course" required>
                <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(c => (
                    <SelectItem key={c} value={String(c)}>{c}-kurs</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[13px]">Guruh</Label>
              <Select name="group_id" required>
                <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                <SelectContent>
                  {groups?.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ActionForm>
        </FoldCard>

        <FoldCard className="p-6">
          <h2 className="mb-4 font-serif text-[18px]">Guruhga ko'chirish</h2>
          <ActionForm
            action={assignStudentToGroup}
            successMessage="Talaba ko'chirildi"
            className="grid gap-3"
            showSubmit
            submitLabel="Ko'chirish"
          >
            <div className="space-y-1.5">
              <Label className="text-[13px]">Talaba</Label>
              <Select name="student_id" required>
                <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                <SelectContent>
                  {students.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.profiles?.full_name ?? "вЂ”"} ({s.student_no})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Yangi guruh</Label>
              <Select name="group_id" required>
                <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                <SelectContent>
                  {groups?.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ActionForm>
        </FoldCard>
      </div>

      <FoldCard className="mt-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line-soft">
          <h2 className="font-serif text-[18px]">Ro'yxat</h2>
          <span className="text-[12px] text-mtext">{students.length} ta</span>
        </div>
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line-soft text-left text-[12px] text-mtext">
                  <th className="py-3 px-5 font-medium">Ism</th>
                  <th className="py-3 px-5 font-medium">Talaba ID</th>
                  <th className="py-3 px-5 font-medium">Guruh</th>
                  <th className="py-3 px-5 font-medium">Kurs</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => (
                  <tr key={s.id} className="border-b border-line-soft last:border-0">
                    <td className="py-3 px-5 text-[14px] font-medium">{s.profiles?.full_name ?? "вЂ”"}</td>
                    <td className="py-3 px-5 font-mono text-[13px]">{s.student_no}</td>
                    <td className="py-3 px-5 text-[14px]">{s.groups?.name ?? "вЂ”"}</td>
                    <td className="py-3 px-5 text-[14px]">{s.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-[14px] text-mtext">Hali talaba yo'q</p>
        )}
      </FoldCard>
    </AppShell>
  );
}
