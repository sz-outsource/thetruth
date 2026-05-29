import type { Metadata } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://mingbian.ai"),
  title: "明辨 TheTruth — 看见被设计过的说服",
  description:
    "明辨(TheTruth)是一个由 AI 智能体驱动的核查与思辨工具。把藏在文字里的「钩子」一个个摊到台面上:识别逻辑谬误与诱导修辞、对照多方来源核查、把推理还原成可逐句追问的链条——目标不是替你下结论,而是把判断力还给你。",
  keywords: ["事实核查", "逻辑谬误", "媒介素养", "独立思考", "fact-checking", "critical thinking", "明辨", "TheTruth"],
  openGraph: {
    title: "明辨 TheTruth — 看见被设计过的说服",
    description:
      "把藏在文字里的「钩子」摊到台面上,让独立思考与客观判断重新回到每个普通人手边。",
    url: "https://mingbian.ai",
    siteName: "明辨 TheTruth",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "明辨 TheTruth — 看见被设计过的说服",
    description: "把藏在文字里的「钩子」摊到台面上。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable} ${notoSerifSC.variable}`}
      >
        <div id="__app">{children}</div>
      </body>
    </html>
  );
}
