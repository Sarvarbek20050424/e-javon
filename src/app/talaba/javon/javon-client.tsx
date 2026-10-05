// src/app/talaba/javon/javon-client.tsx
"use client";

import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { FoldCard } from "@/components/ui/fold-card";
import { StatusChip } from "@/components/ui/status-chip";
import { DocumentActions } from "@/components/documents/document-actions";
import { DocumentSpine, DocumentSpineEmpty } from "@/components/documents/document-spine";
import { DocumentViewDialog } from "@/components/documents/document-view-dialog";
import { useDocuments, useDeleteDocument } from "@/hooks/use-documents";
import { chipFor } from "@/lib/doc-status";
import type { Document } from "@/types/database";

const qc = new QueryClient();

export default function JavonClient() {
  return (
    <QueryClientProvider client={qc}>
      <Content />
    </QueryClientProvider>
  );
}

function Content() {
  const { data: docs, isLoading } = useDocuments();
  const deleteDoc = useDeleteDocument();
  const [view, setView] = useState<Document | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, Document[]> = {};
    for (const d of docs ?? []) (map[d.category] ??= []).push(d);
    return map;
  }, [docs]);

  async function handleDelete(id: string) {
    if (!window.confirm("Hujjatni o'chirasizmi?")) return;
    try {
      await deleteDoc.mutateAsync(id);
      toast.success("Hujjat o'chirildi");
    } catch {
      toast.error("O'chirib bo'lmadi");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-[4px] bg-line-soft" />
        ))}
      </div>
    );
  }

  const isEmpty = !docs || docs.length === 0;

  return (
    <div className="space-y-8">
      {isEmpty ? (
        <FoldCard className="p-12 text-center">
          <p className="font-serif text-[20px]">Javoningiz bo'sh</p>
          <p className="mt-2 text-[14px] text-mtext">Birinchi varaqni yarating — u shu yerda saqlanadi.</p>
          <Link href="/talaba/yaratish" className="mt-5 inline-block text-[14px] font-medium text-teal hover:underline">
            Hujjat yaratish →
          </Link>
        </FoldCard>
      ) : (
        <>
          {/* Toifalar bo'yicha spine qatorlari */}
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-3 font-serif text-[18px]">{category}</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {items.map((d) => (
                  <DocumentSpine
                    key={d.id}
                    category={d.template_slug}
                    title={d.title}
                    meta={new Date(d.updated_at).toLocaleDateString("uz-UZ")}
                    onClick={() => setView(d)}
                  />
                ))}
                <Link href="/talaba/yaratish" className="shrink-0">
                  <DocumentSpineEmpty />
                </Link>
              </div>
            </section>
          ))}

          {/* Batafsil jadval */}
          <FoldCard>
            <ul>
              {(docs ?? []).map((d, i) => {
                const chip = chipFor(d);
                return (
                  <li
                    key={d.id}
                    className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${i > 0 ? "border-t border-line-soft" : ""}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium">{d.title}</p>
                      <p className="text-[12px] text-mtext">
                        {new Date(d.updated_at).toLocaleDateString("uz-UZ")} · {d.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
                      <button className="text-[13px] text-teal hover:underline" onClick={() => setView(d)}>
                        Ko'rish
                      </button>
                      <button className="text-[13px] text-red hover:underline" onClick={() => handleDelete(d.id)}>
                        O'chirish
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </FoldCard>
        </>
      )}

      <DocumentViewDialog doc={view} onClose={() => setView(null)} />
    </div>
  );
}