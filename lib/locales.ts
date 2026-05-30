/* ─────────────────────────────────────────────────────────────
   明辨 / TheTruth — 语言(locale)单一事实来源
   新增一门语言只需三步:
     1) 把语言代码加进下面的 Lang 联合类型 —— 此后 TypeScript 会
        把 lib/i18n.ts 与 lib/fixtures.ts 里每一处尚未翻译的字符串
        标成编译错误,等于自动生成「待翻译清单」;
     2) 在 LOCALES 里补一条 { code, native, htmlLang };
     3) 在 app/layout.tsx 用 next/font 载入该语言字体 + 把其 .variable
        加到 <body>,并在 app/globals.css 加 html[lang="…"] .font-sc 规则。
   ───────────────────────────────────────────────────────────── */

/** 站点支持的语言。新增 "ja" | "ko" 时,先在这里加。 */
export type Lang = "en" | "zh";

/** 默认语言:静态导出的 HTML 以此预渲染。 */
export const DEFAULT_LANG: Lang = "en";

/** mono 小标签固定使用的「点缀语言」(拉丁文)。 */
export const ACCENT_LANG: Lang = "en";

export interface Locale {
  /** 内部语言代码 */
  code: Lang;
  /** 选择器里显示的母语名 */
  native: string;
  /** 写入 <html lang> 的 BCP-47 标签 */
  htmlLang: string;
}

export const LOCALES: Locale[] = [
  { code: "en", native: "English", htmlLang: "en" },
  { code: "zh", native: "简体中文", htmlLang: "zh-CN" },
  // { code: "ja", native: "日本語", htmlLang: "ja" },
  // { code: "ko", native: "한국어", htmlLang: "ko" },
];

/** 语言代码 → <html lang> 标签 */
export const htmlLangOf = (l: Lang): string =>
  LOCALES.find((x) => x.code === l)?.htmlLang ?? LOCALES[0].htmlLang;

/** 运行时类型守卫:校验任意值是否为受支持的语言代码 */
export const isLang = (v: unknown): v is Lang =>
  LOCALES.some((x) => x.code === v);
