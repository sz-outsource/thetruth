"use client";

import { motion } from "framer-motion";
import { STRINGS, useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative mt-10 border-t border-ink/15 bg-paper-deep">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl"
        >
          {t(STRINGS.footer.title.before)}
          <span className="text-fallacy">{t(STRINGS.footer.title.word)}</span>
          {t(STRINGS.footer.title.after)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-card transition-transform hover:-translate-y-0.5"
          >
            <span className="font-sc text-[0.98rem]">
              {t(STRINGS.footer.ctaStart)}
            </span>
            <span className="label-mono text-card/70">→</span>
          </a>
          <span className="font-sc text-[0.92rem] text-ink-soft">
            {t(STRINGS.footer.freeTrial)}
          </span>
        </motion.div>

        <div className="mt-20 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-lg font-semibold text-ink">明辨</span>
            <span className="label-mono text-fallacy">TheTruth</span>
          </div>
          <p className="font-sc text-[0.82rem] text-ink-faint">
            {t(STRINGS.footer.tagline)}
          </p>
          <span className="label-mono text-ink-faint">
            {t(STRINGS.footer.copyright)}
          </span>
        </div>
      </div>
    </footer>
  );
}
