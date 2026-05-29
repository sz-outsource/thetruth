"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SAMPLES } from "@/lib/fixtures";
import Section from "./ui/Section";
import Dissection from "./Dissection";
import SourceCheck from "./SourceCheck";

type Status = "idle" | "analyzing" | "done";

const STEPS = ["识别修辞与谬误", "检索 · 对照多方来源", "还原推理 · 逐句可追问"];

export default function DemoWorkspace() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const sample = SAMPLES[sampleIdx];
  const [text, setText] = useState(sample.raw);
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 切换样本:回填文本、重置结果
  const pickSample = (idx: number) => {
    clearTimers();
    setSampleIdx(idx);
    setText(SAMPLES[idx].raw);
    setStatus("idle");
    setStep(0);
  };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const analyze = () => {
    clearTimers();
    setStatus("analyzing");
    setStep(0);
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), 350 + i * 480));
    });
    timers.current.push(
      setTimeout(() => {
        setStatus("done");
        setRunId((r) => r + 1);
      }, 350 + STEPS.length * 480)
    );
  };

  return (
    <Section
      id="demo"
      index="03"
      kicker="把一段话摊到台面上"
      kickerEn="The dissection · live demo"
      className="py-20 md:py-28"
    >
      {/* 工具条:样本切换 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="label-mono mr-1 text-ink-faint">试试样本</span>
        {SAMPLES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => pickSample(i)}
            className={`font-sc rounded-full border px-3.5 py-1.5 text-[0.82rem] transition-colors ${
              i === sampleIdx
                ? "border-ink bg-ink text-card"
                : "border-rule bg-card text-ink-soft hover:border-ink-faint"
            }`}
          >
            {s.kind}
          </button>
        ))}
      </div>

      {/* 输入区:像一张待批改的稿纸 */}
      <div className="rounded-sm border border-rule bg-card p-5 shadow-[0_20px_50px_-40px_rgba(33,28,23,0.5)] md:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="label-mono text-ink-faint">
            待核查文本 · {sample.kindEn}
          </span>
          <span className="label-mono text-ink-faint">{text.length} 字</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          rows={3}
          spellCheck={false}
          className="font-sc w-full resize-none bg-transparent text-lg leading-relaxed text-ink outline-none placeholder:text-ink-faint"
          placeholder="贴入一段论述、一条社媒帖或一篇文章……"
        />

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-rule pt-4">
          <span className="font-sc text-[0.8rem] text-ink-faint">
            演示使用预置分析数据 · 真实版本由 Gemini 实时推理
          </span>
          <button
            onClick={analyze}
            disabled={status === "analyzing"}
            className="group inline-flex items-center gap-2 rounded-full bg-fallacy px-5 py-2.5 text-card transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            <span className="font-sc text-[0.9rem]">
              {status === "done" ? "重新解析" : "解析这段话"}
            </span>
            <span className="label-mono text-card/80 transition-transform group-hover:translate-x-1">
              ↯
            </span>
          </button>
        </div>
      </div>

      {/* 分析进度 */}
      <AnimatePresence mode="wait">
        {status === "analyzing" && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-3">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[0.6rem] transition-colors ${
                      i <= step
                        ? "border-fallacy bg-fallacy text-card"
                        : "border-rule text-ink-faint"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span
                    className={`font-sc text-[0.92rem] transition-colors ${
                      i <= step ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    {s}
                  </span>
                  {i === step && (
                    <motion.span
                      layoutId="cursor"
                      className="h-3 w-1.5 bg-fallacy"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.9 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 结果:批改后的稿件 + 多源核查 */}
      <AnimatePresence>
        {status === "done" && (
          <motion.div
            key={`result-${runId}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="label-mono text-fallacy">批改完成 · marked up</span>
              <span className="hr-rule h-px flex-1" />
              <span className="label-mono text-ink-faint">
                {Object.keys(sample.annotations).length} 处钩子 · {sample.sourceChecks.length} 项核查
              </span>
            </div>

            {/* 批改稿:正文 + 边栏批注 + 引线 */}
            <div className="rounded-sm border border-rule bg-paper-deep/40 p-6 md:p-9">
              <Dissection
                key={runId}
                segments={sample.segments}
                annotations={sample.annotations}
                resetKey={runId}
                marginTitle="批注栏 · 点击展开追问"
                textClassName="font-sc text-xl leading-loose text-ink md:text-[1.7rem] md:leading-loose"
              />
            </div>

            {/* 多源核查 */}
            <div className="mt-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="label-mono text-verified">多源核查 · cross-check</span>
                <span className="hr-rule h-px flex-1" />
              </div>
              <SourceCheck checks={sample.sourceChecks} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
