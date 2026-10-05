// src/lib/doc-status.ts
import type { Document } from "@/types/database";

export function chipFor(
  doc: Pick<Document, "status" | "shared_with_teacher">
): { tone: "open" | "pending" | "closed"; label: string } {
  if (doc.status === "approved") return { tone: "open", label: "Tasdiqlangan" };
  if (doc.status === "submitted" || doc.status === "in_review")
    return { tone: "pending", label: "Kutilmoqda" };
  if (doc.status === "rejected") return { tone: "closed", label: "Qaytarilgan" };
  if (doc.shared_with_teacher) return { tone: "open", label: "Ochiq" };
  return { tone: "closed", label: "Faqat menga" };
}