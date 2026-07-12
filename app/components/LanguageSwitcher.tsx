"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLang } from "../i18n/LanguageContext"
import type { Lang } from "../i18n/translations"

interface Props {
  variant?: "dark" | "light"
}

const LOCALES: Lang[] = ["en", "fr"]

/**
 * Real links, not buttons. Google has to be able to crawl from /en/work to
 * /fr/work, which it cannot do through an onClick handler.
 */
export function LanguageSwitcher({ variant = "dark" }: Props) {
  const { lang } = useLang()
  const pathname = usePathname() || `/${lang}`

  // Swap the leading locale segment, keep the rest of the path.
  const swapTo = (target: Lang) => {
    const rest = pathname.replace(/^\/(en|fr)(?=\/|$)/, "")
    return `/${target}${rest}`
  }

  const active = variant === "dark" ? "rgba(240,237,232,0.85)" : "rgba(0,0,0,0.75)"
  const inactive = variant === "dark" ? "rgba(240,237,232,0.28)" : "rgba(0,0,0,0.3)"
  const divider = variant === "dark" ? "rgba(240,237,232,0.15)" : "rgba(0,0,0,0.15)"

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
      {LOCALES.map((l, i) => (
        <span key={l} style={{ display: "inline-flex", alignItems: "center" }}>
          {i > 0 && <span style={{ color: divider, fontSize: 8 }}>|</span>}
          <Link
            href={swapTo(l)}
            hrefLang={l}
            aria-current={lang === l ? "true" : undefined}
            style={{
              padding: "4px 8px",
              cursor: lang === l ? "default" : "pointer",
              color: lang === l ? active : inactive,
              textDecoration: "none",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              transition: "color 0.2s",
            }}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  )
}
