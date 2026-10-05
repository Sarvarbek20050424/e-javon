// src/app/royxatdan-otish/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function RoyxatdanOtishPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      router.push("/kirish");
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">E-javon</CardTitle>
          <CardDescription className="text-center">
            Yangi akkaunt yaratish
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">To'liq ism</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Toshmatov Botir"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="talaba@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 6 ta belgi"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={(e) => setRole(e.target.value as any)}
                  />
                  Talaba
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === "teacher"}
                    onChange={(e) => setRole(e.target.value as any)}
                  />
                  O'qituvchi
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/kirish" className="text-primary hover:underline">
                Akkauntingiz bormi? Kirish
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}