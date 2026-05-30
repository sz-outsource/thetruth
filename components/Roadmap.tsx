"use client";

import { motion } from "framer-motion";
import { STRINGS, useI18n } from "@/lib/i18n";
import Section from "./ui/Section";

const ITEMS = STRINGS.roadmap.items;

export default function Roadmap() {
  const { t, accent } = useI18n();
  return (
    <Section
      id="next"
      index="05"
      kicker={t(STRINGS.roadmap.kicker)}
      kickerEn={STRINGS.roadmap.caption}
      className="py-20 md:py-28"
    >
      <div className="space-y-px overflow-hidden rounded-sm border border-rule bg-rule">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.title.en}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col gap-2 bg-card p-6 transition-colors hover:bg-paper md:flex-row md:items-center md:gap-8"
          >
            <span className="font-display text-2xl text-fallacy">→</span>
            <div className="md:w-72 md:shrink-0">
              <h3 className="font-sc text-lg font-semibold text-ink">
                {t(it.title)}
              </h3>
              {accent(it.title) && (
                <span className="label-mono text-ink-faint">
                  {accent(it.title)}
                </span>
              )}
            </div>
            <p className="font-sc text-[0.95rem] leading-relaxed text-ink-soft">
              {t(it.desc)}
            </p>
            {"highlight" in it && it.highlight && (
              <span className="label-mono shrink-0 rounded-full bg-emotion/15 px-2.5 py-1 text-emotion">
                {t(STRINGS.roadmap.badge)}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
