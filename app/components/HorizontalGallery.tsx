"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { projects } from "../data/projects"

export function HorizontalGallery() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [locked, setLocked] = useState(false)
  const wheelAccum = useRef(0)
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const next = active + dir
      if (next < 0 || next >= projects.length || locked) return
      setDirection(dir)
      setActive(next)
      setLocked(true)
      setTimeout(() => setLocked(false), 900)
    },
    [active, locked]
  )

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      wheelAccum.current += e.deltaY
      if (wheelTimer.current) clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => {
        if (Math.abs(wheelAccum.current) > 50) {
          navigate(wheelAccum.current > 0 ? 1 : -1)
        }
        wheelAccum.current = 0
      }, 60)
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [navigate])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(1)
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigate(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  const project = projects[active]

  return (
    <section className="relative h-screen overflow-hidden bg-black">

      {/* ── Full-bleed background ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${active}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: project.gradient }}
        />
      </AnimatePresence>

      {/* Layered overlay — dark at bottom, light at top so gradient shows */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* ── Counter — top right ── */}
      <div className="absolute top-8 right-12 z-10 select-none">
        <span className="font-mono text-[10px] tracking-[0.4em] text-white/30">
          {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Ghost number — decorative background ── */}
      <div
        className="absolute right-0 bottom-32 z-[1] select-none pointer-events-none"
        aria-hidden
      >
        <span
          className="font-display font-bold text-white/[0.04] leading-none"
          style={{ fontSize: "clamp(14rem, 28vw, 30rem)" }}
        >
          {String(active + 1).padStart(2, "0")}
        </span>
      </div>

      {/* ── Bottom content ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-10 md:px-16 pb-14">

        {/* Category + year */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`label-${active}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-[10px] uppercase tracking-[0.45em] text-white/40 mb-3"
          >
            {project.category.split("+")[0].trim()}&nbsp;&nbsp;·&nbsp;&nbsp;{project.year}
          </motion.p>
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={`title-${active}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold uppercase text-white leading-[0.87] mb-8"
            style={{
              fontSize: "clamp(3rem, 6.5vw, 8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {project.shortTitle}
          </motion.h2>
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-6 pt-5 border-t border-white/10">

          {/* Services — left */}
          <div className="flex items-center gap-5 min-w-0 overflow-hidden">
            {project.services.slice(0, 2).map((s, i) => (
              <span
                key={s}
                className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 whitespace-nowrap"
              >
                {i > 0 && <span className="mr-5 text-white/15">·</span>}
                {s}
              </span>
            ))}
          </div>

          {/* Actions — right */}
          <div className="flex items-center gap-2.5 flex-shrink-0">

            {/* Explore button */}
            <Link
              href={`/work/${project.slug}`}
              className="group flex items-stretch border border-white/20 overflow-hidden cursor-pointer"
            >
              <span className="relative overflow-hidden px-7 py-3">
                <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.35em] text-white transition-colors duration-300">
                  Explore
                </span>
              </span>
              <span className="w-px bg-white/10" />
              <span className="relative overflow-hidden px-4 py-3 flex items-center justify-center">
                <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10 text-white/50 group-hover:text-white transition-colors duration-300 text-sm leading-none">
                  →
                </span>
              </span>
            </Link>

            {/* Prev */}
            <button
              onClick={() => navigate(-1)}
              disabled={active === 0}
              aria-label="Previous project"
              className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/35 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200 disabled:opacity-15 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={() => navigate(1)}
              disabled={active === projects.length - 1}
              aria-label="Next project"
              className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/35 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200 disabled:opacity-15 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Progress segments ── */}
      <div className="absolute bottom-0 left-0 right-0 flex h-[2px] z-20">
        {projects.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              if (i === active) return
              setDirection(i > active ? 1 : -1)
              setActive(i)
              setLocked(true)
              setTimeout(() => setLocked(false), 900)
            }}
            aria-label={`Go to project ${i + 1}`}
            className="flex-1 cursor-pointer"
            animate={{
              backgroundColor:
                i === active
                  ? "#E8181C"
                  : i < active
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.07)",
            }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>
    </section>
  )
}
