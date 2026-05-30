"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Annotation, HOOK_META, Segment } from "@/lib/fixtures";
import AnnotatedText from "./AnnotatedText";
import AnnotationCard from "./AnnotationCard";
import LeaderLines, { Line } from "./ui/LeaderLine";

interface Props {
  segments: Segment[];
  annotations: Record<string, Annotation>;
  /** Hero 模式:逐个浮现 hook + 批注 */
  autoReveal?: boolean;
  /** 堆叠模式:批注置于正文下方,无侧栏与引线(用于窄容器/Hero)*/
  stacked?: boolean;
  textClassName?: string;
  marginTitle?: string;
  /** 重新解析时变更,触发重置 */
  resetKey?: string | number;
}

export default function Dissection({
  segments,
  annotations,
  autoReveal = false,
  stacked = false,
  textClassName = "",
  marginTitle = "Margin notes",
  resetKey,
}: Props) {
  // 显示顺序 = hook 在正文出现的顺序
  const order = useMemo(
    () =>
      segments
        .map((s) => s.annId)
        .filter((id): id is string => Boolean(id && annotations[id])),
    [segments, annotations]
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string> | null>(
    autoReveal ? new Set() : null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const marksRef = useRef<Map<string, HTMLElement>>(new Map());
  const cardsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [lines, setLines] = useState<Line[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const registerMark = (id: string, el: HTMLElement | null) => {
    if (el) marksRef.current.set(id, el);
    else marksRef.current.delete(id);
  };
  const registerCard = (id: string, el: HTMLElement | null) => {
    if (el) cardsRef.current.set(id, el);
    else cardsRef.current.delete(id);
  };

  // ── 逐句浮现(Hero)──────────────────────────────
  useEffect(() => {
    if (!autoReveal) {
      setRevealed(null);
      return;
    }
    setRevealed(new Set());
    const timers: ReturnType<typeof setTimeout>[] = [];
    order.forEach((id, i) => {
      timers.push(
        setTimeout(() => {
          setRevealed((prev) => {
            const next = new Set(prev ?? []);
            next.add(id);
            return next;
          });
        }, 700 + i * 620)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [autoReveal, order, resetKey]);

  // ── 解析重置(Demo)──────────────────────────────
  useEffect(() => {
    setActiveId(null);
    if (!autoReveal) setRevealed(null);
  }, [resetKey, autoReveal]);

  // ── 测量并生成引线 ───────────────────────────────
  const measure = () => {
    const container = containerRef.current;
    if (!container) return;
    const c = container.getBoundingClientRect();
    setBox({ w: c.width, h: c.height });

    if (stacked) {
      setLines([]);
      return;
    }

    const visible =
      revealed === null ? order : order.filter((id) => revealed.has(id));

    const next: Line[] = [];
    for (const id of visible) {
      const m = marksRef.current.get(id);
      const k = cardsRef.current.get(id);
      if (!m || !k) continue;
      const mr = m.getBoundingClientRect();
      const kr = k.getBoundingClientRect();
      const x1 = mr.right - c.left;
      const y1 = mr.top + mr.height / 2 - c.top;
      const x2 = kr.left - c.left;
      const y2 = kr.top + Math.min(20, kr.height / 2) - c.top;
      const dx = Math.max(36, (x2 - x1) * 0.45);
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      next.push({
        id,
        d,
        x1,
        y1,
        x2,
        y2,
        color: HOOK_META[annotations[id].type].color,
        active: activeId === null || activeId === id,
      });
    }
    setLines(next);
  };

  // 重新测量:布局变化、resize、active/reveal 变化、字体就绪
  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, activeId, order, resetKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    window.addEventListener("resize", measure);
    // 字体加载完成后再测一次,避免行宽变化导致锚点偏移
    if (typeof document !== "undefined" && "fonts" in document) {
      (document as Document).fonts.ready.then(() => measure());
    }
    const raf = requestAnimationFrame(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const marginCards = order.filter(
    (id) => revealed === null || revealed.has(id)
  );

  // 堆叠模式:正文 + 下方批注,无侧栏与引线
  if (stacked) {
    return (
      <div ref={containerRef} onClick={() => setActiveId(null)}>
        <div onClick={(e) => e.stopPropagation()}>
          <AnnotatedText
            segments={segments}
            annotations={annotations}
            activeId={activeId}
            onActivate={setActiveId}
            revealed={revealed}
            registerMark={registerMark}
            className={textClassName}
          />
        </div>
        <div
          className="mt-5 space-y-2 border-t border-dashed border-rule pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence>
            {marginCards.map((id) => (
              <AnnotationCard
                key={id}
                annotation={annotations[id]}
                index={order.indexOf(id)}
                active={activeId === id}
                onActivate={setActiveId}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" onClick={() => setActiveId(null)}>
      <LeaderLines width={box.w} height={box.h} lines={lines} />

      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        {/* 正文列 */}
        <div onClick={(e) => e.stopPropagation()}>
          <AnnotatedText
            segments={segments}
            annotations={annotations}
            activeId={activeId}
            onActivate={setActiveId}
            revealed={revealed}
            registerMark={registerMark}
            className={textClassName}
          />
        </div>

        {/* 右栏批注(桌面)*/}
        <div
          className="hidden lg:block"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="label-mono mb-3 block text-ink-faint">
            {marginTitle}
          </span>
          <div className="space-y-2.5">
            <AnimatePresence>
              {marginCards.map((id) => (
                <AnnotationCard
                  key={id}
                  annotation={annotations[id]}
                  index={order.indexOf(id)}
                  active={activeId === id}
                  onActivate={setActiveId}
                  registerRef={registerCard}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 移动端:批注堆叠在正文下方(无引线)*/}
      <div className="mt-7 space-y-2.5 lg:hidden" onClick={(e) => e.stopPropagation()}>
        <span className="label-mono mb-1 block text-ink-faint">{marginTitle}</span>
        {marginCards.map((id) => (
          <AnnotationCard
            key={id}
            annotation={annotations[id]}
            index={order.indexOf(id)}
            active={activeId === id}
            onActivate={setActiveId}
          />
        ))}
      </div>
    </div>
  );
}
