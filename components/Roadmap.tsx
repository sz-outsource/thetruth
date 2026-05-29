"use client";

import { motion } from "framer-motion";
import Section from "./ui/Section";

const ITEMS = [
  {
    no: "→",
    zh: "接入更多权威数据源与公开档案",
    en: "More authoritative sources",
    desc: "让「对比多方」更有底气,核查不再止于一堆链接。",
  },
  {
    no: "→",
    zh: "推出浏览器插件",
    en: "Browser extension",
    desc: "在你阅读的当下就提示可能的逻辑钩子——把「看见」从事后核查变成实时本能。",
    highlight: true,
  },
  {
    no: "→",
    zh: "面向教育场景的媒介素养课程",
    en: "Media-literacy curriculum",
    desc: "让独立思考不只属于会用工具的人,而是能被更多人学会、带走。",
  },
];

export default function Roadmap() {
  return (
    <Section
      id="next"
      index="05"
      kicker="接下来"
      kickerEn="What's next"
      className="py-20 md:py-28"
    >
      <div className="space-y-px overflow-hidden rounded-sm border border-rule bg-rule">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.en}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col gap-2 bg-card p-6 transition-colors hover:bg-paper md:flex-row md:items-center md:gap-8"
          >
            <span className="font-display text-2xl text-fallacy">{it.no}</span>
            <div className="md:w-72 md:shrink-0">
              <h3 className="font-sc text-lg font-semibold text-ink">{it.zh}</h3>
              <span className="label-mono text-ink-faint">{it.en}</span>
            </div>
            <p className="font-sc text-[0.95rem] leading-relaxed text-ink-soft">
              {it.desc}
            </p>
            {it.highlight && (
              <span className="label-mono shrink-0 rounded-full bg-emotion/15 px-2.5 py-1 text-emotion">
                下一站
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
