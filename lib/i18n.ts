"use client";

/* ─────────────────────────────────────────────────────────────
   明辨 / TheTruth — UI 文案字典(双语)
   组件里的所有「界面文字」集中在此;演示数据见 lib/fixtures.ts。
   每条文案是 { en, zh };取值靠 useI18n() 的 t()/alt()。
   设计动机:正文用当前语言,等宽小标签(mono)用「另一种语言」
   作为版式点缀 —— 保留原站「中文标题 + 拉丁批注」的双语编排。
   ───────────────────────────────────────────────────────────── */

import { useLang } from "./LanguageProvider";
import { ACCENT_LANG, type Lang } from "./locales";

/** 双语/多语字符串:键为受支持的语言代码,新增语言时所有字面量自动被要求补齐 */
export type LS = Record<Lang, string>;
/** 多语字符串数组(如 reasoning 推理链) */
export type LSList = Record<Lang, string[]>;

/** 按语言取值(可用于任意含语言键的形状,如 HOOK_META) */
export function pick(s: Record<Lang, string>, lang: Lang): string {
  return s[lang];
}

/** 组件内取文案:
    - t() 取当前语言;
    - accent() 取固定的「点缀语言」(拉丁文 ACCENT_LANG),用于 mono 小标签;
      当前语言就是点缀语言时返回 null(英文模式下不再重复显示)。
    泛型同时支持字符串与字符串数组(如 reasoning)。 */
export function useI18n() {
  const lang = useLang();
  return {
    lang,
    t: <T,>(s: Record<Lang, T>): T => s[lang],
    accent: (s: Record<Lang, string>): string | null =>
      lang === ACCENT_LANG ? null : s[ACCENT_LANG],
  };
}

