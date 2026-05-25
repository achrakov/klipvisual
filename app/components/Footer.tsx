"use client"

import Link from "next/link"
import Image from "next/image"
import { useLang } from "../i18n/LanguageContext"

export function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLang()

  const navLinks = [
    { label: t.nav.work,     href: "/work"     },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.about,    href: "/about"    },
    { label: t.nav.contact,  href: "/contact"  },
  ]

  return (
    <footer style={{ borderTop: "1px solid #1f1f1f", background: "#0a0a0a", padding: "64px 40px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "48px 40px", marginBottom: 48 }}
        >
          <div>
            <Image
              src="/Logos/Logo.png"
              alt="KLIPVISUAL"
              width={110}
              height={28}
              style={{ height: 28, width: "auto", objectFit: "contain", display: "block", marginBottom: 16 }}
            />
            <p
              className="font-sans text-[#555] font-light leading-relaxed"
              style={{ fontSize: 13, maxWidth: 240, whiteSpace: "pre-line" }}
            >
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <p
              className="font-mono text-[#555] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 20 }}
            >
              {t.footer.navigation}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover-underline"
                    style={{ fontSize: 14, color: "rgba(240,237,232,0.65)", transition: "color 0.2s" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="font-mono text-[#555] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 20 }}
            >
              {t.footer.getInTouch}
            </p>
            <a
              href="mailto:hello@klipvisual.com"
              className="hover-underline"
              style={{ fontSize: 14, color: "rgba(240,237,232,0.65)", display: "block", marginBottom: 8 }}
            >
              hello@klipvisual.com
            </a>
            <p style={{ fontSize: 14, color: "#555" }}>{t.footer.location}</p>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center"
          style={{ paddingTop: 24, borderTop: "1px solid #1f1f1f", gap: 12 }}
        >
          <p
            className="font-mono text-[#555] uppercase"
            style={{ fontSize: 10, letterSpacing: "0.12em" }}
          >
            © {year} KLIPVISUAL. {t.footer.copyright}
          </p>
          <p
            className="font-mono text-[#555] uppercase"
            style={{ fontSize: 10, letterSpacing: "0.12em" }}
          >
            {t.footer.cities}
          </p>
        </div>
      </div>
    </footer>
  )
}
