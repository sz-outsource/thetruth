/* ─────────────────────────────────────────────────────────────
   明辨 / TheTruth — 预置样本与分析数据(mock / bilingual)
   无后端:演示用的「拆解结果」全部在此预先编写。
   每条文本都是双语 { en, zh };渲染时按当前语言取值。
   文本以「片段(segment)」数组表达:普通文字 + 带 hook 标记的片段,
   避免脆弱的字符偏移,渲染时直接映射。
   ───────────────────────────────────────────────────────────── */

import { LOCALES, type Lang } from "./locales";

/** 多语字符串:键为受支持的语言代码。新增语言时,每个字面量都会被 TS 要求补齐。 */
export type LS = Record<Lang, string>;
/** 多语字符串数组 / localized list */
export type LSList = Record<Lang, string[]>;

export type HookType = "fallacy" | "emotion" | "exaggerate" | "mislead";

export const HOOK_META: Record<
  HookType,
  { zh: string; en: string; color: string }
> = {
  fallacy: { zh: "逻辑谬误", en: "Logical Fallacy", color: "var(--color-fallacy)" },
  emotion: { zh: "情绪诉诸", en: "Emotional Appeal", color: "var(--color-emotion)" },
  exaggerate: { zh: "夸大其词", en: "Exaggeration", color: "var(--color-exaggerate)" },
  mislead: { zh: "误导信息", en: "Misleading Claim", color: "var(--color-mislead)" },
};

export type VerdictType = "verified" | "exaggerated" | "misleading" | "unfounded";

export const VERDICT_META: Record<
  VerdictType,
  { zh: string; en: string; color: string }
> = {
  verified: { zh: "有据可查", en: "Verified", color: "var(--color-verified)" },
  exaggerated: { zh: "被夸大", en: "Exaggerated", color: "var(--color-exaggerate)" },
  misleading: { zh: "误导", en: "Misleading", color: "var(--color-mislead)" },
  unfounded: { zh: "查无实据", en: "Unfounded", color: "var(--color-fallacy)" },
};

export interface Annotation {
  id: string;
  type: HookType;
  /** 技术名称,如「诉诸权威」 */
  name: LS;
  /** 它想在哪一步绕过你的判断 */
  bypass: LS;
  /** 逐句追问 / 推理链:把这一步摊开 */
  reasoning: LSList;
}

export interface Segment {
  text: LS;
  /** 若该片段是一个 hook,给出对应 annotation id */
  annId?: string;
}

export interface SourceCheck {
  claim: LS;
  verdict: VerdictType;
  summary: LS;
  sources: { name: LS; note: LS }[];
}

export interface Sample {
  id: string;
  kind: LS; // 营销话术 / 社媒帖 / 评论区
  raw: LS; // 纯文本(填回输入框),由片段拼出
  segments: Segment[];
  annotations: Record<string, Annotation>;
  sourceChecks: SourceCheck[];
}

/* helper:片段(可选 hook 标记)。text 为多语对象,新增语言即补键。 */
const seg = (text: LS, annId?: string): Segment =>
  annId ? { text, annId } : { text };
/* 由片段拼出原文,保证输入框内容与正文完全一致(按 LOCALES 遍历,与语言数解耦) */
const rawFrom = (segs: Segment[]): LS =>
  Object.fromEntries(
    LOCALES.map((l) => [l.code, segs.map((s) => s.text[l.code]).join("")])
  ) as LS;

/* ── 样本一:营销话术 ─────────────────────────────────────── */
const marketingSegments: Segment[] = [
  seg({ en: "90% of doctors quietly recommend", zh: "90% 的医生都在偷偷推荐" }, "m1"),
  seg({ en: " this antioxidant capsule. Miss today's ", zh: "这款抗氧化胶囊。今天错过" }),
  seg({ en: "50%-off flash deal", zh: "限时五折" }, "m2"),
  seg({ en: " and you're ", zh: ",就是在" }),
  seg({ en: "gambling with your whole family's health", zh: "拿全家人的健康冒险" }, "m3"),
  seg({ en: ". Don't act now, and ", zh: "。再不行动," }),
  seg(
    {
      en: "by the time your body breaks down, it'll all be too late",
      zh: "等身体垮了一切都来不及了",
    },
    "m4"
  ),
  seg({ en: ".", zh: "。" }),
];

