// src/app/admin/guruhlar/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionForm } from "@/components/admin/action-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createGroup, deleteTeacher } from "@/app/actions/admin";
import { Plus, Users } from "lucide-react";

export default async function GuruhlarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const { data: groups } = await supabase
    .from("groups").select("*, faculties(name), students(count)").order("name");

  const { data: faculties } = await supabase
    .from("faculties").select("id, name").order("name");

  return (
    <AppShell
      role="admin"
      user={{ name: profile?.full_name ?? "Admin", sub: "Administrator" }}
      title="Guruhlar"
      subtitle={`${groups?.length ?? 0} ta guruh`}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FoldCard className="p-6">
          <h2 className="mb-4 font-serif text-[18px] flex items-center gap-2">
            <Plus className="h-4 w-4 text-teal" /> Yangi guruh
          </h2>
          <ActionForm
            action={createGroup}
            successMessage="Guruh yaratildi"
            className="grid gap-4"
            showSubmit
            submitLabel="Yaratish"
          >
            <div className="space-y-1.5">
              <Label className="text-[13px]">Guruh nomi</Label>
              <Input name="name" placeholder="221-20" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Fakultet</Label>
              <Select name="faculty_id" required>
                <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                <SelectContent>
                  {faculties?.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ActionForm>
        </FoldCard>

        <FoldCard>
          <div className="flex items-center justify-between px-5 py-4 border-b border-line-soft">
            <h2 className="font-serif text-[18px]">Ro'yxat</h2>
            <span className="text-[12px] text-mtext">{groups?.length ?? 0} ta</span>
          </div>
          {groups && groups.length > 0 ? (
            <ul>
              {groups.map((g: any, i) => (
                <li key={g.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-line-soft" : ""}`}>
                  <div>
                    <p className="text-[14px] font-medium">{g.name}</p>
                    <p className="text-[12px] text-mtext">{g.faculties?.name ?? "вЂ”"}</p>
                  </div>
                  <Users className="h-4 w-4 text-mtext2" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-[14px] text-mtext">Hali guruh yo'q</p>
          )}
        </FoldCard>
      </div>
    </AppShell>
  );
}
