"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const NAV = [
  { num: "01", label: "WORK", href: "/work" },
  { num: "02", label: "SERVICES", href: "/services" },
  { num: "03", label: "ABOUT", href: "/about" },
  { num: "04", label: "CONTACT", href: "/contact" },
]

const CORNER_TRANSFORMS = [
  "translate(-50%, -50%)",
  "translate(50%, -50%)",
  "translate(-50%, 50%)",
  "translate(50%, 50%)",
]

interface BurgerMenuProps {
  open: boolean
  onClose: () => void
}

export function BurgerMenu({ open, onClose }: BurgerMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Invisible backdrop to close on outside click */}
          <motion.div
            className="fixed inset-0 z-[8900]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Ticket panel */}
          <motion.div
            className="fixed top-16 right-4 z-[9100]"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top right" }}
          >
            <div
              style={{
                background: "#f5f0e8",
                borderRadius: 10,
                position: "relative",
                minWidth: 260,
                border: "1px dashed rgba(0,0,0,0.18)",
                overflow: "hidden",
              }}
            >
              {/* Corner punch holes */}
              {CORNER_TRANSFORMS.map((t, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#080808",
                    ...(i === 0 && { top: 0, left: 0 }),
                    ...(i === 1 && { top: 0, right: 0 }),
                    ...(i === 2 && { bottom: 0, left: 0 }),
                    ...(i === 3 && { bottom: 0, right: 0 }),
                    transform: t,
                  }}
                />
              ))}

              {/* Close × */}
              <button
                onClick={onClose}
                aria-label="Close menu"
                style={{
                  position: "absolute",
                  top: 14,
                  right: 16,
                  color: "rgba(0,0,0,0.35)",
                  lineHeight: 1,
                  fontSize: 16,
                  fontWeight: 300,
                }}
                className="hover:text-black/70 transition-colors"
              >
                ×
              </button>

              {/* Nav items */}
              <nav style={{ padding: "28px 28px 16px" }}>
                {NAV.map(({ num, label, href }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.05, duration: 0.28 }}
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      className="group flex items-baseline gap-2.5 hover:opacity-60 transition-opacity"
                      style={{ paddingBottom: 2 }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-space-mono)",
                          fontSize: 9,
                          color: "rgba(0,0,0,0.35)",
                          lineHeight: 1,
                        }}
                      >
                        {num}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontWeight: 800,
                          fontSize: "clamp(2.2rem, 4.5vw, 3rem)",
                          color: "#080808",
                          lineHeight: 1.05,
                          letterSpacing: "-0.01em",
                          textTransform: "uppercase",
                        }}
                      >
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Dashed divider */}
              <div style={{ borderTop: "1px dashed rgba(0,0,0,0.15)", margin: "0 16px" }} />

              {/* Footer */}
              <div style={{ padding: "12px 28px 20px" }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  {["Cookie", "Terms", "Privacy"].map((item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      onClick={onClose}
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: 8,
                        color: "rgba(0,0,0,0.35)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                      className="hover:text-black/60 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>

                {/* Social icons */}
                <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  {/* Instagram */}
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="text-black/40 hover:text-black/70 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="text-black/40 hover:text-black/70 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="text-black/40 hover:text-black/70 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 7.5,
                    color: "rgba(0,0,0,0.25)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  ©{new Date().getFullYear()}. KLIPVISUAL.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
