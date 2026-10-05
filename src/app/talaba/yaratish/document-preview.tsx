// src/app/talaba/yaratish/document-preview.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Template, StudentData } from "@/lib/templates";

interface Props {
  template: Template | null;
  studentData: StudentData;
  formValues: Record<string, string>;
}

export default function DocumentPreview({ template, studentData, formValues }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Oldindan ko'rish (A4)</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border bg-white p-8 min-h-[600px] font-serif text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-newsreader, serif)" }}
          dangerouslySetInnerHTML={{
            __html: template ? template.render(studentData, formValues) : "",
          }}
        />
      </CardContent>
    </Card>
  );
}