const marketing: Sample = {
  id: "marketing",
  kind: { en: "Marketing copy", zh: "营销话术" },
  segments: marketingSegments,
  raw: rawFrom(marketingSegments),
  annotations: {
    m1: {
      id: "m1",
      type: "mislead",
      name: {
        en: "Appeal to authority + fabricated statistic",
        zh: "诉诸权威 + 伪造数据",
      },
      bypass: {
        en: "A precise-sounding '90%' plus the 'doctors' label makes you skip the question of where that number even comes from.",
        zh: "用一个具体到「90%」的数字 + 「医生」身份,让你跳过「这个数据从哪来」的核实。",
      },
      reasoning: {
        en: [
          "'90%' is suspiciously precise — no surveying body, sample size, or date is given.",
          "'Quietly recommend' can't be proven or disproven, yet implies an insider consensus.",
          "It outsources your judgment to the 'doctor' authority label rather than evidence about the product.",
          "Ask: which public study backs this figure? Who paid for it?",
        ],
        zh: [
          "「90%」精确得可疑——没有给出调查机构、样本量与时间。",
          "「都在偷偷」既无法证实,也无法证伪,却暗示了一种内部共识。",
          "把判断外包给「医生」这一权威标签,而非药品本身的证据。",
          "追问:哪一项公开研究支持这个比例?谁出钱做的?",
        ],
      },
    },
    m2: {
      id: "m2",
      type: "emotion",
      name: { en: "Scarcity & urgency", zh: "稀缺与紧迫" },
      bypass: {
        en: "'Limited time' manufactures time pressure so you order before you can compare prices or read the ingredients.",
        zh: "用「限时」制造时间压力,让你来不及比价、来不及查成分就下单。",
      },
      reasoning: {
        en: [
          "A 'limited-time 50% off' is often a permanent fixture — scarcity is usually manufactured.",
          "Urgency works by shrinking your thinking window, not by telling you anything about the product.",
          "Ask: has this price always been the norm? Did the 'original price' ever really exist?",
        ],
        zh: [
          "「限时五折」几乎是长期常驻的促销话术,稀缺往往是人为制造的。",
          "紧迫感的作用是压缩你的思考窗口,而非传递任何关于产品的信息。",
          "追问:这个价格是否一直如此?「原价」是否真实存在过?",
        ],
      },
    },
    m3: {
      id: "m3",
      type: "emotion",
      name: { en: "Emotional blackmail", zh: "情绪绑架" },
      bypass: {
        en: "It reframes 'not buying' as 'gambling with your family', letting guilt make the decision for you.",
        zh: "把「不买」重新框定为「拿家人冒险」,用愧疚感替你做决定。",
      },
      reasoning: {
        en: [
          "Whether you buy is swapped out for a moral test of 'do you love your family'.",
          "It's a false dilemma: not buying ≠ putting your family at risk.",
          "Ask: is there any evidence that skipping this capsule harms your family's health?",
        ],
        zh: [
          "购买与否,被偷换成「你是否爱家人」的道德选择。",
          "这是一个虚假两难:不买 ≠ 让家人冒险。",
          "追问:有任何证据表明不吃这款胶囊会损害家人健康吗?",
        ],
      },
    },
    m4: {
      id: "m4",
      type: "fallacy",
      name: { en: "Slippery slope + fear appeal", zh: "滑坡谬误 + 恐惧诉诸" },
      bypass: {
        en: "It slides 'not buying now' all the way to 'your body collapses', letting fear override reason.",
        zh: "把「现在不买」一路滑到「身体垮掉」的灾难结局,用恐惧覆盖理性。",
      },
      reasoning: {
        en: [
          "Every causal link between 'not acting' and 'your body breaking down' is missing.",
          "The catastrophizing ('it'll all be too late') exists to make you stop weighing options.",
          "Ask: is there really a causal chain between skipping this product and 'your body collapsing'?",
        ],
        zh: [
          "从「不行动」到「身体垮了」之间,缺失了所有因果环节。",
          "灾难化的措辞(「一切都来不及」)是为了让你停止权衡。",
          "追问:不买这款产品,与「身体垮掉」之间真的存在因果链吗?",
        ],
      },
    },
  },
  sourceChecks: [
    {
      claim: {
        en: "90% of doctors recommend this antioxidant capsule",
        zh: "90% 的医生推荐这款抗氧化胶囊",
      },
      verdict: "unfounded",
      summary: {
        en: "No public clinical survey or industry report supports the '90%' figure; the number appears fabricated.",
        zh: "未找到任何公开的临床调查或行业报告支持「90%」这一比例,数字疑为虚构。",
      },
      sources: [
        {
          name: { en: "Public medical-database search", zh: "公开医学数据库检索" },
          note: { en: "no matching survey on record", zh: "无对应调查记录" },
        },
        {
          name: { en: "Drug-regulator disclosures", zh: "药品监管公示" },
          note: { en: "no filing found for this claim", zh: "未见该宣称的备案" },
        },
      ],
    },
    {
      claim: {
        en: "Antioxidant supplements broadly prevent disease",
        zh: "抗氧化补剂可以广泛预防疾病",
      },
      verdict: "exaggerated",
      summary: {
        en: "Current research is cautious about broad benefits from antioxidant supplements; some high-dose intake is itself risky.",
        zh: "现有研究对抗氧化补剂的普遍获益结论谨慎,部分高剂量摄入反而有风险。",
      },
      sources: [
        {
          name: {
            en: "Systematic review (pooled RCTs)",
            zh: "系统综述(多项 RCT 汇总)",
          },
          note: {
            en: "broad preventive effect not confirmed",
            zh: "未证实广泛预防作用",
          },
        },
        {
          name: { en: "Dietary guidelines", zh: "膳食指南" },
          note: {
            en: "recommend getting it from whole foods first",
            zh: "建议优先从天然食物获取",
          },
        },
      ],
    },
  ],
};

