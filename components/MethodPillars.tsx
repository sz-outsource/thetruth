"use client";

import { motion } from "framer-motion";
import { STRINGS, useI18n } from "@/lib/i18n";
import Section from "./ui/Section";

const META = [
  { no: "i", color: "var(--color-fallacy)", glyph: "⌖" },
  { no: "ii", color: "var(--color-verified)", glyph: "≣" },
  { no: "iii", color: "var(--color-emotion)", glyph: "⌥" },
];

const PILLARS = STRINGS.method.pillars.map((p, i) => ({ ...META[i], ...p }));

export default function MethodPillars() {
  const { t, accent } = useI18n();
  return (
    <Section
      id="method"
      index="02"
      kicker={t(STRINGS.method.kicker)}
      kickerEn={STRINGS.method.caption}
      className="py-20 md:py-28"
    >
      <div className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.name.en}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="group relative bg-card p-8 transition-colors hover:bg-paper"
          >
            <div className="flex items-start justify-between">
              <span
                className="font-display text-5xl leading-none"
                style={{ color: p.color }}
              >
                {p.glyph}
              </span>
              <span className="font-mono text-sm text-ink-faint">{p.no}</span>
            </div>

            <h3 className="font-sc mt-8 flex items-baseline gap-3 text-2xl font-semibold text-ink">
              {t(p.name)}
              {accent(p.name) && (
                <span className="label-mono" style={{ color: p.color }}>
                  {accent(p.name)}
                </span>
              )}
            </h3>

            <p className="font-sc mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
              {t(p.desc)}
            </p>

            <span
              className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
              style={{ backgroundColor: p.color }}
            />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-sc mt-8 text-center text-[0.95rem] italic text-ink-faint"
      >
        {t(STRINGS.method.footer)}
      </motion.p>
    </Section>
  );
}
