"use client";

import { useState } from "react";
import { FoldCard } from "@/components/ui/fold-card";
import { StatusChip } from "@/components/ui/status-chip";
import { chipFor } from "@/lib/doc-status";
import { DocumentViewDialog } from "@/components/documents/document-view-dialog";
import type { Document } from "@/types/database";

export function AdminDocsClient({ docs }: { docs: any[] }) {
  const [view, setView] = useState<Document | null>(null);

  return (
    <>
      <FoldCard>
        {docs.length === 0 ? (
          <p className="p-8 text-center text-[14px] text-mtext">Hali hujjatlar yo'q</p>
        ) : (
          <ul>
            {docs.map((d, i) => {
              const chip = chipFor(d);
              return (
                <li key={d.id} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${i > 0 ? "border-t border-line-soft" : ""}`}>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium">{d.title}</p>
                    <p className="text-[12px] text-mtext">
                      {d.profiles?.full_name ?? "—"} · {new Date(d.updated_at).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
                    <button className="text-[13px] text-teal hover:underline" onClick={() => setView(d)}>
                      Ko'rish / PDF / Pechat
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </FoldCard>
      <DocumentViewDialog doc={view} onClose={() => setView(null)} />
    </>
  );
}