export const STRINGS = {
  header: {
    nav: {
      problem: { en: "Why", zh: "理念" },
      method: { en: "Method", zh: "方法" },
      demo: { en: "Try", zh: "试用" },
      next: { en: "Next", zh: "路线" },
    },
    /** 语言选择器的无障碍标签 */
    langMenu: { en: "Language", zh: "语言" },
  },

  hero: {
    kicker: { en: "Independent judgment, re-issued", zh: "独立判断 · 重新出厂" },
    est: { en: "EST. 2026 · mingbian.ai", zh: "EST. 2026 · mingbian.ai" },
    title: {
      before: { en: "Drag the ", zh: "把藏在文字里的" },
      hook: { en: "hooks", zh: "钩子" },
      after: { en: " hidden in text out into the open.", zh: ",摊到台面上。" },
    },
    subhead: {
      en: "See how a sentence is engineered to make you believe it.",
      zh: "看清一句话,是怎样被设计得让你信以为真的。",
    },
    body: {
      en: "Getting misled by a sentence usually isn't a sign you're not smart enough. Persuasion and misdirection are a craft — refined, deliberate, rehearsed. TheTruth lays each of those mechanisms out for you to see.",
      zh: "被一句话带偏,常常不是因为你不够聪明,而是因为说服与误导本身,就是一门被反复打磨的手艺。明辨把这些机制一个个摊给你看。",
    },
    ctaPrimary: { en: "Try it on a sentence", zh: "贴一段话试试" },
    ctaSecondary: { en: "First, why it works", zh: "先了解它为什么有效" },
    sampleCaption: { en: "Sample · one ad line", zh: "样本 · 一句广告语" },
    marking: { en: "marking up", zh: "批改中" },
    scrollHint: { en: "Scroll — see the whole craft", zh: "向下,看清整套手艺" },
  },

  editorial: {
    kicker: { en: "Why you get misled", zh: "为什么你会被带偏" },
    caption: "The problem",
    para1: {
      en: "In a world saturated with feeds, marketing copy, and comment-section noise, whether a piece of text convinces you is no longer left to chance — it's engineered: handpicked wording, logic that only looks sound, a rhythm timed to your emotions. Being led astray rarely means you aren't smart enough. Persuasion and misdirection are themselves a craft, honed over and over.",
      zh: "在信息过载、自媒体、营销话术与评论区彼此交织的今天,一段话能不能让你信以为真,早已不是碰运气,而是被设计出来的:挑过的措辞、似是而非的逻辑、踩准情绪的节奏。被带偏,往往不是因为你不够聪明,而是因为说服与误导本身,就是一门被反复打磨的手艺。",
    },
    para2: {
      before: {
        en: "The way through is almost humble: once you can ",
        zh: "而破解之道其实很朴素:把这些被设计过的机制",
      },
      emph: { en: "see", zh: "看见" },
      after: {
        en: " these engineered mechanisms, you take back the initiative to judge. We want to do one thing — drag the 'hooks' hidden in the text out into the open, and put independent, clear-eyed judgment back within everyone's reach.",
        zh: ",人才拿得回判断的主动权。我们想做一件事——把那些藏在文字里的「钩子」摊到台面上,让独立思考与客观判断重新回到每个普通人手边。",
      },
    },
    quote: {
      en: "Against something carefully engineered, “just be a little smarter” is the first strategy to fail.",
      zh: "对抗被精心设计的东西,光靠「你再聪明一点」是最先失败的那条路。",
    },
    quoteFoot: {
      en: "What actually helps is laying the mechanism open — visible, and open to question. That's the capability TheTruth wants to hand back to everyone.",
      zh: "真正有用的,是把机制摊开、让它可见、可追问。这正是明辨想交回到每个人手里的能力。",
    },
    attribution: { en: "— What we learned", zh: "— What we learned" },
  },

  method: {
    kicker: { en: "How it helps you see clearly", zh: "它怎么帮你看清" },
    caption: "Identify · Verify · Restore",
    pillars: [
      {
        name: { en: "Identify", zh: "识别" },
        desc: {
          en: "Spot logical fallacies and loaded rhetoric — and point to exactly where they try to slip past your judgment.",
          zh: "识别逻辑谬误与诱导性修辞,并指出它在哪一步想绕过你的判断。",
        },
      },
      {
        name: { en: "Verify", zh: "核查" },
        desc: {
          en: "Cross-check against multiple sources and public data to tell what's supported, what's exaggerated, and what's misleading.",
          zh: "对照多方来源与公开数据,分清哪些有据可查、哪些被夸大、哪些是误导。",
        },
      },
      {
        name: { en: "Restore", zh: "还原" },
        desc: {
          en: "Lay the whole chain of reasoning open, line by line — instead of handing you a bare 'true / false' label.",
          zh: "把整条推理摊开、可逐句追问,而不是直接丢给你一个「真 / 假」的标签。",
        },
      },
    ],
    footer: {
      en: "Its goal isn't to decide for you — it's to give your judgment back.",
      zh: "它的目标不是替你下结论,而是把判断力还给你。",
    },
  },

  demo: {
    kicker: { en: "Put a passage on the table", zh: "把一段话摊到台面上" },
    caption: "The dissection · live demo",
    trySample: { en: "Try a sample", zh: "试试样本" },
    textLabel: { en: "Text under review · ", zh: "待核查文本 · " },
    charSuffix: { en: " chars", zh: " 字" },
    placeholder: {
      en: "Paste an argument, a social post, or an article…",
      zh: "贴入一段论述、一条社媒帖或一篇文章……",
    },
    demoNote: {
      en: "Demo runs on pre-baked analysis · the real version reasons live with Gemini",
      zh: "演示使用预置分析数据 · 真实版本由 Gemini 实时推理",
    },
    analyze: { en: "Analyze this", zh: "解析这段话" },
    reAnalyze: { en: "Re-analyze", zh: "重新解析" },
    steps: {
      en: [
        "Spot rhetoric & fallacies",
        "Search · cross-check sources",
        "Restore the reasoning, line by line",
      ],
      zh: ["识别修辞与谬误", "检索 · 对照多方来源", "还原推理 · 逐句可追问"],
    },
    markedUp: { en: "Marked up · annotated", zh: "批改完成 · marked up" },
    hooksUnit: { en: " hooks", zh: " 处钩子" },
    checksUnit: { en: " checks", zh: " 项核查" },
    crossCheck: { en: "Cross-check · sources", zh: "多源核查 · cross-check" },
    marginTitle: { en: "Margin notes · tap to trace", zh: "批注栏 · 点击展开追问" },
  },

  annotation: {
    trace: { en: "Trace · line by line", zh: "逐句追问 · trace" },
    expand: { en: "Tap to trace →", zh: "点击展开追问 →" },
  },

  source: {
    sourcesLabel: { en: "Cross-checked · ", zh: "对照来源 · " },
    sourcesSuffix: { en: " sources", zh: " sources" },
  },

  colophon: {
    kicker: { en: "A traceable chain of reasoning", zh: "一条可追溯的推理链" },
    caption: "How we built it · colophon",
    pipeline: [
      { en: "Input", zh: "输入言论" },
      { en: "Identify", zh: "识别钩子" },
      { en: "Retrieve", zh: "多源检索" },
      { en: "Reason", zh: "推理核查" },
      { en: "Restore", zh: "还原追问" },
    ],
    stack: [
      {
        layer: { en: "Frontend", zh: "前端" },
        items: ["Next.js", "React", "Tailwind CSS"],
      },
      { layer: { en: "Backend", zh: "后端" }, items: ["FastAPI", "Node.js"] },
      {
        layer: { en: "Intelligence", zh: "AI 能力" },
        items: ["Gemini API", { en: "Multimodal reasoning", zh: "多模态推理" }],
      },
      {
        layer: { en: "Cloud", zh: "云服务" },
        items: ["Cloud Run", "Vertex AI"],
      },
      { layer: { en: "Data", zh: "数据层" }, items: ["PostgreSQL", "pgvector"] },
      { layer: { en: "Billing", zh: "订阅计费" }, items: ["Stripe"] },
    ] as { layer: LS; items: (string | LS)[] }[],
  },

  roadmap: {
    kicker: { en: "Where we're headed", zh: "接下来" },
    caption: "What's next",
    items: [
      {
        title: {
          en: "More authoritative sources",
          zh: "接入更多权威数据源与公开档案",
        },
        desc: {
          en: "So 'compare the sources' carries real weight — checks that go beyond a pile of links.",
          zh: "让「对比多方」更有底气,核查不再止于一堆链接。",
        },
      },
      {
        title: { en: "Browser extension", zh: "推出浏览器插件" },
        desc: {
          en: "Flag likely hooks the moment you read — turning 'seeing it' from after-the-fact checking into a real-time instinct.",
          zh: "在你阅读的当下就提示可能的逻辑钩子——把「看见」从事后核查变成实时本能。",
        },
        highlight: true,
      },
      {
        title: {
          en: "Media-literacy curriculum",
          zh: "面向教育场景的媒介素养课程",
        },
        desc: {
          en: "So independent thinking isn't only for people who use the tool — it's something more people can learn and take with them.",
          zh: "让独立思考不只属于会用工具的人,而是能被更多人学会、带走。",
        },
      },
    ],
    badge: { en: "Up next", zh: "下一站" },
  },

  footer: {
    title: {
      before: {
        en: "Its job isn't to decide for you — it hands ",
        zh: "它的目标不是替你下结论,而是把",
      },
      word: { en: "judgment", zh: "判断力" },
      after: { en: " back to you.", zh: "还给你。" },
    },
    ctaStart: { en: "Start with TheTruth", zh: "开始明辨" },
    freeTrial: {
      en: "Free to try · billing by Stripe",
      zh: "免费试用 · 订阅由 Stripe 提供",
    },
    tagline: {
      en: "Bringing the hooks hidden in text out into the open.",
      zh: "把那些藏在文字里的「钩子」摊到台面上。",
    },
    copyright: { en: "© 2026 · mingbian.ai", zh: "© 2026 · mingbian.ai" },
  },
};
