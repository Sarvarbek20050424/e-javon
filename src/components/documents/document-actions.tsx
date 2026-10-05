"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import type { Document } from "@/types/database";

const PRINT_CSS = `
  @page { size: A4; margin: 18mm; }
  body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.9; font-size: 14px; color: #1C2333; }
  table { width: 100%; border-collapse: collapse; }
  td, th { border: 1px solid #E3DCC8; padding: 7px 12px; text-align: left; }
`;

const INLINE_TAGS = new Set(["strong", "b", "em", "i", "u", "span", "a", "br"]);

type Run = { text: string; bold?: boolean; italics?: boolean };
type Ctx = { alignment?: "center" | "right" | "left" };

function styleOf(el: Element) {
  return el.getAttribute("style") ?? "";
}

function fontSizeFrom(st: string): number {
  if (st.includes("font-size:22px")) return 18;
  if (st.includes("letter-spacing")) return 9;
  if (st.includes("font-size:13px")) return 11;
  if (st.includes("font-size:12px")) return 10;
  return 12;
}

function collectRuns(node: Node, out: Run[], style: { bold?: boolean; italics?: boolean }) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      const t = (child.textContent ?? "").replace(/\s+/g, " ");
      if (t) out.push({ text: t, ...style });
      return;
    }
    if (child.nodeType !== 1) return;
    const el = child as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === "br") {
      out.push({ text: "\n", ...style });
      return;
    }
    const st = styleOf(el);
    collectRuns(el, out, {
      bold:
        style.bold ||
        tag === "strong" ||
        tag === "b" ||
        st.includes("font-weight:600") ||
        st.includes("font-weight:700"),
      italics: style.italics || tag === "em" || tag === "i",
    });
  });
}

function hasBlockChild(el: Element) {
  return Array.from(el.children).some((c) => !INLINE_TAGS.has(c.tagName.toLowerCase()));
}

function walk(el: Element, ctx: Ctx, out: any[]) {
  const tag = el.tagName.toLowerCase();
  const st = styleOf(el);
  const nextCtx: Ctx = {
    alignment: st.includes("text-align:center")
      ? "center"
      : st.includes("text-align:right")
        ? "right"
        : ctx.alignment,
  };

  if (tag === "table") {
    const bodyRows: any[][] = [];
    el.querySelectorAll("tr").forEach((tr) => {
      const row: any[] = [];
      tr.querySelectorAll("td,th").forEach((td) =>
        row.push((td.textContent ?? "").replace(/\s+/g, " ").trim())
      );
      if (row.length) bodyRows.push(row);
    });
    if (bodyRows.length) {
      out.push({
        table: {
          body: bodyRows,
          widths: bodyRows[0].length === 2 ? ["38%", "62%"] : bodyRows[0].map(() => "*"),
        },
        layout: { defaultBorder: true, borderColor: "#E3DCC8" },
        margin: [0, 4, 0, 10],
        fontSize: 11,
      });
    }
    return;
  }

  if (st.includes("display:flex")) {
    const parts: string[] = [];
    Array.from(el.children).forEach((c) =>
      parts.push((c.textContent ?? "").replace(/\s+/g, " ").trim())
    );
    const text = parts.filter(Boolean).join("          ");
    if (text) out.push({ text, fontSize: 11, margin: [0, 10, 0, 0] });
    return;
  }

  if (!hasBlockChild(el)) {
    const runs: Run[] = [];
    collectRuns(el, runs, {
      bold: st.includes("font-weight:600") || st.includes("font-weight:700"),
    });
    if (!runs.length) return;
    runs[0].text = runs[0].text.replace(/^\s+/, "");
    runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/\s+$/, "");
    const filtered = runs.filter((r) => r.text.length);
    if (!filtered.length) return;
    const block: any = { text: filtered, fontSize: fontSizeFrom(st), margin: [0, 0, 0, 6] };
    if (nextCtx.alignment) block.alignment = nextCtx.alignment;
    out.push(block);
    return;
  }

  Array.from(el.children).forEach((child) => walk(child, nextCtx, out));
}

function htmlToPdfmakeContent(html: string): any[] {
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  const out: any[] = [];
  Array.from(wrap.children).forEach((child) => walk(child, {}, out));
  return out;
}

export function DocumentActions({ doc }: { doc: Document }) {
  const [busy, setBusy] = useState(false);

  async function downloadPdf() {
    setBusy(true);
    try {
      const pdfMakeMod: any = await import("pdfmake/build/pdfmake");
      const fontsMod: any = await import("pdfmake/build/vfs_fonts");
      const pdfMake = pdfMakeMod.default ?? pdfMakeMod;
      pdfMake.vfs = fontsMod.default?.vfs ?? fontsMod.vfs ?? pdfMake.vfs;

      const dd = {
        pageSize: "A4",
        pageMargins: [48, 48, 48, 48],
        defaultStyle: { fontSize: 12, lineHeight: 1.35, color: "#1C2333" },
        content: htmlToPdfmakeContent(doc.body),
      };

      pdfMake.createPdf(dd).download(`${doc.title.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF yuklab olindi");
    } catch (e: any) {
      toast.error("PDF xatosi: " + (e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  function printDoc() {
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) return;
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>${doc.title}</title>` +
      `<style>${PRINT_CSS}</style></head><body>${doc.body}</body></html>`
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={downloadPdf} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        PDF
      </Button>
      <Button variant="outline" size="sm" className="gap-2" onClick={printDoc}>
        <Printer className="h-4 w-4" /> Pechat
      </Button>
    </div>
  );
}
