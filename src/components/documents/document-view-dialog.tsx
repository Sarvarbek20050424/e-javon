"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentPreview } from "./document-preview";
import { DocumentActions } from "./document-actions";
import type { Document } from "@/types/database";

export function DocumentViewDialog({ doc, onClose }: { doc: Document | null; onClose: () => void }) {
  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-[860px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{doc?.title}</DialogTitle>
        </DialogHeader>
        {doc && <DocumentPreview html={doc.body} />}
        {doc && (
          <div className="flex justify-end gap-2 pt-2">
            <DocumentActions doc={doc} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
