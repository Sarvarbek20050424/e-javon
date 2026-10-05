// src/app/admin/oqituvchilar/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionForm } from "@/components/admin/action-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTeacher, assignTeacherToGroup } from "@/app/actions/admin";
import { GraduationCap, Link2 } from "lucide-react";

export default async function OqituvchilarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const { data: teachers } = await supabase
    .from("profiles").select("id, full_name, created_at").eq("role", "teacher")
    .order("created_at", { ascending: false });

  const { data: groups } = await supabase.from("groups").select("id, name").order("name");

  return (
    <AppShell
      role="admin"
      user={{ name: profile?.full_name ?? "Admin", sub: "Administrator" }}
      title="O'qituvchilar"
      subtitle={`${teachers?.length ?? 0} ta o'qituvchi`}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FoldCard className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-[18px]">
            <GraduationCap className="h-4 w-4 text-teal" /> Yangi o'qituvchi
          </h2>
          <ActionForm action={createTeacher} successMessage="O'qituvchi yaratildi" className="grid gap-3" showSubmit submitLabel="Yaratish">
            <div className="space-y-1.5">
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
          </ActionForm>
        </FoldCard>

        <FoldCard className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-[18px]">
            <Link2 className="h-4 w-4 text-teal" /> Guruhga biriktirish
          </h2>
          <ActionForm action={assignTeacherToGroup} successMessage="Guruhga biriktirildi" className="grid gap-3" showSubmit submitLabel="Biriktirish">
            <div className="space-y-1.5">
              <Label className="text-[13px]">O'qituvchi</Label>
              <Select name="teacher_id" required>
                <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                <SelectContent>
                  {teachers?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Guruh</Label>
              <Select name="group_id" required>
                <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                <SelectContent>
                  {groups?.map((g: any) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ActionForm>
        </FoldCard>
      </div>

      <FoldCard className="mt-6">
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <h2 className="font-serif text-[18px]">Ro'yxat</h2>
          <span className="text-[12px] text-mtext">{teachers?.length ?? 0} ta</span>
        </div>
        {teachers && teachers.length > 0 ? (
          <ul>
            {teachers.map((t: any, i: number) => (
              <li key={t.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-line-soft" : ""}`}>
                <div>
                  <p className="text-[14px] font-medium">{t.full_name}</p>
                  <p className="text-[12px] text-mtext">{new Date(t.created_at).toLocaleDateString("uz-UZ")}</p>
                </div>
                <DeleteButton id={t.id} name={t.full_name} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-[14px] text-mtext">Hali o'qituvchi yo'q</p>
        )}
      </FoldCard>
    </AppShell>
  );
}
