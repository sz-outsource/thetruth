"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SAMPLES } from "@/lib/fixtures";
import { STRINGS, pick, useI18n } from "@/lib/i18n";
import Section from "./ui/Section";
import Dissection from "./Dissection";
import SourceCheck from "./SourceCheck";

type Status = "idle" | "analyzing" | "done";

export default function DemoWorkspace() {
  const { t, lang } = useI18n();
  const stepLabels = t(STRINGS.demo.steps);

  const [sampleIdx, setSampleIdx] = useState(0);
  const sample = SAMPLES[sampleIdx];
  const [text, setText] = useState(() => pick(SAMPLES[0].raw, "en"));
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 切换样本:回填文本、重置结果
  const pickSample = (idx: number) => {
    clearTimers();
    setSampleIdx(idx);
    setText(pick(SAMPLES[idx].raw, lang));
    setStatus("idle");
    setStep(0);
  };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  // 语言或样本变化时,只要不在解析中就把输入框回填为当前语言的原文
  useEffect(() => {
    if (status !== "analyzing") setText(pick(sample.raw, lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, sampleIdx]);

  const analyze = () => {
    clearTimers();
    setStatus("analyzing");
    setStep(0);
    stepLabels.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), 350 + i * 480));
    });
    timers.current.push(
      setTimeout(() => {
        setStatus("done");
        setRunId((r) => r + 1);
      }, 350 + stepLabels.length * 480)
    );
  };

  return (
    <Section
      id="demo"
      index="03"
      kicker={t(STRINGS.demo.kicker)}
      kickerEn={STRINGS.demo.caption}
      className="py-20 md:py-28"
    >
      {/* 工具条:样本切换 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="label-mono mr-1 text-ink-faint">
          {t(STRINGS.demo.trySample)}
        </span>
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
            {t(s.kind)}
          </button>
        ))}
      </div>

      {/* 输入区:像一张待批改的稿纸 */}
      <div className="rounded-sm border border-rule bg-card p-5 shadow-[0_20px_50px_-40px_rgba(33,28,23,0.5)] md:p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="label-mono text-ink-faint">
            {t(STRINGS.demo.textLabel)}
            {t(sample.kind)}
          </span>
          <span className="label-mono text-ink-faint">
            {text.length}
            {t(STRINGS.demo.charSuffix)}
          </span>
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
          placeholder={t(STRINGS.demo.placeholder)}
        />

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-rule pt-4">
          <span className="font-sc text-[0.8rem] text-ink-faint">
            {t(STRINGS.demo.demoNote)}
          </span>
          <button
            onClick={analyze}
            disabled={status === "analyzing"}
            className="group inline-flex items-center gap-2 rounded-full bg-fallacy px-5 py-2.5 text-card transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            <span className="font-sc text-[0.9rem]">
              {status === "done"
                ? t(STRINGS.demo.reAnalyze)
                : t(STRINGS.demo.analyze)}
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
              {stepLabels.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
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
              <span className="label-mono text-fallacy">
                {t(STRINGS.demo.markedUp)}
              </span>
              <span className="hr-rule h-px flex-1" />
              <span className="label-mono text-ink-faint">
                {Object.keys(sample.annotations).length}
                {t(STRINGS.demo.hooksUnit)} · {sample.sourceChecks.length}
                {t(STRINGS.demo.checksUnit)}
              </span>
            </div>

            {/* 批改稿:正文 + 边栏批注 + 引线 */}
            <div className="rounded-sm border border-rule bg-paper-deep/40 p-6 md:p-9">
              <Dissection
                key={runId}
                segments={sample.segments}
                annotations={sample.annotations}
                resetKey={runId}
                marginTitle={t(STRINGS.demo.marginTitle)}
                textClassName="font-sc text-xl leading-loose text-ink md:text-[1.7rem] md:leading-loose"
              />
            </div>

            {/* 多源核查 */}
            <div className="mt-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="label-mono text-verified">
                  {t(STRINGS.demo.crossCheck)}
                </span>
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
