"use client";

import { motion } from "framer-motion";
import { STRINGS, useI18n } from "@/lib/i18n";
import Section from "./ui/Section";

const PIPELINE = STRINGS.colophon.pipeline;
const STACK = STRINGS.colophon.stack;

export default function Colophon() {
  const { t, accent } = useI18n();
  return (
    <Section
      index="04"
      kicker={t(STRINGS.colophon.kicker)}
      kickerEn={STRINGS.colophon.caption}
      className="py-20 md:py-28"
    >
      {/* 推理链管道 */}
      <div className="mb-14 flex flex-wrap items-center gap-y-4">
        {PIPELINE.map((p, i) => (
          <div key={p.en} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-col items-center rounded-sm border border-rule bg-card px-4 py-3"
            >
              <span className="font-sc text-[0.95rem] font-semibold text-ink">
                {t(p)}
              </span>
              {accent(p) && (
                <span className="label-mono mt-0.5 text-ink-faint">
                  {accent(p)}
                </span>
              )}
            </motion.div>
            {i < PIPELINE.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.2 }}
                className="px-2 text-fallacy md:px-3"
              >
                ⟶
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* 技术栈 colophon */}
      <div className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((s, i) => (
          <motion.div
            key={s.layer.en}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="bg-card p-5"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-sc text-[1.02rem] font-semibold text-ink">
                {t(s.layer)}
              </span>
              {accent(s.layer) && (
                <span className="label-mono text-ink-faint">
                  {accent(s.layer)}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.items.map((it) => {
                const label = typeof it === "string" ? it : t(it);
                return (
                  <span
                    key={label}
                    className="font-mono rounded-full border border-rule bg-paper px-2.5 py-1 text-[0.72rem] text-ink-soft"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
