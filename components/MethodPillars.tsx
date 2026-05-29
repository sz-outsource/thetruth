"use client";

import { motion } from "framer-motion";
import Section from "./ui/Section";

const PILLARS = [
  {
    no: "i",
    zh: "识别",
    en: "Identify",
    color: "var(--color-fallacy)",
    desc: "识别逻辑谬误与诱导性修辞,并指出它在哪一步想绕过你的判断。",
    glyph: "⌖",
  },
  {
    no: "ii",
    zh: "核查",
    en: "Verify",
    color: "var(--color-verified)",
    desc: "对照多方来源与公开数据,分清哪些有据可查、哪些被夸大、哪些是误导。",
    glyph: "≣",
  },
  {
    no: "iii",
    zh: "还原",
    en: "Restore",
    color: "var(--color-emotion)",
    desc: "把整条推理摊开、可逐句追问,而不是直接丢给你一个「真 / 假」的标签。",
    glyph: "⌥",
  },
];

export default function MethodPillars() {
  return (
    <Section
      id="method"
      index="02"
      kicker="它怎么帮你看清"
      kickerEn="Identify · Verify · Restore"
      className="py-20 md:py-28"
    >
      <div className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.en}
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
              {p.zh}
              <span className="label-mono" style={{ color: p.color }}>
                {p.en}
              </span>
            </h3>

            <p className="font-sc mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
              {p.desc}
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
        它的目标不是替你下结论,而是把判断力还给你。
      </motion.p>
    </Section>
  );
}
