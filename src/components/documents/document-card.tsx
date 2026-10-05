// src/components/documents/document-card.tsx
"use client";

import { motion } from "motion/react";
import { FileText, Eye, Trash2, Printer, Share2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Document } from "@/types/database";
import { cn } from "@/lib/utils";

interface Props {
  doc: Document;
  index: number;
  onOpen: (doc: Document) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string, shared: boolean) => void;
  onPrint: (doc: Document) => void;
}

export function DocumentCard({ doc, index, onOpen, onDelete, onToggleShare, onPrint }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.25, delay: index * 0.05 },
        y: { duration: 0.25, delay: index * 0.05 },
      }}
      className="motion-reduce:animate-none motion-reduce:transition-none"
    >
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                <Badge
                  variant={doc.shared_with_teacher ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {doc.shared_with_teacher ? "Ochiq" : "Yopiq"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {new Date(doc.updated_at).toLocaleDateString("uz-UZ", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpen(doc)}
                  className="gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Ko'rish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPrint(doc)}
                  className="gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Chop etish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleShare(doc.id, !doc.shared_with_teacher)}
                  className={cn("gap-1.5", doc.shared_with_teacher && "text-primary")}
                >
                  {doc.shared_with_teacher ? (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Yopish
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" /> O'qituvchiga ochish
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(doc.id)}
                  className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" /> O'chirish
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}