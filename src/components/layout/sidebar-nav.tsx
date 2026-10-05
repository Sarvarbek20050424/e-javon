// src/components/layout/sidebar-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, FilePlus2, Archive, User, Users, LogOut,FileText,
  LayoutDashboard, GraduationCap, BookOpen, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";

export type SidebarRole = "student" | "teacher" | "admin";

const NAV: Record<SidebarRole, { href: string; label: string; icon: any; match: string; exact?: boolean }[]> = {
  student: [
    { href: "/talaba", label: "Bosh sahifa", icon: Home, match: "/talaba", exact: true },
    { href: "/talaba/yaratish", label: "Hujjat yaratish", icon: FilePlus2, match: "/talaba/yaratish" },
    { href: "/talaba/javon", label: "Mening javonim", icon: Archive, match: "/talaba/javon" },
    { href: "/talaba/profil", label: "Profil", icon: User, match: "/talaba/profil" },
  ],
  teacher: [
    { href: "/oqituvchi", label: "Guruhlarim", icon: Users, match: "/oqituvchi", exact: true },
    { href: "/oqituvchi/profil", label: "Profil", icon: User, match: "/oqituvchi/profil" },
  ],
   admin: [
    { href: "/admin", label: "Boshqaruv", icon: LayoutDashboard, match: "/admin", exact: true },
    { href: "/admin/oqituvchilar", label: "O'qituvchilar", icon: GraduationCap, match: "/admin/oqituvchilar" },
    { href: "/admin/talabalar", label: "Talabalar", icon: BookOpen, match: "/admin/talabalar" },
    { href: "/admin/guruhlar", label: "Guruhlar", icon: Users, match: "/admin/guruhlar" },
    { href: "/admin/fakultetlar", label: "Fakultetlar", icon: Building2, match: "/admin/fakultetlar" },
    { href: "/admin/hujjatlar", label: "Hujjatlar", icon: FileText, match: "/admin/hujjatlar" },
    { href: "/admin/profil", label: "Profil", icon: User, match: "/admin/profil" },   // вњ… YANGI
  ],
};

function isActive(pathname: string, item: { match: string; exact?: boolean }) {
  if (item.exact) return pathname === item.match;
  return pathname.startsWith(item.match);
}

const HOME: Record<SidebarRole, string> = {
  student: "/talaba",
  teacher: "/oqituvchi",
  admin: "/admin",
};

export function SidebarNav({ role, user }: { role: SidebarRole; user: { name: string; sub?: string } }) {
  const pathname = usePathname();
  const items = NAV[role];
  const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <aside className="hidden md:flex flex-col w-[240px] shrink-0 bg-sidebar text-sidebar-text" style={{ padding: "28px 16px" }}>
        <Link href={HOME[role]} className="font-serif text-[21px] text-white px-2 mb-6">e-javon</Link>

        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-[11px] px-[14px] py-[10px] rounded-[8px] text-[14px] transition-colors duration-150",
                  active ? "bg-sidebar-active text-white" : "hover:bg-sidebar-active/60 hover:text-white"
                )}
              >
                <item.icon size={17} strokeWidth={1.6} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 border-t border-white/10 px-2 pt-4">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white",
              role === "teacher" ? "bg-navy2" : "bg-gold"
            )}
          >
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] text-white">{user.name}</span>
            <span className="block truncate text-[11px] text-sidebar-text">
              {user.sub ?? (role === "student" ? "Talaba" : role === "teacher" ? "O'qituvchi" : "Administrator")}
            </span>
          </span>
        </div>

        <form action={logout} className="mt-3">
          <button
            type="submit"
            className="flex w-full items-center gap-[11px] rounded-[8px] px-[14px] py-[10px] text-[14px] text-sidebar-text transition-colors duration-150 hover:bg-sidebar-active hover:text-white"
          >
            <LogOut size={17} strokeWidth={1.6} />
            Chiqish
          </button>
        </form>
      </aside>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around bg-sidebar py-2">
        {items.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-[8px] px-2 py-1 text-[10px]",
                active ? "bg-sidebar-active text-white" : "text-sidebar-text"
              )}
            >
              <item.icon size={18} strokeWidth={1.6} />
              {item.label}
            </Link>
          );
        })}
        <form action={logout}>
          <button type="submit" className="flex flex-col items-center gap-1 px-2 py-1 text-[10px] text-sidebar-text">
            <LogOut size={18} strokeWidth={1.6} />
            Chiqish
          </button>
        </form>
      </nav>
    </>
  );
}
