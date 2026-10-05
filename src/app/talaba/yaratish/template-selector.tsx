// src/app/talaba/yaratish/template-selector.tsx
"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { TEMPLATES, type TemplateSlug } from "@/lib/templates";
import { FileText } from "lucide-react";

interface Props {
  onSelect: (slug: TemplateSlug) => void;
}

export default function TemplateSelector({ onSelect }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {TEMPLATES.map((t, i) => (
        <motion.button
          key={t.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(t.slug)}
          className="text-left"
        >
          <Card className="hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{t.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t.category}</p>
            </CardContent>
          </Card>
        </motion.button>
      ))}
    </div>
  );
}