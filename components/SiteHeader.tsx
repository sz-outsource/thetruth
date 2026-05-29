"use client";

import { motion } from "framer-motion";

const NAV = [
  { href: "#problem", zh: "理念", en: "Why" },
  { href: "#method", zh: "方法", en: "Method" },
  { href: "#demo", zh: "试用", en: "Try" },
  { href: "#next", zh: "路线", en: "Next" },
];

export default function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-30 border-b border-rule bg-paper/85 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <a href="#top" className="group flex items-baseline gap-2.5">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            明辨
          </span>
          <span className="label-mono text-fallacy">TheTruth</span>
        </a>
        <nav className="flex items-center gap-5 sm:gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group flex flex-col items-center text-ink-soft transition-colors hover:text-fallacy"
            >
              <span className="font-sc text-sm">{n.zh}</span>
              <span className="label-mono text-[0.55rem] opacity-60">{n.en}</span>
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
