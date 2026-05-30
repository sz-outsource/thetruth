"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANG, htmlLangOf, isLang, type Lang } from "./locales";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const STORAGE_KEY = "mb-lang";
const LanguageContext = createContext<LangCtx | null>(null);

/**
 * 站点默认英文。静态导出的 HTML 以英文预渲染,
 * 因此首屏 state 必须是 DEFAULT_LANG —— 挂载后再从 localStorage 读回偏好,
 * 避免水合(hydration)不匹配。
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);

  // 挂载后读取已保存的语言偏好(此时已水合,setLang 仅触发一次重渲染)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) setLang(stored);
    } catch {
      /* localStorage 不可用时静默忽略 */
    }
  }, []);

  // 持久化偏好 + 同步 <html lang>
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = htmlLangOf(lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLangCtx(): LangCtx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLangCtx must be used within <LanguageProvider>");
  }
  return ctx;
}

export function useLang(): Lang {
  return useLangCtx().lang;
}
