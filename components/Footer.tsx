"use client";

import { motion } from "framer-motion";

export default function Footer() {
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
          它的目标不是替你下结论,
          <br />
          而是把<span className="text-fallacy">判断力</span>还给你。
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
            <span className="font-sc text-[0.98rem]">开始明辨</span>
            <span className="label-mono text-card/70">→</span>
          </a>
          <span className="font-sc text-[0.92rem] text-ink-soft">
            免费试用 · 订阅由 Stripe 提供
          </span>
        </motion.div>

        <div className="mt-20 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-lg font-semibold text-ink">明辨</span>
            <span className="label-mono text-fallacy">TheTruth</span>
          </div>
          <p className="font-sc text-[0.82rem] text-ink-faint">
            把那些藏在文字里的「钩子」摊到台面上。
          </p>
          <span className="label-mono text-ink-faint">© 2026 · mingbian.ai</span>
        </div>
      </div>
    </footer>
  );
}
