"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()

  // These pages handle their own nav/logo
  if (pathname === "/" || pathname === "/work" || /^\/work\/.+/.test(pathname)) return null

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
      {/* Top gradient so nav stays readable over any background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/75 via-[#0a0a0a]/20 to-transparent pointer-events-none" />

      {/* Logo */}
      <Link href="/" style={{ position: "relative", zIndex: 10, flexShrink: 0, display: "block" }} aria-label="KLIPVISUAL home">
        <Image
          src="/Logos/Logo.png"
          alt="KLIPVISUAL"
          width={140}
          height={40}
          style={{ height: 40, width: "auto", objectFit: "contain", display: "block" }}
          priority
        />
      </Link>

      {/* Nav links */}
      <ul style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none" }}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="font-mono uppercase hover-underline"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                color: pathname === href || pathname.startsWith(href + "/") ? "#E8181C" : "rgba(240,237,232,0.75)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
