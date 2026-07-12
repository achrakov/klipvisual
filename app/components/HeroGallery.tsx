"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { projects } from "../data/projects"
import { ScrambleText } from "./ScrambleText"
import { ScrollCursor } from "./ScrollCursor"
import { FilmTicket } from "./FilmTicket"
import { BurgerMenu } from "./BurgerMenu"
import { useLang } from "../i18n/LanguageContext"

/* Slightly uneven radii — each corner differs by 1-2px for the retro projected-film feel */
const FRAME_RADIUS = "10px 12px 11px 10px / 11px 10px 12px 10px"

export function HeroGallery() {
  const { href } = useLang()
  const [active, setActive] = useState(0)
  const [locked, setLocked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const wheelAccum = useRef(0)
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)

  const project = projects[active]
  const nextProject = projects[active + 1] ?? null

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const next = active + dir
      if (next < 0 || locked) return
      if (next >= projects.length) {
        if (dir === 1) {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
        return
      }
      setActive(next)
      setLocked(true)
      setTimeout(() => setLocked(false), 600)
    },
    [active, locked]
  )

  const goTo = useCallback(
    (i: number) => {
      if (i === active || locked) return
      setActive(i)
      setLocked(true)
      setTimeout(() => setLocked(false), 600)
    },
    [active, locked]
  )

  /* ── Touch detection: keep the hero a simple, natively-scrollable section on phones ── */
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches)
  }, [])

  /* ── Wheel ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section || isTouch) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      wheelAccum.current += e.deltaY
      if (wheelTimer.current) clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => {
        if (Math.abs(wheelAccum.current) > 30) navigate(wheelAccum.current > 0 ? 1 : -1)
        wheelAccum.current = 0
      }, 40)
    }
    section.addEventListener("wheel", onWheel, { passive: false })
    return () => section.removeEventListener("wheel", onWheel)
  }, [navigate, isTouch])

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") navigate(1)
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") navigate(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  /* ── Drag / swipe (desktop only; phones scroll the page natively) ── */
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (isTouch) return
    dragStart.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (isTouch || !dragStart.current) return
    const dy = e.clientY - dragStart.current.y
    const dx = e.clientX - dragStart.current.x
    if (Math.abs(dy) > 60 || Math.abs(dx) > 60) navigate(dy > 0 || dx > 0 ? -1 : 1)
    dragStart.current = null
  }

  return (
    <section
      ref={sectionRef}
      {...(isTouch ? {} : { "data-lenis-prevent": true })}
      className="relative h-screen bg-[#080808] overflow-hidden select-none"
      style={{ touchAction: isTouch ? "auto" : "none" }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* ── Logo — top left ── */}
      <div
        className="absolute z-[8400]"
        style={{ top: 12, left: 28 }}
      >
        <Link href={href("/")} aria-label="KLIPVISUAL home">
          <Image
            src="/Logos/Logo.png"
            alt="KLIPVISUAL"
            width={160}
            height={42}
            style={{ height: 42, width: "auto", objectFit: "contain", display: "block" }}
            priority
          />
        </Link>
      </div>

      {/* ══════════════════════════════════════════
          FILM FRAME — the main cinema screen
      ══════════════════════════════════════════ */}
      <div
        ref={frameRef}
        className="absolute overflow-hidden hero-frame"
        style={{
          top: 66,
          left: 28,
          right: 28,
          bottom: 68,
          borderRadius: FRAME_RADIUS,
          /* Retro inset vignette — mimics a physical projector frame */
          boxShadow:
            "inset 0 0 90px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* ── Background image (crossfade on change) ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${active}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={project.cover}
              alt={project.shortTitle}
              className="w-full h-full"
              style={{ objectFit: project.coverFit ?? "cover", objectPosition: "center" }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom gradient for text legibility ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(4,2,0,0.82) 0%, rgba(4,2,0,0.3) 30%, transparent 60%)",
            zIndex: 2,
          }}
        />

        {/* ── Top-left: category label ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`cat-${active}`}
            className="absolute"
            style={{ top: 24, left: 28, zIndex: 10 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: 8.5,
                letterSpacing: "0.38em",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
              }}
            >
              {project.category.split("+")[0].trim()}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* ── Ghost number ── */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ right: "-3%", bottom: "18%", zIndex: 1 }}
          aria-hidden
        >
          <span
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 800,
              fontSize: "clamp(9rem, 20vw, 24rem)",
              color: "rgba(255,255,255,0.025)",
              lineHeight: 1,
            }}
          >
            {String(active + 1).padStart(2, "0")}
          </span>
        </div>

        {/* ── SCROLL cursor (follows mouse inside the frame) ── */}
        <ScrollCursor containerRef={frameRef as React.RefObject<HTMLElement>} />

        {/* ── Bottom content: title + metadata ── */}
        <div
          className="absolute"
          style={{ bottom: 28, left: 28, right: 28, zIndex: 10 }}
        >
          {/* Title with scramble animation */}
          <div style={{ marginBottom: 18 }}>
            <ScrambleText
              text={project.shortTitle.toUpperCase()}
              trigger={active}
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "clamp(2.8rem, 6.5vw, 7.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 0.88,
                color: "#ffffff",
                display: "block",
                textTransform: "uppercase",
              }}
            />
          </div>

          {/* Metadata row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Director / Year / Type — left (hidden on mobile to avoid crowding) */}
            <div className="m-hide" style={{ display: "flex", gap: 0 }}>
              {[
                { label: "DIRECTOR", value: project.client ?? "" },
                { label: "YEAR", value: project.year },
                { label: "CATEGORY", value: project.category.split("+")[0].trim() },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    paddingRight: 20,
                    marginRight: 20,
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Counter + Explore — right */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    fontSize: 8.5,
                    color: "rgba(255,255,255,0.18)",
                    letterSpacing: "0.3em",
                  }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>

              {/* Explore button */}
              <Link
                href={href(`/work/${project.slug}`)}
                className="group flex items-stretch"
                style={{
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 3,
                  overflow: "hidden",
                  textDecoration: "none",
                }}
              >
                <span style={{ position: "relative", overflow: "hidden", padding: "9px 18px", display: "block" }}>
                  <span
                    className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ background: "#E8181C" }}
                  />
                  <span
                    className="relative z-10"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      fontSize: 8,
                      letterSpacing: "0.32em",
                      color: "rgba(255,255,255,0.8)",
                      textTransform: "uppercase",
                    }}
                  >
                    EXPLORE
                  </span>
                </span>
                <span style={{ width: 1, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
                <span style={{ position: "relative", overflow: "hidden", padding: "9px 11px", display: "flex", alignItems: "center" }}>
                  <span
                    className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ background: "#E8181C" }}
                  />
                  <span
                    className="relative z-10 group-hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1 }}
                  >
                    →
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Film grain inside frame ── */}
        <div
          className="grain-overlay-frame absolute inset-0 pointer-events-none"
          style={{ zIndex: 50 }}
          aria-hidden
        />

        {/* ── Progress bar — bottom edge of frame ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex h-[2px]">
          {projects.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              className="flex-1"
              animate={{
                backgroundColor:
                  i === active
                    ? "#E8181C"
                    : i < active
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.06)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          NEXT PROJECT PEEK — strip below the frame
      ══════════════════════════════════════════ */}
      {nextProject && (
        <div
          className="absolute overflow-hidden pointer-events-none"
          style={{
            bottom: 0,
            left: 28,
            right: 28,
            height: 62,
            borderRadius: `0 0 ${FRAME_RADIUS.split("/")[1]?.trim() ?? "10px"}`,
            opacity: 0.45,
          }}
        >
          <img
            src={nextProject.cover}
            alt=""
            className="w-full h-full"
            style={{ objectFit: "cover", objectPosition: "center top" }}
            draggable={false}
          />
          {/* fade out the top so it blends into the frame gap */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #080808 0%, transparent 60%)",
            }}
          />
        </div>
      )}

      {/* ── Film Ticket (top-right) ── */}
      <FilmTicket
        active={project}
        activeIndex={active}
        onSelect={goTo}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
      />

      {/* ── Burger Menu overlay ── */}
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  )
}
