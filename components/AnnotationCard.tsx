"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Annotation, HOOK_META } from "@/lib/fixtures";
import { STRINGS, useI18n } from "@/lib/i18n";

interface Props {
  annotation: Annotation;
  index: number;
  active: boolean;
  onActivate: (id: string | null) => void;
  registerRef?: (id: string, el: HTMLElement | null) => void;
}

export default function AnnotationCard({
  annotation,
  index,
  active,
  onActivate,
  registerRef,
}: Props) {
  const { t } = useI18n();
  const meta = HOOK_META[annotation.type];

  return (
    <motion.div
      ref={(el) => registerRef?.(annotation.id, el)}
      layout
      onMouseEnter={() => onActivate(annotation.id)}
      onClick={() => onActivate(active ? null : annotation.id)}
      initial={{ opacity: 0, x: 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative cursor-pointer border-l-2 bg-card/70 py-3 pl-4 pr-3 transition-colors"
      style={{
        borderColor: meta.color,
        backgroundColor: active ? "rgba(251,248,241,0.95)" : undefined,
        boxShadow: active
          ? "0 8px 30px -16px rgba(33,28,23,0.5), inset 0 0 0 1px rgba(217,207,189,0.7)"
          : "none",
      }}
    >
      {/* 角标编号,像稿件批注栏里的标号 */}
      <span
        className="label-mono absolute -left-[1.05rem] top-3 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] text-card"
        style={{ backgroundColor: meta.color }}
      >
        {index + 1}
      </span>

      <div className="flex items-baseline justify-between gap-2">
        <span className="label-mono" style={{ color: meta.color }}>
          {t(meta)}
        </span>
      </div>

      <h4 className="font-sc mt-1 text-[0.98rem] font-semibold leading-snug text-ink">
        {t(annotation.name)}
      </h4>

      <p className="font-sc mt-1.5 text-[0.82rem] leading-relaxed text-ink-soft">
        {t(annotation.bypass)}
      </p>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="reasoning"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-dashed border-rule pt-3">
              <span className="label-mono text-ink-faint">
                {t(STRINGS.annotation.trace)}
              </span>
              <ol className="mt-2 space-y-1.5">
                {t(annotation.reasoning).map((r, i) => (
                  <li
                    key={i}
                    className="font-sc flex gap-2 text-[0.8rem] leading-relaxed text-ink-soft"
                  >
                    <span
                      className="font-mono mt-[0.15rem] shrink-0 text-[0.62rem]"
                      style={{ color: meta.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!active && (
        <span className="label-mono mt-2 block text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
          {t(STRINGS.annotation.expand)}
        </span>
      )}
    </motion.div>
  );
}
