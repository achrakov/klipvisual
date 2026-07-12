"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { projects } from "@/app/data/projects"
import { useLang } from "@/app/i18n/LanguageContext"
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher"
import { BurgerMenu } from "@/app/components/BurgerMenu"

const GAP = 20
const LERP = 0.075
const FRICTION = 0.86
const SCROLL_MUL = 0.38
const DRAG_MUL = 1.0

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export default function WorkPage() {
  const trackRef = useRef<HTMLDivElement>(null)
  const xTarget = useRef(0)
  const xLerped = useRef(0)
  const vel = useRef(0)
  const rafRef = useRef<number>(0)
  const drag = useRef({ active: false, startX: 0, startOffset: 0, lastVel: 0 })
  const [activeIdx, setActiveIdx] = useState(0)
  const [blurVal, setBlurVal] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isPhone, setIsPhone] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Wider cards on phones so they're not tiny stamps; matches the CSS width below.
  const cardW = () => Math.min(window.innerWidth * (window.innerWidth < 600 ? 0.72 : 0.33), 416)
  const maxX = () => -(projects.length - 1) * (cardW() + GAP)
  const cardCss = isPhone ? "min(72vw, 26rem)" : "min(33vw, 26rem)"

  useEffect(() => {
    setMounted(true)
    const checkPhone = () => setIsPhone(window.innerWidth < 600)
    checkPhone()
    window.addEventListener("resize", checkPhone)
    return () => window.removeEventListener("resize", checkPhone)
  }, [])

  useEffect(() => {
    const tick = () => {
      vel.current *= FRICTION
      xTarget.current = clamp(xTarget.current + vel.current, maxX(), 0)
      xLerped.current += (xTarget.current - xLerped.current) * LERP

      const speed = Math.abs(vel.current)
      setBlurVal(clamp(speed * 0.055, 0, 7))

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${xLerped.current}px)`
      }

      const idx = clamp(Math.round(-xLerped.current / (cardW() + GAP)), 0, projects.length - 1)
      setActiveIdx(idx)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      vel.current -= e.deltaY * SCROLL_MUL
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { active: true, startX: e.clientX, startOffset: xTarget.current, lastVel: 0 }
    vel.current = 0
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    const next = clamp(drag.current.startOffset + dx * DRAG_MUL, maxX(), 0)
    drag.current.lastVel = next - xTarget.current
    xTarget.current = next
    vel.current = 0
  }

  const onPointerUp = () => {
    vel.current = drag.current.lastVel * 9
    drag.current.active = false
  }

  const { t, href } = useLang()

  if (!mounted) return null

  return (
    <div
      style={{
        height: "100svh",
        overflow: "hidden",
        background: "#0a0a0a",
        position: "relative",
        cursor: "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Fixed top nav */}
      <nav
        onPointerDown={e => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.4rem 2.1rem",
        }}
      >
        <a href={href("/")} draggable={false}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logos/Logo.png"
            alt="KLIPVISUAL"
            style={{ height: 32, width: "auto", objectFit: "contain", display: "block" }}
            draggable={false}
          />
        </a>
        <div className="m-hide" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {[{ href: "/services", label: t.nav.services }, { href: "/about", label: t.nav.about }, { href: "/contact", label: t.nav.contact }].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-mono uppercase hover-underline"
              style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(240,237,232,0.5)", textDecoration: "none", outline: "none", transition: "color 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,237,232,0.5)")}
            >
              {label}
            </a>
          ))}
          <LanguageSwitcher variant="dark" />
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(true)}
          onPointerDown={e => e.stopPropagation()}
          aria-label={t.burger.toggleLabel}
          className="hidden max-[768px]:flex"
          style={{ flexDirection: "column", gap: 5, padding: "12px 6px", background: "transparent", border: "none" }}
        >
          <span style={{ width: 24, height: 1.5, background: "#f0ede8", display: "block" }} />
          <span style={{ width: 24, height: 1.5, background: "#f0ede8", display: "block" }} />
          <span style={{ width: 24, height: 1.5, background: "#f0ede8", display: "block" }} />
        </button>
      </nav>

      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Vertical center guide line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 1,
          background: "linear-gradient(to bottom, transparent 0%, rgba(240,237,232,0.07) 20%, rgba(240,237,232,0.07) 80%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 5,
          transform: "translateX(-0.5px)",
        }}
      />

      {/* Carousel wrapper — centered vertically, paddingLeft centers card 0 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: GAP,
            alignItems: "center",
            paddingLeft: `calc(50vw - ${cardCss} / 2)`,
            paddingRight: `calc(50vw - ${cardCss} / 2)`,
            willChange: "transform",
            filter: blurVal > 0.4 ? `blur(${blurVal}px)` : "none",
          }}
        >
          {projects.map((project, i) => {
            const isActive = i === activeIdx
            return (
              <Link
                key={project.slug}
                href={href(`/work/${project.slug}`)}
                draggable={false}
                onClick={e => {
                  if (Math.abs(vel.current) > 1.5 || drag.current.active) e.preventDefault()
                }}
                style={{
                  flexShrink: 0,
                  width: cardCss,
                  aspectRatio: "1 / 1.635",
                  borderRadius: 6,
                  overflow: "hidden",
                  position: "relative",
                  opacity: isActive ? 1 : 0.55,
                  transform: `scale(${isActive ? 1 : 0.93}) translateY(${isActive ? 0 : 18}px)`,
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  pointerEvents: "auto",
                  display: "block",
                }}
              >
                {/* Cover image */}
                {(() => {
                  const src = project.workCover ?? project.cover
                  const pos = project.imagePositions?.[src]
                  const s = pos?.scale ?? 1
                  const x = pos?.x ?? 50
                  const y = pos?.y ?? 50
                  const posStyle: React.CSSProperties = {
                    objectPosition: pos ? `${x}% ${y}%` : "center",
                    ...(s !== 1 ? { transform: `scale(${s})`, transformOrigin: `${x}% ${y}%` } : {}),
                  }
                  return (
                    <img
                      src={src}
                      alt={project.shortTitle}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        pointerEvents: "none",
                        ...posStyle,
                      }}
                      draggable={false}
                    />
                  )
                })()}

                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.08) 50%, transparent 70%)",
                  }}
                />

                {/* Film grain */}
                <div
                  className="grain-overlay-frame absolute inset-0 pointer-events-none"
                  style={{ zIndex: 4 }}
                  aria-hidden
                />

                {/* Card text */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1rem 1rem 1.4rem",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                >
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.3em",
                      marginBottom: "0.7rem",
                      color: "rgba(240,237,232,0.4)",
                    }}
                  >
                    {project.category.split("+")[0].trim()}
                  </p>
                  <h2
                    className="font-display font-bold uppercase"
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 3rem)",
                      lineHeight: "0.85em",
                      letterSpacing: "-0.03em",
                      color: "#f0ede8",
                      width: "9ch",
                      maxWidth: "100%",
                    }}
                  >
                    {project.shortTitle.split(" ").map((w, j) => (
                      <span key={j} style={{ display: "block" }}>{w}</span>
                    ))}
                  </h2>
                  <p
                    className="font-mono"
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.3em",
                      marginTop: "0.8rem",
                      color: "rgba(240,237,232,0.28)",
                    }}
                  >
                    {project.year}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Top center — active category */}
      <div
        style={{
          position: "absolute",
          top: "7rem",
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <p
          className="font-mono uppercase"
          style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "rgba(240,237,232,0.3)" }}
        >
          {projects[activeIdx]?.category.split("+")[0].trim()}
        </p>
      </div>

      {/* Bottom UI */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 2.1rem",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {/* Left — hint */}
        <span
          className="font-mono uppercase"
          style={{ fontSize: "0.55rem", letterSpacing: "0.25em", color: "rgba(240,237,232,0.22)" }}
        >
          {t.work.drag}
        </span>

        {/* Center — tick indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {projects.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIdx ? 22 : 3,
                height: 1,
                background: i === activeIdx ? "#f0ede8" : "rgba(240,237,232,0.22)",
                transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s ease",
                borderRadius: 1,
              }}
            />
          ))}
        </div>

        {/* Right — counter */}
        <span
          className="font-mono m-hide"
          style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(240,237,232,0.38)" }}
        >
          {String(activeIdx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      {/* Explore button — links to active project */}
      <div style={{ position: "absolute", bottom: "2rem", right: "2.1rem", zIndex: 20 }}>
        <Link
          href={href(`/work/${projects[activeIdx]?.slug}`)}
          onPointerDown={e => e.stopPropagation()}
          className="group flex items-center gap-3 font-mono uppercase overflow-hidden"
          style={{
            border: "1px solid rgba(240,237,232,0.25)",
            padding: "12px 20px",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "#f0ede8",
            textDecoration: "none",
            position: "relative",
            transition: "border-color 0.3s ease",
          }}
        >
          <span
            className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-400"
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          />
          <span className="relative z-10">{t.work.explore}</span>
          <span className="relative z-10">→</span>
        </Link>
      </div>
    </div>
  )
}
