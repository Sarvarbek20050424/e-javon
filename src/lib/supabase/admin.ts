// src/lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

// Faqat server-side'da ishlatiladi!
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}