/* ── 样本二:社媒帖 ─────────────────────────────────────── */
const socialSegments: Segment[] = [
  seg({ en: "Just now!", zh: "刚刚!" }, "s1"),
  seg({ en: " ", zh: "" }),
  seg({ en: "A well-known expert issues an urgent warning", zh: "知名专家紧急警告" }, "s2"),
  seg({ en: ": ", zh: ":" }),
  seg({ en: "a food you eat every single day", zh: "这种你天天在吃的食物" }, "s3"),
  seg({ en: " is ", zh: "," }),
  seg({ en: "quietly destroying your immune system", zh: "正在悄悄摧毁你的免疫系统" }, "s4"),
  seg({ en: ". ", zh: "。" }),
  seg(
    { en: "Share to warn your family — you'll regret not sharing!", zh: "转发提醒家人,不转后悔!" },
    "s5"
  ),
];

const social: Sample = {
  id: "social",
  kind: { en: "Social post", zh: "社媒帖" },
  segments: socialSegments,
  raw: rawFrom(socialSegments),
  annotations: {
    s1: {
      id: "s1",
      type: "emotion",
      name: { en: "False immediacy", zh: "时效紧迫感" },
      bypass: {
        en: "'Just now!' fakes breaking-news urgency so you share first and check later.",
        zh: "「刚刚!」制造突发感,让你以为是最新独家,先转发再说。",
      },
      reasoning: {
        en: [
          "'Just now' carries no date — posts like this are 'just now' all year round.",
          "The breaking-news frame exists to trigger the urge to share, bypassing verification.",
          "Ask: when exactly? Where is the original source?",
        ],
        zh: [
          "「刚刚」没有日期,这类帖子常年「刚刚」。",
          "突发框架的目的是触发分享冲动,绕过查证。",
          "追问:具体是什么时候?最初的信源在哪里?",
        ],
      },
    },
    s2: {
      id: "s2",
      type: "mislead",
      name: { en: "Anonymous authority", zh: "匿名权威" },
      bypass: {
        en: "A 'well-known expert' with no name borrows authority's halo without offering anything you can verify.",
        zh: "「知名专家」无名无姓,借权威的光环却不提供可核实的来源。",
      },
      reasoning: {
        en: [
          "Which expert? Which institution? Which study? — all missing.",
          "'Urgent warning' wraps an untraceable claim in an official-sounding tone.",
          "Ask: can you find this expert's actual words and where they said them?",
        ],
        zh: [
          "哪位专家?什么机构?哪篇研究?——全部缺失。",
          "「紧急警告」给一个无法定位的说法套上官方语气。",
          "追问:能找到这位专家的原话与出处吗?",
        ],
      },
    },
    s3: {
      id: "s3",
      type: "exaggerate",
      name: { en: "Vague generalization", zh: "模糊普遍化" },
      bypass: {
        en: "'A food you eat every day' makes almost everyone see themselves in it, widening the panic.",
        zh: "「天天在吃」让几乎每个人都对号入座,放大恐慌的覆盖面。",
      },
      reasoning: {
        en: [
          "Which food, exactly? At what dose? For whom, under what conditions?",
          "The vague reference makes anyone feel 'this is about me'.",
          "Ask: what specific substance, dose, and population are we talking about?",
        ],
        zh: [
          "到底是哪种食物?剂量多少?对谁、在什么条件下?",
          "模糊的指代让任何人都觉得「说的就是我」。",
          "追问:具体物质、具体剂量、具体人群是什么?",
        ],
      },
    },
    s4: {
      id: "s4",
      type: "exaggerate",
      name: { en: "Catastrophizing", zh: "灾难化措辞" },
      bypass: {
        en: "'Quietly destroying your immune system' uses an extreme verb to turn uncertain risk into certain ruin.",
        zh: "「悄悄摧毁免疫系统」用极端动词,把不确定的风险说成确定的毁灭。",
      },
      reasoning: {
        en: [
          "'Destroy' is absolute language; real research rarely concludes this way.",
          "'Quietly' implies you can't notice it — and therefore can't argue back.",
          "Ask: is there quantified, reproducible evidence for 'destroy'?",
        ],
        zh: [
          "「摧毁」是绝对化措辞,真实研究极少这样下结论。",
          "「悄悄」暗示你察觉不到,从而无法反驳。",
          "追问:有量化的、可重复的证据支持「摧毁」吗?",
        ],
      },
    },
    s5: {
      id: "s5",
      type: "emotion",
      name: { en: "Coercive call to action", zh: "行动胁迫" },
      bypass: {
        en: "'You'll regret not sharing' ties resharing to 'being responsible for your family', driving spread by guilt.",
        zh: "「不转后悔」把转发与「对家人负责」绑定,用愧疚驱动传播。",
      },
      reasoning: {
        en: [
          "Resharing doesn't change whether the claim is true — it only spreads it further.",
          "'You'll regret not sharing' is emotional coercion, not an argument.",
          "Ask: did I verify this before resharing it?",
        ],
        zh: [
          "转发不会改变信息真假,只会扩大其传播。",
          "「不转后悔」是情绪要挟,不是论据。",
          "追问:在转发前,我核实过这条信息吗?",
        ],
      },
    },
  },
  sourceChecks: [
    {
      claim: {
        en: "Some everyday food 'destroys your immune system'",
        zh: "某种日常食物会「摧毁免疫系统」",
      },
      verdict: "misleading",
      summary: {
        en: "'Destroys your immune system' has no clear referent or dose; it's textbook scaremongering and doesn't match mainstream nutrition science.",
        zh: "「摧毁免疫系统」缺乏明确所指与剂量,属典型危言耸听式表述,与主流营养学结论不符。",
      },
      sources: [
        {
          name: { en: "Authoritative nutrition-body explainer", zh: "权威营养机构科普" },
          note: {
            en: "does not support such absolute conclusions",
            zh: "未支持此类绝对结论",
          },
        },
        {
          name: { en: "Fact-checking archive", zh: "事实核查平台存档" },
          note: {
            en: "similar posts repeatedly flagged as misleading",
            zh: "同类帖子曾被多次标记为误导",
          },
        },
      ],
    },
  ],
};

