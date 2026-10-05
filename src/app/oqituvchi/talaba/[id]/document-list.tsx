// src/app/oqituvchi/talaba/[id]/document-list.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentViewDialog } from "@/components/documents/document-view-dialog";
import { FileText } from "lucide-react";
import type { Document } from "@/types/database";

export default function DocumentList({ documents }: { documents: Document[] }) {
  const [viewDoc, setViewDoc] = useState<Document | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ochiq hujjatlar ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.updated_at).toLocaleDateString("uz-UZ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Ochiq</Badge>
                    <Button variant="outline" size="sm" onClick={() => setViewDoc(doc)}>Ko'rish</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Ochiq hujjatlar yo'q</p>
            </div>
          )}
        </CardContent>
      </Card>
      <DocumentViewDialog doc={viewDoc} onClose={() => setViewDoc(null)} />
    </>
  );
}