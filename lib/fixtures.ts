/* ─────────────────────────────────────────────────────────────
   明辨 / TheTruth — 预置样本与分析数据(mock)
   无后端:演示用的「拆解结果」全部在此预先编写。
   文本以「片段(segment)」数组表达:普通文字 + 带 hook 标记的片段,
   避免脆弱的字符偏移,渲染时直接映射。
   ───────────────────────────────────────────────────────────── */

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
  name: string;
  nameEn: string;
  /** 它想在哪一步绕过你的判断 */
  bypass: string;
  /** 逐句追问 / 推理链:把这一步摊开 */
  reasoning: string[];
}

export interface Segment {
  text: string;
  /** 若该片段是一个 hook,给出对应 annotation id */
  annId?: string;
}

export interface SourceCheck {
  claim: string;
  verdict: VerdictType;
  summary: string;
  sources: { name: string; note: string }[];
}

export interface Sample {
  id: string;
  kind: string; // 营销话术 / 社媒帖 / 评论区
  kindEn: string;
  raw: string; // 纯文本(填回输入框)
  segments: Segment[];
  annotations: Record<string, Annotation>;
  sourceChecks: SourceCheck[];
}

/* helper:用普通片段拼出未标注文本 */
const t = (text: string): Segment => ({ text });
const h = (text: string, annId: string): Segment => ({ text, annId });

/* ── 样本一:营销话术 ─────────────────────────────────────── */
const marketing: Sample = {
  id: "marketing",
  kind: "营销话术",
  kindEn: "Marketing copy",
  raw:
    "90% 的医生都在偷偷推荐这款抗氧化胶囊。今天错过限时五折,就是在拿全家人的健康冒险。再不行动,等身体垮了一切都来不及了。",
  segments: [
    h("90% 的医生都在偷偷推荐", "m1"),
    t("这款抗氧化胶囊。今天错过"),
    h("限时五折", "m2"),
    t(",就是在"),
    h("拿全家人的健康冒险", "m3"),
    t("。再不行动,"),
    h("等身体垮了一切都来不及了", "m4"),
    t("。"),
  ],
  annotations: {
    m1: {
      id: "m1",
      type: "mislead",
      name: "诉诸权威 + 伪造数据",
      nameEn: "Appeal to authority + fabricated statistic",
      bypass: "用一个具体到「90%」的数字 + 「医生」身份,让你跳过「这个数据从哪来」的核实。",
      reasoning: [
        "「90%」精确得可疑——没有给出调查机构、样本量与时间。",
        "「都在偷偷」既无法证实,也无法证伪,却暗示了一种内部共识。",
        "把判断外包给「医生」这一权威标签,而非药品本身的证据。",
        "追问:哪一项公开研究支持这个比例?谁出钱做的?",
      ],
    },
    m2: {
      id: "m2",
      type: "emotion",
      name: "稀缺与紧迫",
      nameEn: "Scarcity & urgency",
      bypass: "用「限时」制造时间压力,让你来不及比价、来不及查成分就下单。",
      reasoning: [
        "「限时五折」几乎是长期常驻的促销话术,稀缺往往是人为制造的。",
        "紧迫感的作用是压缩你的思考窗口,而非传递任何关于产品的信息。",
        "追问:这个价格是否一直如此?「原价」是否真实存在过?",
      ],
    },
    m3: {
      id: "m3",
      type: "emotion",
      name: "情绪绑架",
      nameEn: "Emotional blackmail",
      bypass: "把「不买」重新框定为「拿家人冒险」,用愧疚感替你做决定。",
      reasoning: [
        "购买与否,被偷换成「你是否爱家人」的道德选择。",
        "这是一个虚假两难:不买 ≠ 让家人冒险。",
        "追问:有任何证据表明不吃这款胶囊会损害家人健康吗?",
      ],
    },
    m4: {
      id: "m4",
      type: "fallacy",
      name: "滑坡谬误 + 恐惧诉诸",
      nameEn: "Slippery slope + fear appeal",
      bypass: "把「现在不买」一路滑到「身体垮掉」的灾难结局,用恐惧覆盖理性。",
      reasoning: [
        "从「不行动」到「身体垮了」之间,缺失了所有因果环节。",
        "灾难化的措辞(「一切都来不及」)是为了让你停止权衡。",
        "追问:不买这款产品,与「身体垮掉」之间真的存在因果链吗?",
      ],
    },
  },
  sourceChecks: [
    {
      claim: "90% 的医生推荐这款抗氧化胶囊",
      verdict: "unfounded",
      summary: "未找到任何公开的临床调查或行业报告支持「90%」这一比例,数字疑为虚构。",
      sources: [
        { name: "公开医学数据库检索", note: "无对应调查记录" },
        { name: "药品监管公示", note: "未见该宣称的备案" },
      ],
    },
    {
      claim: "抗氧化补剂可以广泛预防疾病",
      verdict: "exaggerated",
      summary: "现有研究对抗氧化补剂的普遍获益结论谨慎,部分高剂量摄入反而有风险。",
      sources: [
        { name: "系统综述(多项 RCT 汇总)", note: "未证实广泛预防作用" },
        { name: "膳食指南", note: "建议优先从天然食物获取" },
      ],
    },
  ],
};

