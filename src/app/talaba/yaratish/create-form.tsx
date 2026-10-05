// src/app/talaba/yaratish/create-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FoldCard } from "@/components/ui/fold-card";
import { Stepper } from "@/components/ui/stepper";
import { TabPill } from "@/components/ui/tab-pill";
import { DocumentPreview } from "@/components/documents/document-preview";
import { saveDocument } from "@/app/actions/document";
import { TEMPLATES, type StudentData, type TemplateSlug } from "@/lib/templates";
import { FileText } from "lucide-react";

const STEPS = ["Shablon", "Ma'lumotlar", "Saqlash"];

export default function CreateForm({
  studentData,
  profileIncomplete,
}: {
  studentData: StudentData;
  profileIncomplete: boolean;
}) {
  const [slug, setSlug] = useState<TemplateSlug | null>(null);
  const [step, setStep] = useState(0);
  const [shared, setShared] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [flash, setFlash] = useState(false);
  const router = useRouter();

  const template = slug ? TEMPLATES.find((t) => t.slug === slug)! : null;

  const form = useForm<Record<string, string>>({
    resolver: zodResolver(
      z.object(
        Object.fromEntries(
          (template?.fields ?? []).map((f) => [
            f.key,
            z.string().min(1, `${f.label} — to'ldirish shart`),
          ])
        )
      ) as any
    ),
    defaultValues: {},
  });

  const values = form.watch();

  // Live preview yorqinlashishi (300ms)
  useEffect(() => {
    if (!template) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 300);
    return () => clearTimeout(t);
  }, [values, template]);

  function pickTemplate(s: TemplateSlug) {
    setSlug(s);
    setStep(1);
    form.reset({});
  }

  async function onSubmit(vals: Record<string, string>) {
    if (profileIncomplete) {
      toast.error("Avval profilni to'ldiring");
      return;
    }
    if (!template) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("template_slug", template.slug);
    fd.append("title", template.title);
    fd.append("category", template.category);
    fd.append("body", template.render(studentData, vals));
    fd.append("form_data", JSON.stringify(vals));
    fd.append("shared_with_teacher", shared ? "on" : "");
    const res = await saveDocument(fd);
    setSaving(false);
    if (res?.error) toast.error(res.error);
    else {
      toast.success("Hujjat javonga saqlandi");
      router.push("/talaba/javon");
    }
  }

  return (
    <div className="space-y-6">
      <Stepper steps={STEPS} current={step} />

      {/* Mobil: forma/preview almashish */}
      <div className="flex gap-2 lg:hidden">
        <TabPill active={mobileView === "form"} onClick={() => setMobileView("form")}>Forma</TabPill>
        <TabPill active={mobileView === "preview"} onClick={() => setMobileView("preview")}>Ko'rinish</TabPill>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_460px]">
        {/* Forma ustuni */}
        <div className={`${mobileView === "form" ? "block" : "hidden"} lg:block`}>
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {TEMPLATES.map((t, i) => (
                <FoldCard key={t.slug} animate index={i} className="p-5">
                  <button type="button" onClick={() => pickTemplate(t.slug)} className="w-full text-left">
                    <div className="mb-1 flex items-center gap-2">
                      <FileText size={16} className="text-teal" />
                      <h3 className="font-serif text-[16px]">{t.title}</h3>
                    </div>
                    <p className="text-[12px] text-mtext">{t.category}</p>
                  </button>
                </FoldCard>
              ))}
            </div>
          )}

          {step === 1 && template && (
            <FoldCard className="p-6">
              <form onSubmit={form.handleSubmit(() => setStep(2))} className="space-y-4">
                {template.fields.map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <Label className="text-[13px]" htmlFor={f.key}>{f.label}</Label>
                    {f.type === "textarea" ? (
                      <Textarea id={f.key} placeholder={f.placeholder} {...form.register(f.key)} />
                    ) : (
                      <Input id={f.key} type={f.type} placeholder={f.placeholder} {...form.register(f.key)} />
                    )}
                    {form.formState.errors[f.key] && (
                      <p className="text-[12px] text-red">{form.formState.errors[f.key]?.message as string}</p>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(0)}>Orqaga</Button>
                  <Button type="submit">Davom etish</Button>
                </div>
              </form>
            </FoldCard>
          )}

          {step === 2 && template && (
            <FoldCard className="space-y-4 p-6">
              <p className="text-[14px] text-mtext">
                Hujjat tayyor. O'ngdagi varaqni tekshirib, javonga saqlang.
              </p>
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  type="checkbox"
                  checked={shared}
                  onChange={(e) => setShared(e.target.checked)}
                  className="h-4 w-4 accent-[var(--teal)]"
                />
                O'qituvchiga ochiq qilish
              </label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Orqaga</Button>
                <Button disabled={saving} onClick={form.handleSubmit(onSubmit)}>
                  {saving ? "Saqlanmoqda..." : "Javonga saqlash"}
                </Button>
              </div>
            </FoldCard>
          )}
        </div>

        {/* A4 live preview */}
        <div className={`${mobileView === "preview" ? "block" : "hidden"} lg:block`}>
          <div
            className="rounded-[4px] p-2 transition-colors duration-300"
            style={{ background: flash ? "var(--teal-bg)" : "transparent" }}
          >
            <DocumentPreview
              html={
                template
                  ? template.render(studentData, values ?? {})
                  : '<p style="color:#B4AD97;text-align:center;padding-top:140px">Shablon tanlang — hujjat shu yerda ko\'rinadi</p>'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}