"use client";

import { motion } from "framer-motion";

export interface Line {
  id: string;
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  active: boolean;
}

interface Props {
  width: number;
  height: number;
  lines: Line[];
}

/** 细引线:把正文里的词组连回右栏批注卡——「摊到台面上」的视觉核心 */
export default function LeaderLines({ width, height, lines }: Props) {
  if (!width || !height) return null;
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden
    >
      {lines.map((l) => (
        <g key={l.id} style={{ opacity: l.active ? 1 : 0.32 }}>
          <motion.path
            d={l.d}
            stroke={l.color}
            strokeWidth={l.active ? 1.6 : 1}
            strokeDasharray={l.active ? "0" : "3 3"}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* 起点:正文锚点 */}
          <circle cx={l.x1} cy={l.y1} r={l.active ? 3 : 2} fill={l.color} />
          {/* 终点:批注卡锚点 */}
          <circle
            cx={l.x2}
            cy={l.y2}
            r={l.active ? 3.5 : 2.5}
            fill="none"
            stroke={l.color}
            strokeWidth={1.4}
          />
        </g>
      ))}
    </svg>
  );
}
