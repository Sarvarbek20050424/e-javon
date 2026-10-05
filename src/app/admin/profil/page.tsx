// src/app/admin/profil/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { NameForm } from "@/components/profile/name-form";

export default async function AdminProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name, role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <AppShell
      role="admin"
      user={{ name: profile?.full_name ?? "Admin", sub: "Administrator" }}
      title="Shaxsiy profil"
      subtitle="Administrator ma'lumotlari"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <FoldCard className="p-6">
          <h2 className="mb-4 font-serif text-[18px]">To'liq ism</h2>
          <NameForm initialName={profile?.full_name ?? ""} />
        </FoldCard>
        <FoldCard className="h-fit p-6">
          <dl className="space-y-3 text-[14px]">
            <div><dt className="text-[12px] text-mtext">Rol</dt><dd className="font-medium">Administrator</dd></div>
            <div><dt className="text-[12px] text-mtext">Email</dt><dd className="font-medium">{user.email}</dd></div>
          </dl>
          <p className="mt-4 rounded-[4px] bg-line-soft px-3 py-2 text-[11px] text-mtext2">
            Rol va email o'zgartirilmaydi.
          </p>
        </FoldCard>
      </div>
    </AppShell>
  );
}