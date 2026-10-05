// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Himoyalangan marshrutlar
  const protectedRoutes = ["/talaba", "/oqituvchi", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/kirish";
    return NextResponse.redirect(url);
  }

  // 2. Role bo'yicha yo'naltirish
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const currentPath = request.nextUrl.pathname;
    const userRole = profile?.role;

    // Agar root (/) ga kelsa, role bo'yicha yo'naltirish
    if (currentPath === "/") {
      const url = request.nextUrl.clone();
      if (userRole === "admin") {
        url.pathname = "/admin";
      } else if (userRole === "teacher") {
        url.pathname = "/oqituvchi";
      } else if (userRole === "student") {
        url.pathname = "/talaba";
      }
      return NextResponse.redirect(url);
    }

    // Agar noto'g'ri rolga tegishli sahifaga kirsa, to'g'risiga yo'naltirish
    if (
      (userRole === "admin" && !currentPath.startsWith("/admin")) ||
      (userRole === "teacher" && !currentPath.startsWith("/oqituvchi")) ||
      (userRole === "student" && !currentPath.startsWith("/talaba"))
    ) {
      const url = request.nextUrl.clone();
      if (userRole === "admin") {
        url.pathname = "/admin";
      } else if (userRole === "teacher") {
        url.pathname = "/oqituvchi";
      } else if (userRole === "student") {
        url.pathname = "/talaba";
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}