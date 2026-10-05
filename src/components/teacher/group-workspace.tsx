// src/components/teacher/group-workspace.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TabPillGroup } from "@/components/ui/tab-pill";
import { FoldCard } from "@/components/ui/fold-card";
import { DocumentViewDialog } from "@/components/documents/document-view-dialog";
import type { Document } from "@/types/database";

type Group = { id: string; name: string; faculties?: { name: string } | null };

export function GroupWorkspace({ groups, initialId }: { groups: Group[]; initialId: string }) {
  const [groupId, setGroupId] = useState(initialId);
  const [students, setStudents] = useState<any[]>([]);
  const [docCounts, setDocCounts] = useState<Record<string, number>>({});
  const [docsByStudent, setDocsByStudent] = useState<Record<string, Document[]>>({});
  const [selected, setSelected] = useState<any | null>(null);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setSelected(null);
    (async () => {
      const { data: studs } = await supabase
        .from("students_public")
        .select("*")
        .eq("group_id", groupId);
      const ids = (studs ?? []).map((s: any) => s.id);
      const counts: Record<string, number> = {};
      const byStudent: Record<string, Document[]> = {};
      if (ids.length) {
        const { data: docs } = await supabase
          .from("documents")
          .select("*")
          .eq("shared_with_teacher", true)
          .in("student_id", ids)
          .order("updated_at", { ascending: false });
        for (const d of docs ?? []) {
          counts[d.student_id] = (counts[d.student_id] ?? 0) + 1;
          (byStudent[d.student_id] ??= []).push(d as Document);
        }
      }
      if (!alive) return;
      setStudents(studs ?? []);
      setDocCounts(counts);
      setDocsByStudent(byStudent);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [groupId]);

  function selectGroup(id: string) {
    setGroupId(id);
    router.push(`/oqituvchi/guruh/${id}`);
  }

  const group = groups.find((g) => g.id === groupId);

  return (
    <div className="space-y-6">
      <TabPillGroup
        items={groups.map((g) => ({ value: g.id, label: g.name }))}
        value={groupId}
        onChange={selectGroup}
      />

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        {/* Talabalar jadvali */}
        <FoldCard>
          <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
            <h2 className="font-serif text-[18px]">{group?.name} — talabalar</h2>
            <span className="text-[12px] text-mtext">{students.length} ta</span>
          </div>
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-[4px] bg-line-soft" />
              ))}
            </div>
          ) : students.length === 0 ? (
            <p className="p-8 text-center text-[14px] text-mtext">Bu guruhda talabalar yo'q</p>
          ) : (
            <ul>
              {students.map((s, i) => (
                <li
                  key={s.id}
                  className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-line-soft" : ""}`}
                >
                  <div>
                    <p className="text-[14px] font-medium">{s.full_name ?? "—"}</p>
                    <p className="text-[12px] text-mtext">
                      ID: {s.student_no} · {s.course}-kurs · ochiq hujjat: {docCounts[s.id] ?? 0}
                    </p>
                  </div>
                  <button className="text-[13px] text-teal hover:underline" onClick={() => setSelected(s)}>
                    Ochish →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FoldCard>

        {/* Tanlangan talaba kartasi */}
        <div>
          {selected ? (
            <FoldCard className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy2 text-[13px] font-semibold text-white">
                  {(selected.full_name ?? "?")
                    .split(" ")
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-[17px] leading-tight">{selected.full_name}</h3>
                  <p className="text-[12px] text-mtext">
                    {group?.name} · {selected.course}-kurs
                  </p>
                </div>
              </div>

              <dl className="space-y-1.5 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-mtext">Talaba ID</dt>
                  <dd className="font-mono">{selected.student_no}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-mtext">Telefon</dt>
                  <dd>{selected.phone ?? "—"}</dd>
                </div>
              </dl>

              <p className="rounded-[4px] bg-line-soft px-3 py-2 text-[11px] text-mtext2">
                Pasport va manzil ko'rinmaydi — faqat ochiq hujjatlar.
              </p>

              <div>
                <h4 className="mb-2 text-[12px] font-medium text-mtext">Ochiq hujjatlar</h4>
                {(docsByStudent[selected.id] ?? []).length === 0 ? (
                  <p className="text-[13px] text-mtext2">Hozircha ochiq hujjat yo'q</p>
                ) : (
                  <ul className="space-y-2">
                    {(docsByStudent[selected.id] ?? []).map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px]">{d.title}</span>
                        <button className="shrink-0 text-[12px] text-teal hover:underline" onClick={() => setViewDoc(d)}>
                          Ko'rish
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FoldCard>
          ) : (
            <FoldCard className="p-8 text-center">
              <p className="text-[14px] text-mtext">
                Talabani tanlang — ma'lumotlari shu yerda ko'rinadi
              </p>
            </FoldCard>
          )}
        </div>
      </div>

      <DocumentViewDialog doc={viewDoc} onClose={() => setViewDoc(null)} />
    </div>
  );
}