// src/app/kirish/page.tsx
"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DECOR = [
  { rotate: "-6deg", title: "MA'LUMOTNOMA", lines: 5, left: 24 },
  { rotate: "3deg", title: "ARIZA В· TA'TIL", lines: 4, left: 150 },
  { rotate: "-2deg", title: "TUSHUNTIRISH XATI", lines: 6, left: 280 },
];

export default function KirishPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Chap panel вЂ” 560px, --ink fon */}
      <aside
        className="relative hidden w-[560px] shrink-0 flex-col overflow-hidden bg-ink text-white lg:flex"
        style={{ padding: "40px 48px" }}
      >
        <span className="font-serif text-[22px]">e-javon</span>

        <div className="my-auto max-w-[420px]">
          <h1 className="font-serif text-[34px] leading-tight">
            Talaba hujjatlari вЂ” bitta javonda.
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "#B9C0D2" }}>
            Ma'lumotnoma, ariza va tushuntirish xatlarini bir necha daqiqada
            yarating, javoningizda saqlang va o'qituvchi bilan ulashing.
          </p>
        </div>

        {/* Dekorativ "varaq" kartalari */}
        <div className="relative h-[230px]">
          {DECOR.map((c, i) => (
            <div
              key={i}
              className="absolute bottom-0 w-[190px] rounded-[4px] bg-panel p-4 text-ink"
              style={{
                left: c.left,
                transform: `rotate(${c.rotate})`,
                boxShadow: "0 18px 40px rgba(0,0,0,.35)",
                height: 210,
                zIndex: i + 1,
              }}
            >
              <span className="fold-corner" aria-hidden="true" />
              <p className="font-serif text-[11px] tracking-wide">{c.title}</p>
              <div className="mt-3 space-y-2">
                {Array.from({ length: c.lines }).map((_, j) => (
                  <div
                    key={j}
                    className="h-[6px] rounded-full bg-line-soft"
                    style={{ width: `${90 - j * 9}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* O'ng panel вЂ” forma, 380px */}
      <main className="flex flex-1 items-center justify-center bg-paper p-6">
        <form action={handleSubmit} className="w-[380px] space-y-4">
          <div className="mb-6 lg:hidden">
            <span className="font-serif text-[22px]">e-javon</span>
          </div>
          <h2 className="font-serif text-[24px]">Tizimga kirish</h2>

          {error && (
            <p className="rounded-[8px] bg-gold-bg px-4 py-3 text-[13px] text-gold-text">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label className="text-[13px]" htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="talaba@example.com" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px]" htmlFor="password">Parol</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </Button>
        </form>
      </main>
    </div>
  );
}
