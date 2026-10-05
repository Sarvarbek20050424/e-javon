import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { AdminDocsClient } from "@/components/admin/admin-docs";

export default async function AdminHujjatlarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name, role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { data: docsRaw } = await supabase
    .from("documents")
    .select("*, profiles(full_name)")
    .order("updated_at", { ascending: false });
  const docs = (docsRaw ?? []) as any[];

  return (
    <AppShell
      role="admin"
      user={{ name: profile?.full_name ?? "Admin", sub: "Administrator" }}
      title="Hujjatlar"
      subtitle={`Jami ${docs.length} ta hujjat`}
    >
      <AdminDocsClient docs={docs} />
    </AppShell>
  );
}
