"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Lang, type Translations } from "./translations"

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const Ctx = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
})

const STORAGE_KEY = "klip_lang"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored === "en" || stored === "fr") setLangState(stored)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLang() {
  return useContext(Ctx)
}
