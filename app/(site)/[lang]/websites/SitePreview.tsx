"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import { useLang } from "@/app/i18n/LanguageContext"
import type { WebsiteProject } from "@/app/data/websites"

// Timeline of one page: hold at the top, scroll to the bottom, hold, fade to the next.
const HOLD_TOP = 900
const HOLD_END = 1100
const STATIC_HOLD = 2600 // pages that fit in one screen just sit for a moment
const MS_PER_SCREEN = 1500
const FADE = 0.6
const SCROLL_EASE = [0.45, 0, 0.55, 1] as const

// Real macOS window buttons.
const TRAFFIC = ["#FF5F57", "#FEBC2E", "#28C840"]

/**
 * Plays a website inside a browser window (and a phone, in sync): each page
 * scrolls from top to bottom, the address bar follows, then it fades to the
 * next page. Runs only while on screen; stays on the first page if the visitor
 * prefers reduced motion. The chips under it jump to any page.
 */
export function SitePreview({ site }: { site: WebsiteProject }) {
  const { lang } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(0)
  const playing = inView && !reduce

  const pages = site.pages
  const page = pages[idx]
  const scrollMs = Math.max(0, page.desktopH / 900 - 1) * MS_PER_SCREEN
  const pageMs = scrollMs > 0 ? HOLD_TOP + scrollMs + HOLD_END : STATIC_HOLD
  // translateY(%) is relative to the image's own height: shift so its bottom meets the frame's.
  const dShift = (1 - 900 / page.desktopH) * 100
  const mShift = (1 - 844 / page.mobileH) * 100
  const host = site.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

  useEffect(() => {
    if (!playing) return
    const t = setTimeout(() => setIdx((i) => (i + 1) % pages.length), pageMs)
    return () => clearTimeout(t)
  }, [playing, idx, pageMs, pages.length])

  // Warm the next page so the fade never shows an empty frame.
  useEffect(() => {
    const next = pages[(idx + 1) % pages.length]
    for (const src of [next.desktop, next.mobile]) {
      const img = new Image()
      img.src = src
    }
  }, [idx, pages])

  const scroll = (shift: number) => ({
    initial: { opacity: 0, y: "0%" },
    animate: { opacity: 1, y: playing && scrollMs > 0 ? `-${shift}%` : "0%" },
    exit: { opacity: 0 },
    transition: {
      opacity: { duration: FADE },
      y: { delay: HOLD_TOP / 1000, duration: scrollMs / 1000, ease: SCROLL_EASE },
    },
  })

  return (
    <div ref={ref}>
      <div style={{ position: "relative", paddingBottom: "6%", paddingRight: "7%" }}>
        {/* Browser window */}
        <div
          style={{
            border: "1px solid #1f1f1f",
            borderRadius: 10,
            overflow: "hidden",
            background: "#111",
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderBottom: "1px solid #1a1a1a", background: "#141414" }}>
            {TRAFFIC.map((c) => (
              <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.25)" }} />
            ))}
            <span
              className="font-mono"
              style={{
                marginLeft: 14,
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "#777",
                background: "#0a0a0a",
                padding: "5px 14px",
                borderRadius: 999,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {host}
              <span style={{ color: "#444" }}>{page.path}</span>
            </span>
          </div>
          <div style={{ position: "relative", aspectRatio: "1440 / 900", overflow: "hidden", background: "#0a0a0a" }}>
            <AnimatePresence initial={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                key={`d-${idx}`}
                src={page.desktop}
                alt={`${site.name} · ${page.label[lang]}`}
                draggable={false}
                {...scroll(dShift)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "auto", display: "block" }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Phone */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "24%",
            borderRadius: 20,
            border: "5px solid #1c1c1c",
            outline: "1px solid #2a2a2a",
            overflow: "hidden",
            background: "#0a0a0a",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.95)",
          }}
        >
          <div style={{ position: "relative", aspectRatio: "390 / 844", overflow: "hidden" }}>
            <AnimatePresence initial={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                key={`m-${idx}`}
                src={page.mobile}
                alt=""
                aria-hidden
                draggable={false}
                {...scroll(mShift)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "auto", display: "block" }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Page chips: where we are, and a shortcut to any page */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 22 }}>
        {pages.map((p, i) => {
          const active = i === idx
          return (
            <button
              key={p.path}
              type="button"
              onClick={() => setIdx(i)}
              className="font-mono uppercase"
              style={{
                position: "relative",
                overflow: "hidden",
                fontSize: 9,
                letterSpacing: "0.2em",
                padding: "8px 12px",
                border: `1px solid ${active ? "rgba(240,237,232,0.3)" : "#1f1f1f"}`,
                color: active ? "#f0ede8" : "#555",
                background: "transparent",
                cursor: "pointer",
                transition: "color 0.3s ease, border-color 0.3s ease",
              }}
            >
              {p.label[lang]}
              {active && playing && (
                <motion.span
                  key={`bar-${idx}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: pageMs / 1000, ease: "linear" }}
                  style={{ position: "absolute", left: 0, bottom: 0, height: 1, background: "#E8181C" }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
