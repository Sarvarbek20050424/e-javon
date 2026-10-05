// src/app/oqituvchi/talaba/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import DocumentList from "./document-list";

export default async function TalabaPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/kirish");

  // students_public view — pasport, birth_date, address yo'q
  const { data: student } = await supabase
    .from("students_public")
    .select("*, groups(name, faculties(name))")
    .eq("id", params.id)
    .single();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("student_id", params.id)
    .eq("shared_with_teacher", true)
    .order("updated_at", { ascending: false });

  if (!student) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-destructive">Talaba topilmadi</h1>
          <p className="text-muted-foreground mt-2">Siz bu talabaning ma'lumotlarini ko'rish huquqiga ega emassiz.</p>
          <Link href="/oqituvchi"><Button className="mt-6">Ortga qaytish</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/oqituvchi/guruh/${student.group_id}`}>
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Talaba kartasi</h1>
            <p className="text-muted-foreground">{student.groups?.name} • {student.groups?.faculties?.name}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Talaba ID</p>
              <p className="font-mono font-semibold">{student.student_no}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kurs</p>
              <p className="font-semibold">{student.course}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefon</p>
              <p className="font-semibold">{student.phone || "—"}</p>
            </div>
          </CardContent>
        </Card>

        <DocumentList documents={documents ?? []} />
      </div>
    </main>
  );
}