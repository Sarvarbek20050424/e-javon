// src/app/admin/fakultetlar/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FoldCard } from "@/components/ui/fold-card";
import { Input } from "@/components/ui/input";
import { ActionForm } from "@/components/admin/action-form";
import { createFaculty } from "@/app/actions/admin";
import { Building2 } from "lucide-react";

export default async function FakultetlarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const { data: faculties } = await supabase
    .from("faculties").select("*").order("name");

  return (
    <AppShell
      role="admin"
      user={{ name: profile?.full_name ?? "Admin", sub: "Administrator" }}
      title="Fakultetlar"
      subtitle={`${faculties?.length ?? 0} ta fakultet`}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FoldCard className="p-6">
          <h2 className="mb-4 font-serif text-[18px] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal" /> Yangi fakultet
          </h2>
          <ActionForm
            action={createFaculty}
            successMessage="Fakultet yaratildi"
            className="flex gap-2"
            showSubmit
            submitLabel="Yaratish"
          >
            <Input name="name" placeholder="Fakultet nomi" required className="flex-1" />
          </ActionForm>
        </FoldCard>

        <FoldCard>
          <div className="flex items-center justify-between px-5 py-4 border-b border-line-soft">
            <h2 className="font-serif text-[18px]">Ro'yxat</h2>
            <span className="text-[12px] text-mtext">{faculties?.length ?? 0} ta</span>
          </div>
          {faculties && faculties.length > 0 ? (
            <ul>
              {faculties.map((f: any, i) => (
                <li key={f.id} className={`px-5 py-4 ${i > 0 ? "border-t border-line-soft" : ""}`}>
                  <p className="text-[14px] font-medium">{f.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-[14px] text-mtext">Hali fakultet yo'q</p>
          )}
        </FoldCard>
      </div>
    </AppShell>
  );
}
