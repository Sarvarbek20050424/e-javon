// src/app/test-supabase/page.tsx — yangilangan versiya
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestSupabase() {
  const [result, setResult] = useState<string>("Yuklanmoqda...");
  const [user, setUser] = useState<string>("Aniqlanmagan");

  useEffect(() => {
    async function test() {
      const supabase = createClient();

      // 1. Oddiy so'rov — profiles jadvalidan (agar mavjud bo'lsa)
      const { data, error } = await supabase
        .from("profiles")
        .select("count", { count: "exact", head: true });
      
      if (error) {
        // Agar jadval hali yaratilmagan bo'lsa, bu normal holat
        if (error.code === "42P01") {
          setResult(`✅ Supabase ulandi! (Jadvallar hali yaratilmagan — 3-bosqichda yaratamiz)`);
        } else {
          setResult(`❌ Xato: ${error.message}`);
        }
      } else {
        setResult(`✅ Supabase ulandi! Profiles soni: ${data}`);
      }

      // 2. Joriy foydalanuvchi
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? `✅ Foydalanuvchi: ${user.email}` : "⚠️ Tizimga kirmagan");
    }

    test();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Supabase ulanish testi</h1>
        
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">1. Database ulanishi</h2>
          <p className="text-muted-foreground">{result}</p>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">2. Auth holati</h2>
          <p className="text-muted-foreground">{user}</p>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">3. Environment o'zgaruvchilari</h2>
          <p className="text-muted-foreground">
            URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Mavjud" : "❌ Yo'q"}
          </p>
          <p className="text-muted-foreground">
            Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Mavjud" : "❌ Yo'q"}
          </p>
        </div>
      </div>
    </div>
  );
}