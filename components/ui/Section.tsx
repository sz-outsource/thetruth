"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  id?: string;
  index: string; // 章节编号,如 "01"
  kicker: string;
  kickerEn?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({
  id,
  index,
  kicker,
  kickerEn,
  children,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl px-6 md:px-10 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-end justify-between border-b border-rule pb-4"
      >
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-fallacy">{index}</span>
          <h2 className="font-sc text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            {kicker}
          </h2>
        </div>
        {kickerEn && (
          <span className="label-mono hidden text-ink-faint sm:block">
            {kickerEn}
          </span>
        )}
      </motion.div>
      {children}
    </section>
  );
}
