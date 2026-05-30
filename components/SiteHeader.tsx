"use client";

import { motion } from "framer-motion";
import { STRINGS, useI18n } from "@/lib/i18n";
import LanguageSelector from "./LanguageSelector";

const NAV = [
  { href: "#problem", label: STRINGS.header.nav.problem },
  { href: "#method", label: STRINGS.header.nav.method },
  { href: "#demo", label: STRINGS.header.nav.demo },
  { href: "#next", label: STRINGS.header.nav.next },
];

export default function SiteHeader() {
  const { t, accent } = useI18n();

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
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-5 sm:gap-7">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="group flex flex-col items-center text-ink-soft transition-colors hover:text-fallacy"
              >
                <span className="font-sc text-sm">{t(n.label)}</span>
                {accent(n.label) && (
                  <span className="label-mono text-[0.55rem] opacity-60">
                    {accent(n.label)}
                  </span>
                )}
              </a>
            ))}
          </nav>
          <LanguageSelector />
        </div>
      </div>
    </motion.header>
  );
}