/* ── 样本三:评论区 ─────────────────────────────────────── */
const commentSegments: Segment[] = [
  seg(
    {
      en: "You won't even support this much — clearly you don't care about everyone's interests at all",
      zh: "你连这点都不支持,可见你根本不在乎大家的利益",
    },
    "c1"
  ),
  seg({ en: ". ", zh: "。" }),
  seg(
    {
      en: "Either you stand with us, or you're one of the other side",
      zh: "要么和我们站在一起,要么就是对立面的人",
    },
    "c2"
  ),
  seg({ en: " — ", zh: "," }),
  seg({ en: "there's no middle ground", zh: "没有中间地带" }, "c3"),
  seg({ en: ".", zh: "。" }),
];

const comment: Sample = {
  id: "comment",
  kind: { en: "Comment-section argument", zh: "评论区" },
  segments: commentSegments,
  raw: rawFrom(commentSegments),
  annotations: {
    c1: {
      id: "c1",
      type: "fallacy",
      name: { en: "Ad hominem / motive-guessing", zh: "诛心 / 人身攻击" },
      bypass: {
        en: "It equates 'not supporting one specific proposal' with 'not caring about people', attacking motive instead of the argument.",
        zh: "把「不支持某具体方案」直接等同于「不在乎大家」,攻击动机而非论点。",
      },
      reasoning: {
        en: [
          "Opposing a proposal isn't the same as opposing the goal the proposal aims at.",
          "It skips any discussion of the proposal itself and slaps a moral label on the person.",
          "Ask: are they against the goal, or against this specific approach?",
        ],
        zh: [
          "反对一个方案,不等于反对方案想达成的目标。",
          "它跳过了对方案本身的讨论,直接给人贴上道德标签。",
          "追问:对方反对的,是「目标」还是「这个具体做法」?",
        ],
      },
    },
    c2: {
      id: "c2",
      type: "fallacy",
      name: { en: "False dilemma", zh: "非黑即白" },
      bypass: {
        en: "It offers only 'with us' or 'enemy', erasing every middle position and third possibility.",
        zh: "只给「站一起」或「敌人」两个选项,抹去一切中间立场与第三种可能。",
      },
      reasoning: {
        en: [
          "In reality there's almost always a 'partly agree, partly reserve judgment' stance.",
          "The either/or frame exists to force you to pick a side and stop scrutinizing.",
          "Ask: are there really only two options? Is there a third or fourth?",
        ],
        zh: [
          "现实中几乎总存在「部分同意、部分保留」的立场。",
          "二选一的框架,是为了逼你站队、停止细究。",
          "追问:真的只有这两个选项吗?有没有第三、第四种?",
        ],
      },
    },
    c3: {
      id: "c3",
      type: "mislead",
      name: { en: "Shutting down nuance", zh: "封堵质疑" },
      bypass: {
        en: "'No middle ground' pre-cancels the space for discussion, making any nuanced position look illegitimate.",
        zh: "「没有中间地带」预先取消了讨论空间,让任何细分立场都显得不正当。",
      },
      reasoning: {
        en: [
          "Claiming 'there's no middle ground' is itself an assertion that needs proving.",
          "Its function is to end the conversation, not to advance understanding.",
          "Ask: why is a middle ground 'not allowed' to exist? Who decided that?",
        ],
        zh: [
          "宣称「没有中间地带」本身就是一个需要被证明的断言。",
          "它的功能是终止对话,而不是推进理解。",
          "追问:为什么中间地带「不被允许」存在?谁定的?",
        ],
      },
    },
  },
  sourceChecks: [
    {
      claim: {
        en: "On this issue, 'not picking a side means you're the enemy'",
        zh: "在该议题上「不站队即为敌人」",
      },
      verdict: "misleading",
      summary: {
        en: "This is a problem of argument structure, not fact: forcing a complex position into a binary doesn't hold up on its own terms.",
        zh: "这是论述结构问题而非事实问题:把复杂立场强行压成二元对立,本身即不成立。",
      },
      sources: [
        {
          name: { en: "Logic: false dilemma", zh: "逻辑学:虚假两难" },
          note: {
            en: "a classic fallacy with a clear definition",
            zh: "经典谬误类型,定义清晰",
          },
        },
        {
          name: { en: "Norms of public debate", zh: "公共讨论规范" },
          note: { en: "encourage separating goals from means", zh: "鼓励区分目标与手段" },
        },
      ],
    },
  ],
};

