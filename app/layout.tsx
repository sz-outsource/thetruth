import type { Metadata } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

// ── 新增语言时:在此用 next/font 载入字体并暴露 CSS 变量,例如
//   const notoSerifJP = Noto_Serif_JP({ variable: "--font-jp", display: "swap" });
//   const notoSerifKR = Noto_Serif_KR({ variable: "--font-kr", display: "swap" });
// 然后把其 .variable 加进 <body> 的 className,并在 globals.css 取消对应规则注释。
// 同时在 lib/locales.ts 的 LOCALES 里补一条 locale。

export const metadata: Metadata = {
  metadataBase: new URL("https://mingbian.ai"),
  title: "TheTruth 明辨 — See the persuasion that was engineered",
  description:
    "TheTruth (明辨) is an AI-agent-driven fact-checking and critical-thinking tool. It drags the 'hooks' hidden in text out into the open: spotting logical fallacies and loaded rhetoric, cross-checking against multiple sources, and restoring the reasoning into a chain you can question line by line — its goal isn't to decide for you, but to give your judgment back.",
  keywords: [
    "fact-checking",
    "critical thinking",
    "logical fallacies",
    "media literacy",
    "independent thinking",
    "TheTruth",
    "明辨",
  ],
  openGraph: {
    title: "TheTruth 明辨 — See the persuasion that was engineered",
    description:
      "Drag the 'hooks' hidden in text out into the open, and put independent, clear-eyed judgment back within everyone's reach.",
    url: "https://mingbian.ai",
    siteName: "TheTruth 明辨",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheTruth 明辨 — See the persuasion that was engineered",
    description: "Drag the 'hooks' hidden in text out into the open.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* 水合前根据已保存偏好修正 <html lang>(仅属性,不改文本,避免不匹配)。
            新增语言时,在下面的映射里补一项 code→BCP-47。 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m={zh:'zh-CN',ja:'ja',ko:'ko'},l=localStorage.getItem('mb-lang');if(m[l])document.documentElement.lang=m[l];}catch(e){}",
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable} ${notoSerifSC.variable}`}
      >
        <LanguageProvider>
          <div id="__app">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
