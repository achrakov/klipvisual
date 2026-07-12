"use client"

import { createContext, useContext, type ReactNode } from "react"
import { translations, type Lang, type Translations } from "./translations"

interface LangCtx {
  lang: Lang
  /** Prefix a locale-less route with the active locale: href("/work") -> "/fr/work" */
  href: (path: string) => string
  t: Translations
}

const Ctx = createContext<LangCtx>({
  lang: "en",
  href: (p) => `/en${p === "/" ? "" : p}`,
  t: translations.en,
})

/**
 * The locale comes from the URL segment, not from state. That is what makes
 * /en and /fr separately crawlable. There is no setLang: switching language is
 * a navigation, handled by LanguageSwitcher.
 */
export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const href = (path: string) => `/${lang}${path === "/" ? "" : path}`

  return (
    <Ctx.Provider value={{ lang, href, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLang() {
  return useContext(Ctx)
}