export const SAMPLES: Sample[] = [marketing, social, comment];

/* Hero 用的开场示例(单句,加载时被「实时批改」) */
const heroSegments: Segment[] = [
  seg({ en: "The experts all say", zh: "专家都说" }, "h1"),
  seg({ en: " this is the ", zh: "这是" }),
  seg({ en: "only", zh: "唯一" }, "h2"),
  seg({ en: " choice — ", zh: "的选择," }),
  seg({ en: "decide now or it's too late", zh: "再不决定就晚了" }, "h3"),
  seg({ en: ".", zh: "。" }),
];

export const HERO_SAMPLE: {
  segments: Segment[];
  annotations: Record<string, Annotation>;
} = {
  segments: heroSegments,
  annotations: {
    h1: {
      id: "h1",
      type: "mislead",
      name: { en: "Appeal to authority", zh: "诉诸权威" },
      bypass: {
        en: "A vague 'the experts' vouches for the claim so you skip the evidence itself.",
        zh: "用模糊的「专家」替你背书,跳过证据本身。",
      },
      reasoning: {
        en: ["Which experts? Which study? — no source given."],
        zh: ["哪位专家?哪篇研究?——没有出处。"],
      },
    },
    h2: {
      id: "h2",
      type: "fallacy",
      name: { en: "False dilemma", zh: "非黑即白" },
      bypass: {
        en: "It compresses many possibilities into 'the only one', forcing you to stop comparing.",
        zh: "把多种可能压成「唯一」,逼你放弃比较。",
      },
      reasoning: {
        en: ["'Only' erases the existence of every other option."],
        zh: ["「唯一」抹掉了其他选项的存在。"],
      },
    },
    h3: {
      id: "h3",
      type: "emotion",
      name: { en: "Urgency", zh: "紧迫感" },
      bypass: {
        en: "It uses time pressure to shrink your thinking window.",
        zh: "用时间压力压缩你的思考窗口。",
      },
      reasoning: {
        en: ["'Too late' manufactures fear rather than providing information."],
        zh: ["「就晚了」制造恐惧,而非提供信息。"],
      },
    },
  },
};
