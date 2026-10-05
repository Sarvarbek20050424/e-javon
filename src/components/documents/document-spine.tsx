// src/components/documents/document-spine.tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

const GRADIENTS: Record<string, string> = {
  obyektivka: "linear-gradient(180deg,#146356,#0F6A5B)",
  spravka: "linear-gradient(180deg,#146356,#0F6A5B)",   // Ma'lumotnoma — teal
  leave: "linear-gradient(180deg,#D8993C,#C0862F)",     // Ta'til — gold
  dorm: "linear-gradient(180deg,#D8993C,#C0862F)",      // Yotoqxona — gold
  move: "linear-gradient(180deg,#3A4A76,#2B3B63)",      // Guruh almashtirish — navy
  expl: "linear-gradient(180deg,#8B8272,#736A5C)",      // Tushuntirish — neytral
};

export function DocumentSpine({
  category,
  title,
  meta,
  rotate = -2,
  onClick,
}: {
  category: string;
  title: string;
  meta?: string;
  rotate?: number;
  onClick?: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduce ? { opacity: 0 } : { opacity: 0, rotate }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, rotate }}
      whileHover={reduce ? undefined : { rotate: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative w-[96px] h-[132px] rounded-[4px] overflow-hidden text-left shrink-0"
      style={{ background: GRADIENTS[category] ?? GRADIENTS.expl }}
    >
      <span className="absolute inset-x-0 bottom-0 p-2 text-white">
        <span className="block text-[12px] leading-tight font-medium line-clamp-2">{title}</span>
        {meta && <span className="block text-[10px] opacity-70 mt-1">{meta}</span>}
      </span>
    </motion.button>
  );
}

export function DocumentSpineEmpty({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[96px] h-[132px] rounded-[4px] border-[1.5px] border-dashed border-line flex items-center justify-center text-mtext2 hover:text-teal hover:border-teal transition-colors shrink-0"
    >
      <span className="text-[22px] leading-none">+</span>
    </button>
  );
}