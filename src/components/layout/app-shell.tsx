// src/components/layout/app-shell.tsx
import { SidebarNav, type SidebarRole } from "./sidebar-nav";

export function AppShell({
  role,
  user,
  title,
  subtitle,
  actions,
  children,
}: {
  role: SidebarRole;
  user: { name: string; sub?: string };
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-paper">
      <SidebarNav role={role} user={user} />
      <main className="flex-1 min-w-0 px-5 py-6 pb-24 md:px-[52px] md:py-[40px] md:pb-[40px]">
        {title && (
          <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-[26px] leading-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-[14px] text-mtext">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}