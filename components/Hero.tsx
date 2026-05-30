"use client";

import { motion } from "framer-motion";
import { HERO_SAMPLE } from "@/lib/fixtures";
import { STRINGS, useI18n } from "@/lib/i18n";
import Dissection from "./Dissection";

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.2, 0, 0, 1] },
  }),
};

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-6 pb-20 pt-14 md:px-10 md:pt-20">
      {/* 报头 kicker */}
      <motion.div
        custom={0}
        variants={rise}
        initial="hidden"
        animate="show"
        className="mb-8 flex items-center gap-4"
      >
        <span className="kicker">{t(STRINGS.hero.kicker)}</span>
        <span className="hr-rule h-px flex-1" />
        <span className="label-mono text-ink-faint">{t(STRINGS.hero.est)}</span>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {/* 左:标题 */}
        <div>
          <motion.h1
            custom={1}
            variants={rise}
            initial="hidden"
            animate="show"
            className="font-display text-[2.7rem] font-semibold leading-[1.06] tracking-tight text-ink sm:text-6xl"
          >
            {t(STRINGS.hero.title.before)}
            <span className="relative whitespace-nowrap text-fallacy">
              {t(STRINGS.hero.title.hook)}
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="10"
                viewBox="0 0 120 10"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 6 C 30 2, 90 2, 118 7"
                  stroke="var(--color-fallacy)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {t(STRINGS.hero.title.after)}
          </motion.h1>

          <motion.p
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className="font-serif mt-6 max-w-md text-lg italic leading-relaxed text-ink-soft"
          >
            {t(STRINGS.hero.subhead)}
          </motion.p>

          <motion.p
            custom={3}
            variants={rise}
            initial="hidden"
            animate="show"
            className="font-sc mt-5 max-w-md text-[0.98rem] leading-relaxed text-ink-soft"
          >
            {t(STRINGS.hero.body)}
          </motion.p>

          <motion.div
            custom={4}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-card transition-transform hover:-translate-y-0.5"
            >
              <span className="font-sc text-[0.95rem]">
                {t(STRINGS.hero.ctaPrimary)}
              </span>
              <span className="label-mono text-card/70 transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#problem"
              className="font-sc text-[0.95rem] text-ink-soft underline decoration-rule decoration-2 underline-offset-4 transition-colors hover:text-fallacy"
            >
              {t(STRINGS.hero.ctaSecondary)}
            </a>
          </motion.div>
        </div>

        {/* 右:实时批改的剪报 */}
        <motion.figure
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="relative rotate-[0.6deg] rounded-sm border border-rule bg-card p-6 shadow-[0_30px_70px_-40px_rgba(33,28,23,0.55)] md:p-8"
        >
          <figcaption className="mb-4 flex items-center justify-between">
            <span className="label-mono text-ink-faint">
              {t(STRINGS.hero.sampleCaption)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-fallacy" />
              <span className="label-mono text-fallacy">
                {t(STRINGS.hero.marking)}
              </span>
            </span>
          </figcaption>

          <Dissection
            segments={HERO_SAMPLE.segments}
            annotations={HERO_SAMPLE.annotations}
            autoReveal
            stacked
            textClassName="font-sc text-xl leading-loose text-ink md:text-2xl"
          />
        </motion.figure>
      </div>

      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-16 flex items-center justify-center gap-3 text-ink-faint"
      >
        <span className="hr-rule h-px w-16" />
        <span className="label-mono">{t(STRINGS.hero.scrollHint)}</span>
        <span className="hr-rule h-px w-16" />
      </motion.div>
    </section>
  );
}
