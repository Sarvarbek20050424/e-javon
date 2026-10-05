// src/components/ui/fold-card.tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function FoldCard({
  className,
  children,
  animate = false,
  index = 0,
}: {
  className?: string;
  children: React.ReactNode;
  animate?: boolean;
  index?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={animate ? (reduce ? { opacity: 0 } : { opacity: 0, y: 8 }) : false}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={cn(
        "relative bg-panel border border-line rounded-[4px]",
        className
      )}
    >
      <span className="fold-corner" aria-hidden="true" />
      {children}
    </motion.div>
  );
}