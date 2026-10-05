// src/app/admin/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { GraduationCap, BookOpen, Users, Building2 } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const [
    { count: teacherCount },
    { count: studentCount },
    { count: groupCount },
    { count: facultyCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("groups").select("*", { count: "exact", head: true }),
    supabase.from("faculties").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "O'qituvchilar", value: teacherCount ?? 0, icon: GraduationCap, href: "/admin/oqituvchilar" },
    { label: "Talabalar", value: studentCount ?? 0, icon: BookOpen, href: "/admin/talabalar" },
    { label: "Guruhlar", value: groupCount ?? 0, icon: Users, href: "/admin/guruhlar" },
    { label: "Fakultetlar", value: facultyCount ?? 0, icon: Building2, href: "/admin/fakultetlar" },
  ];

  return (
    <AppShell
      role="admin"
      user={{ name: profile?.full_name ?? "Admin", sub: "Administrator" }}
      title="Admin boshqaruv paneli"
      subtitle="Tizim holati va tezkor statistika"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <Link key={s.label} href={s.href}>
            <FoldCard animate index={i} className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <p className="text-[13px] text-mtext">{s.label}</p>
                <s.icon className="h-4 w-4 text-mtext2" />
              </div>
              <p className="mt-2 font-serif text-[34px] leading-none">{s.value}</p>
            </FoldCard>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}