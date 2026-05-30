"use client";

import { motion } from "framer-motion";
import { STRINGS, useI18n } from "@/lib/i18n";
import Section from "./ui/Section";

export default function Editorial() {
  const { t } = useI18n();
  return (
    <Section
      id="problem"
      index="01"
      kicker={t(STRINGS.editorial.kicker)}
      kickerEn={STRINGS.editorial.caption}
      className="py-20 md:py-28"
    >
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="dropcap font-sc text-[1.12rem] leading-[1.9] text-ink">
            {t(STRINGS.editorial.para1)}
          </p>
          <p className="font-sc mt-6 text-[1.12rem] leading-[1.9] text-ink-soft">
            {t(STRINGS.editorial.para2.before)}
            <span className="font-semibold text-ink">
              {t(STRINGS.editorial.para2.emph)}
            </span>
            {t(STRINGS.editorial.para2.after)}
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex flex-col justify-center border-l-2 border-fallacy pl-6"
        >
          <span className="font-display absolute -left-1 -top-6 text-6xl leading-none text-rule">
            &ldquo;
          </span>
          <p className="font-display text-2xl italic leading-snug text-ink md:text-[1.7rem]">
            {t(STRINGS.editorial.quote)}
          </p>
          <p className="font-sc mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
            {t(STRINGS.editorial.quoteFoot)}
          </p>
          <span className="label-mono mt-5 text-ink-faint">
            {t(STRINGS.editorial.attribution)}
          </span>
        </motion.blockquote>
      </div>
    </Section>
  );
}
