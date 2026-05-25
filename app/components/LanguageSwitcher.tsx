"use client"

import { useLang } from "../i18n/LanguageContext"

interface Props {
  variant?: "dark" | "light"
}

export function LanguageSwitcher({ variant = "dark" }: Props) {
  const { lang, setLang } = useLang()

  const active   = variant === "dark" ? "rgba(240,237,232,0.85)" : "rgba(0,0,0,0.75)"
  const inactive = variant === "dark" ? "rgba(240,237,232,0.28)" : "rgba(0,0,0,0.3)"
  const divider  = variant === "dark" ? "rgba(240,237,232,0.15)" : "rgba(0,0,0,0.15)"

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0,
        fontFamily: "var(--font-space-mono)",
        fontSize: 9,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
      }}
    >
      <button
        onClick={() => setLang("en")}
        style={{
          background: "none",
          border: "none",
          padding: "4px 8px",
          cursor: lang === "en" ? "default" : "pointer",
          color: lang === "en" ? active : inactive,
          fontFamily: "inherit",
          fontSize: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
          transition: "color 0.2s",
        }}
      >
        EN
      </button>
      <span style={{ color: divider, fontSize: 8 }}>|</span>
      <button
        onClick={() => setLang("fr")}
        style={{
          background: "none",
          border: "none",
          padding: "4px 8px",
          cursor: lang === "fr" ? "default" : "pointer",
          color: lang === "fr" ? active : inactive,
          fontFamily: "inherit",
          fontSize: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
          transition: "color 0.2s",
        }}
      >
        FR
      </button>
    </div>
  )
}
