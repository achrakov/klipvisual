"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useLang } from "../i18n/LanguageContext"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { BurgerMenu } from "./BurgerMenu"

export function Navbar() {
  const pathname = usePathname()
  const { t, href } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)

  // Route matching ignores the /en or /fr prefix.
  const route = (pathname || "/").replace(/^\/(en|fr)(?=\/|$)/, "") || "/"
  if (route === "/" || route === "/work" || /^\/work\/.+/.test(route)) return null

  const links = [
    { href: href("/work"),     label: t.nav.work,     match: "/work"     },
    { href: href("/services"), label: t.nav.services, match: "/services" },
    { href: href("/about"),    label: t.nav.about,    match: "/about"    },
    { href: href("/contact"),  label: t.nav.contact,  match: "/contact"  },
  ]

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 8000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.4rem 2.1rem",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/75 via-[#0a0a0a]/20 to-transparent pointer-events-none" />

      <Link href={href("/")} style={{ position: "relative", zIndex: 10, flexShrink: 0, display: "block" }} aria-label="KLIPVISUAL home">
        <Image
          src="/Logos/Logo.png"
          alt="KLIPVISUAL"
          width={140}
          height={40}
          style={{ height: 40, width: "auto", objectFit: "contain", display: "block" }}
          priority
        />
      </Link>

      <div className="m-hide" style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "2rem" }}>
        <ul style={{ display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none" }}>
          {links.map(({ href: linkHref, label, match }) => (
            <li key={match}>
              <Link
                href={linkHref}
                className="font-mono uppercase hover-underline"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  color: route === match || route.startsWith(match + "/") ? "#E8181C" : "rgba(240,237,232,0.75)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <LanguageSwitcher variant="dark" />
      </div>

      {/* Mobile burger */}
      <button
        onClick={() => setMenuOpen(true)}
        aria-label={t.burger.toggleLabel}
        className="hidden max-[768px]:flex"
        style={{ position: "relative", zIndex: 10, flexDirection: "column", gap: 5, padding: "12px 6px", background: "transparent", border: "none" }}
      >
        <span style={{ width: 24, height: 1.5, background: "#f0ede8", display: "block" }} />
        <span style={{ width: 24, height: 1.5, background: "#f0ede8", display: "block" }} />
        <span style={{ width: 24, height: 1.5, background: "#f0ede8", display: "block" }} />
      </button>

      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  )
}
