// src/app/oqituvchi/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { GroupWorkspace } from "@/components/teacher/group-workspace";

export default async function OqituvchiHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();
  const { data: tg } = await supabase
    .from("teacher_groups")
    .select("group_id, groups(id, name, faculties(name))")
    .eq("teacher_id", user.id);

  const groups = (tg?.map((r: any) => r.groups).filter(Boolean) ?? []) as {
    id: string; name: string; faculties?: { name: string } | null;
  }[];

  return (
    <AppShell
      role="teacher"
      user={{ name: profile?.full_name ?? "O'qituvchi", sub: "O'qituvchi" }}
      title="Guruhlarim"
      subtitle="Guruhni tanlang va talabalar bilan ishlang"
    >
      {groups.length === 0 ? (
        <FoldCard className="p-12 text-center">
          <p className="font-serif text-[20px]">Guruhlar yo'q</p>
          <p className="mt-2 text-[14px] text-mtext">
            Sizga hali guruh biriktirilmagan — administratorga murojaat qiling.
          </p>
        </FoldCard>
      ) : (
        <GroupWorkspace groups={groups} initialId={groups[0].id} />
      )}
    </AppShell>
  );
}