/* ── 样本二:社媒帖 ─────────────────────────────────────── */
const social: Sample = {
  id: "social",
  kind: "社媒帖",
  kindEn: "Social post",
  raw:
    "刚刚!知名专家紧急警告:这种你天天在吃的食物,正在悄悄摧毁你的免疫系统。转发提醒家人,不转后悔!",
  segments: [
    h("刚刚!", "s1"),
    h("知名专家紧急警告", "s2"),
    t(":"),
    h("这种你天天在吃的食物", "s3"),
    t(","),
    h("正在悄悄摧毁你的免疫系统", "s4"),
    t("。"),
    h("转发提醒家人,不转后悔!", "s5"),
  ],
  annotations: {
    s1: {
      id: "s1",
      type: "emotion",
      name: "时效紧迫感",
      nameEn: "False immediacy",
      bypass: "「刚刚!」制造突发感,让你以为是最新独家,先转发再说。",
      reasoning: [
        "「刚刚」没有日期,这类帖子常年「刚刚」。",
        "突发框架的目的是触发分享冲动,绕过查证。",
        "追问:具体是什么时候?最初的信源在哪里?",
      ],
    },
    s2: {
      id: "s2",
      type: "mislead",
      name: "匿名权威",
      nameEn: "Anonymous authority",
      bypass: "「知名专家」无名无姓,借权威的光环却不提供可核实的来源。",
      reasoning: [
        "哪位专家?什么机构?哪篇研究?——全部缺失。",
        "「紧急警告」给一个无法定位的说法套上官方语气。",
        "追问:能找到这位专家的原话与出处吗?",
      ],
    },
    s3: {
      id: "s3",
      type: "exaggerate",
      name: "模糊普遍化",
      nameEn: "Vague generalization",
      bypass: "「天天在吃」让几乎每个人都对号入座,放大恐慌的覆盖面。",
      reasoning: [
        "到底是哪种食物?剂量多少?对谁、在什么条件下?",
        "模糊的指代让任何人都觉得「说的就是我」。",
        "追问:具体物质、具体剂量、具体人群是什么?",
      ],
    },
    s4: {
      id: "s4",
      type: "exaggerate",
      name: "灾难化措辞",
      nameEn: "Catastrophizing",
      bypass: "「悄悄摧毁免疫系统」用极端动词,把不确定的风险说成确定的毁灭。",
      reasoning: [
        "「摧毁」是绝对化措辞,真实研究极少这样下结论。",
        "「悄悄」暗示你察觉不到,从而无法反驳。",
        "追问:有量化的、可重复的证据支持「摧毁」吗?",
      ],
    },
    s5: {
      id: "s5",
      type: "emotion",
      name: "行动胁迫",
      nameEn: "Coercive call-to-action",
      bypass: "「不转后悔」把转发与「对家人负责」绑定,用愧疚驱动传播。",
      reasoning: [
        "转发不会改变信息真假,只会扩大其传播。",
        "「不转后悔」是情绪要挟,不是论据。",
        "追问:在转发前,我核实过这条信息吗?",
      ],
    },
  },
  sourceChecks: [
    {
      claim: "某种日常食物会「摧毁免疫系统」",
      verdict: "misleading",
      summary: "「摧毁免疫系统」缺乏明确所指与剂量,属典型危言耸听式表述,与主流营养学结论不符。",
      sources: [
        { name: "权威营养机构科普", note: "未支持此类绝对结论" },
        { name: "事实核查平台存档", note: "同类帖子曾被多次标记为误导" },
      ],
    },
  ],
};

