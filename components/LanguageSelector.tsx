"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLangCtx } from "@/lib/LanguageProvider";
import { LOCALES } from "@/lib/locales";
import { STRINGS, useI18n } from "@/lib/i18n";

/** 语言选择器:由 LOCALES 驱动,新增语言无需改动此组件 */
export default function LanguageSelector() {
  const { lang, setLang } = useLangCtx();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === lang) ?? LOCALES[0];

  // 点击外部 / Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t(STRINGS.header.langMenu)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="label-mono inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-ink-soft transition-colors hover:border-ink-faint hover:text-fallacy"
      >
        <span aria-hidden className="text-[0.7rem]">
          ⌘
        </span>
        {current.native}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-40 mt-2 min-w-[8rem] overflow-hidden rounded-sm border border-rule bg-card py-1 shadow-[0_20px_50px_-30px_rgba(33,28,23,0.6)]"
          >
            {LOCALES.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={`font-sc flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-[0.88rem] transition-colors hover:bg-paper ${
                      active ? "text-fallacy" : "text-ink-soft"
                    }`}
                  >
                    {l.native}
                    {active && (
                      <span className="label-mono text-fallacy">●</span>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
