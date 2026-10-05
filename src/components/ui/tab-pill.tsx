// src/components/ui/tab-pill.tsx
"use client";

import { cn } from "@/lib/utils";

export function TabPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[99px] px-[18px] py-[9px] text-[13px] border transition-colors duration-150",
        active
          ? "bg-ink text-white border-ink"
          : "border-line bg-panel text-mtext hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

export function TabPillGroup({
  items,
  value,
  onChange,
}: {
  items: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <TabPill key={it.value} active={value === it.value} onClick={() => onChange(it.value)}>
          {it.label}
        </TabPill>
      ))}
    </div>
  );
}