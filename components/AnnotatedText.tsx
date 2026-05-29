"use client";

import { Annotation, Segment } from "@/lib/fixtures";

interface Props {
  segments: Segment[];
  annotations: Record<string, Annotation>;
  activeId: string | null;
  onActivate: (id: string | null) => void;
  /** 已「批改」浮现的 hook id;为 null 表示全部已显示 */
  revealed?: Set<string> | null;
  registerMark?: (id: string, el: HTMLElement | null) => void;
  className?: string;
}

export default function AnnotatedText({
  segments,
  annotations,
  activeId,
  onActivate,
  revealed = null,
  registerMark,
  className = "",
}: Props) {
  return (
    <p className={className}>
      {segments.map((seg, i) => {
        const ann = seg.annId ? annotations[seg.annId] : undefined;
        const isRevealed = !ann || revealed === null || revealed.has(ann.id);

        if (!ann || !isRevealed) {
          // 普通文字,或尚未浮现的 hook(先以素文出现)
          return <span key={i}>{seg.text}</span>;
        }

        return (
          <mark
            key={i}
            ref={(el) => registerMark?.(ann.id, el)}
            className={`hook hook-${ann.type}`}
            data-active={activeId === ann.id}
            onMouseEnter={() => onActivate(ann.id)}
            onMouseLeave={() => onActivate(null)}
            onClick={(e) => {
              e.stopPropagation();
              onActivate(activeId === ann.id ? null : ann.id);
            }}
          >
            {seg.text}
          </mark>
        );
      })}
    </p>
  );
}
