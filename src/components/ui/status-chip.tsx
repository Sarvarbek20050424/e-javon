// src/components/ui/status-chip.tsx
import { cn } from "@/lib/utils";

export type ChipTone = "open" | "pending" | "closed";

const TONES: Record<ChipTone, string> = {
  open: "bg-teal-bg text-teal",
  pending: "bg-gold-bg text-gold-text",
  closed: "bg-line-soft text-mtext",
};

export function StatusChip({
  tone,
  children,
  className,
}: {
  tone: ChipTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[99px] px-[11px] py-[4px] text-[12px] font-medium leading-none whitespace-nowrap",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}