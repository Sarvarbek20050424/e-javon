import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { StatusChip } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import { chipFor } from "@/lib/doc-status";
import { Plus, Archive } from "lucide-react";

export default async function TalabaHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  // ✅ CAST: Supabase nested select tipi noto'g'ri chiqadi
  const { data: studentRaw } = await supabase
    .from("students")
    .select("student_no, groups(name)")
    .eq("id", user.id)
    .maybeSingle();
  const student = studentRaw as any;

  const { data: docsRaw } = await supabase
    .from("documents").select("*").eq("student_id", user.id)
    .order("updated_at", { ascending: false });
  const docs = (docsRaw ?? []) as any[];

  const total = docs.length;
  const pending = docs.filter((d) => d.status === "submitted" || d.status === "in_review").length;
  const profilePct = student?.student_no ? 100 : 40;

  const stats = [
    { label: "Javondagi hujjatlar", value: String(total) },
    { label: "Kutilayotgan arizalar", value: String(pending) },
    { label: "Profil to'liqligi", value: `${profilePct}%` },
  ];

  return (
    <AppShell
      role="student"
      user={{ name: profile?.full_name ?? "Talaba", sub: student?.groups?.name ?? "Guruh yo'q" }}
      title={`Assalomu alaykum, ${profile?.full_name?.split(" ")[0] ?? "talaba"}`}
      subtitle="Bugun qaysi hujjatni tayyorlaymiz?"
      actions={
        <>
          <Link href="/talaba/yaratish">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Hujjat yaratish</Button>
          </Link>
          <Link href="/talaba/javon">
            <Button variant="outline" className="gap-2"><Archive className="h-4 w-4" /> Javon</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s, i) => (
          <FoldCard key={s.label} animate index={i} className="p-5">
            <p className="font-serif text-[34px] leading-none">{s.value}</p>
            <p className="mt-2 text-[13px] text-mtext">{s.label}</p>
          </FoldCard>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-serif text-[18px]">So'nggi hujjatlar</h2>
        <FoldCard>
          {total === 0 ? (
            <p className="p-8 text-center text-[14px] text-mtext">
              Hali hujjat yo'q — birinchi varaqni yarating.
            </p>
          ) : (
            <ul>
              {docs.slice(0, 5).map((d, i) => {
                const chip = chipFor(d);
                return (
                  <li key={d.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-line-soft" : ""}`}>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium">{d.title}</p>
                      <p className="text-[12px] text-mtext">{new Date(d.updated_at).toLocaleDateString("uz-UZ")}</p>
                    </div>
                    <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
                  </li>
                );
              })}
            </ul>
          )}
        </FoldCard>
      </section>
    </AppShell>
  );
}
