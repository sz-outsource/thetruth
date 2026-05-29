"use client";

import { motion } from "framer-motion";
import Section from "./ui/Section";

const PIPELINE = [
  { zh: "输入言论", en: "Input" },
  { zh: "识别钩子", en: "Identify" },
  { zh: "多源检索", en: "Retrieve" },
  { zh: "推理核查", en: "Reason" },
  { zh: "还原追问", en: "Restore" },
];

const STACK = [
  { layer: "前端", en: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
  { layer: "后端", en: "Backend", items: ["FastAPI", "Node.js"] },
  { layer: "AI 能力", en: "Intelligence", items: ["Gemini API", "多模态推理"] },
  { layer: "云服务", en: "Cloud", items: ["Cloud Run", "Vertex AI"] },
  { layer: "数据层", en: "Data", items: ["PostgreSQL", "pgvector"] },
  { layer: "订阅计费", en: "Billing", items: ["Stripe"] },
];

export default function Colophon() {
  return (
    <Section
      index="04"
      kicker="一条可追溯的推理链"
      kickerEn="How we built it · colophon"
      className="py-20 md:py-28"
    >
      {/* 推理链管道 */}
      <div className="mb-14 flex flex-wrap items-center gap-y-4">
        {PIPELINE.map((p, i) => (
          <div key={p.en} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-col items-center rounded-sm border border-rule bg-card px-4 py-3"
            >
              <span className="font-sc text-[0.95rem] font-semibold text-ink">
                {p.zh}
              </span>
              <span className="label-mono mt-0.5 text-ink-faint">{p.en}</span>
            </motion.div>
            {i < PIPELINE.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.2 }}
                className="px-2 text-fallacy md:px-3"
              >
                ⟶
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* 技术栈 colophon */}
      <div className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((s, i) => (
          <motion.div
            key={s.en}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="bg-card p-5"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-sc text-[1.02rem] font-semibold text-ink">
                {s.layer}
              </span>
              <span className="label-mono text-ink-faint">{s.en}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.items.map((it) => (
                <span
                  key={it}
                  className="font-mono rounded-full border border-rule bg-paper px-2.5 py-1 text-[0.72rem] text-ink-soft"
                >
                  {it}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
