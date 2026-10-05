// src/app/oqituvchi/guruh/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { GroupWorkspace } from "@/components/teacher/group-workspace";

export default async function GuruhPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  // Ruxsat tekshiruvi
  const { data: allowed } = await supabase
    .from("teacher_groups")
    .select("teacher_id, group_id")
    .eq("teacher_id", user.id)
    .eq("group_id", id)
    .maybeSingle();

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
      {!allowed ? (
        <FoldCard className="p-12 text-center">
          <p className="font-serif text-[20px] text-red">Ruxsat yo'q</p>
          <p className="mt-2 text-[14px] text-mtext">Siz bu guruhga biriktirilmagansiz.</p>
          <Link href="/oqituvchi" className="mt-5 inline-block">
            <Button variant="outline">Ortga qaytish</Button>
          </Link>
        </FoldCard>
      ) : (
        <GroupWorkspace groups={groups} initialId={id} />
      )}
    </AppShell>
  );
}