/* ── 样本三:评论区 ─────────────────────────────────────── */
const comment: Sample = {
  id: "comment",
  kind: "评论区",
  kindEn: "Comment-section argument",
  raw:
    "你连这点都不支持,可见你根本不在乎大家的利益。要么和我们站在一起,要么就是对立面的人,没有中间地带。",
  segments: [
    h("你连这点都不支持,可见你根本不在乎大家的利益", "c1"),
    t("。"),
    h("要么和我们站在一起,要么就是对立面的人", "c2"),
    t(","),
    h("没有中间地带", "c3"),
    t("。"),
  ],
  annotations: {
    c1: {
      id: "c1",
      type: "fallacy",
      name: "诛心 / 人身攻击",
      nameEn: "Ad hominem / motive-guessing",
      bypass: "把「不支持某具体方案」直接等同于「不在乎大家」,攻击动机而非论点。",
      reasoning: [
        "反对一个方案,不等于反对方案想达成的目标。",
        "它跳过了对方案本身的讨论,直接给人贴上道德标签。",
        "追问:对方反对的,是「目标」还是「这个具体做法」?",
      ],
    },
    c2: {
      id: "c2",
      type: "fallacy",
      name: "非黑即白",
      nameEn: "False dilemma",
      bypass: "只给「站一起」或「敌人」两个选项,抹去一切中间立场与第三种可能。",
      reasoning: [
        "现实中几乎总存在「部分同意、部分保留」的立场。",
        "二选一的框架,是为了逼你站队、停止细究。",
        "追问:真的只有这两个选项吗?有没有第三、第四种?",
      ],
    },
    c3: {
      id: "c3",
      type: "mislead",
      name: "封堵质疑",
      nameEn: "Shutting down nuance",
      bypass: "「没有中间地带」预先取消了讨论空间,让任何细分立场都显得不正当。",
      reasoning: [
        "宣称「没有中间地带」本身就是一个需要被证明的断言。",
        "它的功能是终止对话,而不是推进理解。",
        "追问:为什么中间地带「不被允许」存在?谁定的?",
      ],
    },
  },
  sourceChecks: [
    {
      claim: "在该议题上「不站队即为敌人」",
      verdict: "misleading",
      summary: "这是论述结构问题而非事实问题:把复杂立场强行压成二元对立,本身即不成立。",
      sources: [
        { name: "逻辑学:虚假两难", note: "经典谬误类型,定义清晰" },
        { name: "公共讨论规范", note: "鼓励区分目标与手段" },
      ],
    },
  ],
};

export const SAMPLES: Sample[] = [marketing, social, comment];

/* Hero 用的开场示例(单句,加载时被「实时批改」) */
export const HERO_SAMPLE: { segments: Segment[]; annotations: Record<string, Annotation> } = {
  segments: [
    h("专家都说", "h1"),
    t("这是"),
    h("唯一", "h2"),
    t("的选择,"),
    h("再不决定就晚了", "h3"),
    t("。"),
  ],
  annotations: {
    h1: {
      id: "h1",
      type: "mislead",
      name: "诉诸权威",
      nameEn: "Appeal to authority",
      bypass: "用模糊的「专家」替你背书,跳过证据本身。",
      reasoning: ["哪位专家?哪篇研究?——没有出处。"],
    },
    h2: {
      id: "h2",
      type: "fallacy",
      name: "非黑即白",
      nameEn: "False dilemma",
      bypass: "把多种可能压成「唯一」,逼你放弃比较。",
      reasoning: ["「唯一」抹掉了其他选项的存在。"],
    },
    h3: {
      id: "h3",
      type: "emotion",
      name: "紧迫感",
      nameEn: "Urgency",
      bypass: "用时间压力压缩你的思考窗口。",
      reasoning: ["「就晚了」制造恐惧,而非提供信息。"],
    },
  },
};
