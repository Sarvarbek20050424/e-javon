// src/components/documents/document-preview.tsx
import { cn } from "@/lib/utils";

export function DocumentPreview({ html, className }: { html: string; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span className="fold-corner" aria-hidden="true" />
      <div
        className="bg-white border border-line rounded-[4px] text-[#1C2333]"
        style={{
          padding: "46px 50px",
          boxShadow: "0 18px 40px rgba(28,35,51,.1)",
          fontFamily: "var(--font-newsreader), Georgia, serif",
          lineHeight: 1.9,
          fontSize: "14px",
          minHeight: "640px",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}