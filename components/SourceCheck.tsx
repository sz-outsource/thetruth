"use client";

import { motion } from "framer-motion";
import { SourceCheck as SourceCheckData, VERDICT_META } from "@/lib/fixtures";

export default function SourceCheck({ checks }: { checks: SourceCheckData[] }) {
  return (
    <div className="space-y-4">
      {checks.map((c, i) => {
        const v = VERDICT_META[c.verdict];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-sm border border-rule bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-sc text-[0.95rem] font-semibold text-ink">
                「{c.claim}」
              </p>
              <span
                className="label-mono inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-card"
                style={{ backgroundColor: v.color }}
              >
                {v.zh} · {v.en}
              </span>
            </div>

            <p className="font-sc mt-2.5 text-[0.86rem] leading-relaxed text-ink-soft">
              {c.summary}
            </p>

            <div className="mt-4 border-t border-dashed border-rule pt-3">
              <span className="label-mono text-ink-faint">
                对照来源 · {c.sources.length} sources
              </span>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {c.sources.map((s, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-[0.82rem] leading-snug"
                  >
                    <span
                      className="font-mono mt-[0.15rem] text-[0.6rem]"
                      style={{ color: v.color }}
                    >
                      §{j + 1}
                    </span>
                    <span className="font-sc">
                      <span className="text-ink">{s.name}</span>
                      <span className="text-ink-faint"> — {s.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
