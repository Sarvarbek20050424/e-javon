// src/components/ui/stepper.tsx
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center flex-wrap gap-y-2">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={label} className="flex items-center">
            {i > 0 && (
              <span className="w-[34px] h-[1.5px] bg-line relative overflow-hidden mx-2">
                {i <= current && (
                  <motion.span
                    className="absolute inset-0 bg-teal"
                    style={{ transformOrigin: "left" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </span>
            )}
            <span className="flex items-center gap-2">
              <motion.span
                animate={{
                  backgroundColor: state === "todo" ? "transparent" : "var(--teal)",
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[12px] shrink-0",
                  state === "todo"
                    ? "border-[1.5px] border-line text-mtext2"
                    : "text-white"
                )}
              >
                {i + 1}
              </motion.span>
              <span
                className={cn(
                  "text-[13px]",
                  state === "todo" ? "text-mtext2" : "text-ink font-medium"
                )}
              >
                {label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}