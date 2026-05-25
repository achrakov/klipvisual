"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import type { Project, ProjectVideo, PhotoAlbum, EventEntry, EventTheme, EventReel, PitchDeck, BrandCaseStudy } from "../../data/projects"
import { Footer } from "../../components/Footer"
import { BurgerMenu } from "../../components/BurgerMenu"
import { useLang } from "../../i18n/LanguageContext"

const FRAME_RADIUS = "10px 12px 11px 10px / 11px 10px 12px 10px"

function useObjPos(project: Project) {
  const pos = (src: string) => {
    const p = project.imagePositions?.[src]
    return p ? `${p.x}% ${p.y}%` : "center"
  }
  const scale = (src: string) => {
    const p = project.imagePositions?.[src]
    return p?.scale && p.scale !== 1 ? p.scale : undefined
  }
  const style = (src: string): React.CSSProperties => {
    const p = project.imagePositions?.[src]
    if (!p) return {}
    const x = p.x ?? 50
    const y = p.y ?? 50
    const s = p.scale ?? 1
    return {
      objectPosition: `${x}% ${y}%`,
      ...(s !== 1 ? { transform: `scale(${s})`, transformOrigin: `${x}% ${y}%` } : {}),
    }
  }
  return { pos, scale, style }
}

interface Props {
  project: Project
  nextProject: Project
}

/* ─── Serrated ticket edge (SVG) ─────────────────── */
function SerratedEdge({ side = "right" }: { side?: "left" | "right" }) {
  const holes = Array.from({ length: 18 })
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: -10,
        width: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {holes.map((_, i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#0a0a0a",
            alignSelf: side === "right" ? "flex-end" : "flex-start",
          }}
        />
      ))}
    </div>
  )
}

/* ─── Gallery badge ───────────────────────────────── */
function GalleryBadge() {
  const { t } = useLang()
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "#f5f0e8",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 4,
        padding: "6px 18px",
        position: "relative",
      }}
    >
      {/* Corner holes */}
      {[{ top: -5, left: -5 }, { top: -5, right: -5 }, { bottom: -5, left: -5 }, { bottom: -5, right: -5 }].map((pos, i) => (
        <div
          key={i}
          style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "#0a0a0a", ...pos }}
        />
      ))}
      <span
        className="font-mono text-[#080808] uppercase"
        style={{ fontSize: 9, letterSpacing: "0.35em" }}
      >
        {t.project.gallery}
      </span>
    </div>
  )
}

/* ─── Stills badge ────────────────────────────────── */
function FramesBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 32, height: 1, background: "rgba(240,237,232,0.15)" }} />
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.4em", color: "rgba(240,237,232,0.3)" }}>
        Selected Frames
      </span>
      <div style={{ width: 32, height: 1, background: "rgba(240,237,232,0.15)" }} />
    </div>
  )
}

/* ─── Stills fullscreen viewer ────────────────────── */
function StillsViewer({
  stills,
  startIndex,
  imgStyle,
  onClose,
}: {
  stills: string[]
  startIndex: number
  imgStyle: (s: string) => React.CSSProperties
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)
  const { t } = useLang()

  useEffect(() => {
    document.body.classList.add("overlay-open")
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setCurrent(c => Math.min(c + 1, stills.length - 1))
      if (e.key === "ArrowLeft") setCurrent(c => Math.max(c - 1, 0))
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.classList.remove("overlay-open")
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose, stills.length])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(4,2,0,0.97)", display: "flex", flexDirection: "column" }}
      onClick={onClose}
    >
      {/* Header */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 36px", flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.4em", color: "rgba(240,237,232,0.28)" }}>
          {String(current + 1).padStart(2, "0")} / {String(stills.length).padStart(2, "0")}
        </span>
        <motion.button
          onClick={onClose}
          initial="rest" whileHover="hover" animate="rest"
          className="gallery-close"
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 3, padding: "8px 18px", position: "relative", overflow: "hidden" }}
        >
          <motion.span
            variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, background: "#E8181C", transformOrigin: "bottom", zIndex: 0 }}
          />
          <motion.span variants={{ rest: { color: "rgba(255,255,255,0.5)" }, hover: { color: "#fff" } }} transition={{ duration: 0.2 }} className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", position: "relative", zIndex: 1 }}>{t.project.close}</motion.span>
          <motion.span variants={{ rest: { color: "rgba(255,255,255,0.3)" }, hover: { color: "#fff" } }} transition={{ duration: 0.2 }} style={{ fontSize: 14, position: "relative", zIndex: 1, lineHeight: 1 }}>✕</motion.span>
        </motion.button>
      </div>

      {/* Image */}
      <div
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 80px 32px", position: "relative" }}
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            src={stills[current]}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 4, ...imgStyle(stills[current]) }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Prev arrow */}
        {current > 0 && (
          <button
            onClick={() => setCurrent(c => c - 1)}
            style={{ position: "absolute", left: 20, background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer" }}
          >←</button>
        )}
        {/* Next arrow */}
        {current < stills.length - 1 && (
          <button
            onClick={() => setCurrent(c => c + 1)}
            style={{ position: "absolute", right: 20, background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer" }}
          >→</button>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Grid placement map for up to 6 stills ──────── */
const STILL_PLACEMENTS = [
  { col: "1 / 3", row: "1" },
  { col: "3",     row: "1" },
  { col: "1",     row: "2" },
  { col: "2 / 4", row: "2" },
  { col: "1 / 3", row: "3" },
  { col: "3",     row: "3" },
]

function StillsSection({ stills, objPos, imgStyle }: { stills: string[]; objPos: (s: string) => string; imgStyle: (s: string) => React.CSSProperties }) {
  const [viewer, setViewer] = useState<number | null>(null)
  const items = stills.slice(0, 6)

  return (
    <section style={{ background: "#060606", padding: "80px 0 88px", borderBottom: "1px solid #1f1f1f", position: "relative", overflow: "hidden" }}>
      {/* Ghost text */}
      <div
        aria-hidden
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "clamp(5rem, 16vw, 14rem)", color: "rgba(255,255,255,0.022)", letterSpacing: "-0.03em", textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none" }}
      >
        FRAMES
      </div>

      {/* Badge */}
      <div style={{ textAlign: "center", marginBottom: 52, position: "relative", zIndex: 1 }}>
        <FramesBadge />
      </div>

      {/* Mosaic grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {items.map((src, i) => {
            const place = STILL_PLACEMENTS[i]
            return (
              <motion.div
                key={i}
                initial="rest"
                whileHover="hover"
                animate="rest"
                onClick={() => setViewer(i)}
                style={{
                  gridColumn: place.col,
                  gridRow: place.row,
                  height: 230,
                  borderRadius: FRAME_RADIUS,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <motion.img
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  src={src}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...imgStyle(src) }}
                  draggable={false}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
                <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 4 }} aria-hidden />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {viewer !== null && (
          <StillsViewer stills={stills} startIndex={viewer} imgStyle={imgStyle} onClose={() => setViewer(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function VideoCard({ video, onPlay, objPos }: { video: ProjectVideo; onPlay: (id: string) => void; objPos?: string }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={() => video.videoId && onPlay(video.videoId)}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: "16/9",
        borderRadius: FRAME_RADIUS,
        cursor: video.videoId ? "pointer" : "default",
      }}
    >
      <motion.img
        variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        src={video.cover}
        alt={video.talent}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos ?? "center" }}
        draggable={false}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />

      {/* Play button */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          variants={{ rest: { scale: 1, opacity: video.videoId ? 0.75 : 0.25 }, hover: { scale: 1.12, opacity: 1 } }}
          transition={{ duration: 0.3 }}
          style={{ width: 52, height: 52, borderRadius: "50%", background: "#E8181C", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="15" height="18" viewBox="0 0 18 20" fill="none">
            <path d="M1 1L17 10L1 19V1Z" fill="white" />
          </svg>
        </motion.div>
      </div>

      {/* Talent info */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 22px" }}>
        <p className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.3em", marginBottom: 6, color: "rgba(255,255,255,0.4)" }}>
          {video.role}
        </p>
        <h4 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: "clamp(1.1rem,1.8vw,1.6rem)", lineHeight: 1 }}>
          {video.talent}
        </h4>
      </div>

      <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
    </motion.div>
  )
}

function EventCard({ event, onPlay }: { event: EventEntry; onPlay: (id: string) => void }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={() => event.videoId && onPlay(event.videoId)}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: "16/9",
        borderRadius: FRAME_RADIUS,
        cursor: event.videoId ? "pointer" : "default",
        background: "#0a0a0a",
      }}
    >
      {event.cover && (
        <motion.img
          variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          src={event.cover}
          alt={event.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />
      )}

      {/* Dark gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)", zIndex: 2 }} />

      {/* Type badge */}
      <div style={{ position: "absolute", top: 14, left: 14, zIndex: 10 }}>
        <span
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: "0.3em", color: "rgba(255,255,255,0.55)", background: "rgba(0,0,0,0.5)", padding: "4px 10px", borderRadius: 2 }}
        >
          {event.type}
        </span>
      </div>

      {/* Play button — appears on hover when video exists */}
      {event.videoId && (
        <motion.div
          variants={{ rest: { opacity: 0, scale: 0.85 }, hover: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.3 }}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
        >
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#E8181C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="17" viewBox="0 0 18 20" fill="none">
              <path d="M1 1L17 10L1 19V1Z" fill="white" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Bottom info */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px", zIndex: 10 }}>
        {event.date && (
          <p className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
            {event.date}
          </p>
        )}
        <h4 className="font-display font-bold uppercase" style={{ fontSize: "clamp(0.95rem,1.6vw,1.5rem)", lineHeight: 1.05, color: "#ffffff" }}>
          {event.name}
        </h4>
      </div>

      <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
    </motion.div>
  )
}

function ThemeCard({ theme, index, onOpen, imgStyle }: { theme: EventTheme; index: number; onOpen: (t: EventTheme) => void; imgStyle: (src: string) => React.CSSProperties }) {
  const { t } = useLang()
  const coverStyle = theme.cover ? imgStyle(theme.cover) : {}
  const { transform, transformOrigin, ...imgOnlyStyle } = coverStyle
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={() => onOpen(theme)}
      style={{ position: "relative", overflow: "hidden", aspectRatio: theme.aspectRatio ?? "4/3", borderRadius: FRAME_RADIUS, cursor: "pointer", background: "#0a0a0a" }}
    >
      {theme.cover && (
        /* Outer div handles saved zoom; inner motion.img handles hover scale */
        <div style={{ position: "absolute", inset: 0, transform, transformOrigin }}>
          <motion.img
            variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            src={theme.cover}
            alt={theme.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...imgOnlyStyle }}
            draggable={false}
          />
        </div>
      )}
      {/* heavy dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)", zIndex: 2 }} />

      {/* Ghost number */}
      <div style={{ position: "absolute", top: 16, left: 20, zIndex: 3 }}>
        <span className="font-display font-bold" style={{ fontSize: "clamp(4rem,10vw,8rem)", color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px", zIndex: 10 }}>
        <motion.p
          variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3 }}
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: "0.35em", color: "#E8181C", marginBottom: 10 }}
        >
          {t.project.viewGallery}
        </motion.p>
        <h4 className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.4rem,2.5vw,2.4rem)", lineHeight: 0.95, color: "#ffffff" }}>
          {theme.name}
        </h4>
      </div>

      <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
    </motion.div>
  )
}

function ReelCard({ reel, onPlay }: { reel: EventReel; onPlay: (id: string) => void }) {
  const { t } = useLang()
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={() => reel.videoId && onPlay(reel.videoId)}
      style={{ position: "relative", overflow: "hidden", aspectRatio: "9/16", borderRadius: FRAME_RADIUS, cursor: reel.videoId ? "pointer" : "default", background: "#080808" }}
    >
      {reel.cover && (
        <motion.img
          variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          src={reel.cover}
          alt={reel.title ?? ""}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)", zIndex: 2 }} />

      {/* Play button */}
      <motion.div
        variants={{ rest: { opacity: reel.videoId ? 0.6 : 0.2, scale: 1 }, hover: { opacity: 1, scale: 1.1 } }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
      >
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E8181C", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="17" viewBox="0 0 18 20" fill="none">
            <path d="M1 1L17 10L1 19V1Z" fill="white" />
          </svg>
        </div>
      </motion.div>

      {/* Title */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px", zIndex: 10 }}>
        <p className="font-mono uppercase" style={{ fontSize: 7, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>
          Teaser
        </p>
        <h4 className="font-display font-bold uppercase" style={{ fontSize: "clamp(1rem,1.5vw,1.4rem)", lineHeight: 1, color: "#ffffff" }}>
          {reel.title ?? t.project.comingSoon}
        </h4>
      </div>

      <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
    </motion.div>
  )
}

/* ─── Concert grid — 12 photos, mixed aspect ratios ──────── */
const CONCERT_GRID = [
  { col: "1 / 3", row: "1", height: 340 },  // wide 16:9
  { col: "3",     row: "1", height: 340 },  // portrait
  { col: "1",     row: "2", height: 220 },  // 3:2
  { col: "2",     row: "2", height: 220 },  // 3:2
  { col: "3",     row: "2", height: 220 },  // 3:2
  { col: "1",     row: "3", height: 340 },  // portrait
  { col: "2 / 4", row: "3", height: 340 },  // wide 16:9
  { col: "1 / 4", row: "4", height: 200 },  // full-width banner
  { col: "1",     row: "5", height: 360 },  // portrait
  { col: "2",     row: "5", height: 360 },  // portrait
  { col: "3",     row: "5", height: 360 },  // portrait
  { col: "1 / 4", row: "6", height: 280 },  // final wide 16:9
]

function ConcertSection({
  gallery,
  reels,
  onPlay,
  imgStyle,
}: {
  gallery: string[]
  reels: EventReel[]
  onPlay: (id: string) => void
  imgStyle: (s: string) => React.CSSProperties
}) {
  const { t } = useLang()
  const photos = gallery.slice(0, 12)
  const overflow = gallery.slice(12, 17)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox])

  return (
    <>
      {/* ── Concert Photo Grid ── */}
      <section style={{ background: "#060606", padding: "72px 28px 80px", borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44 }}>
            <div>
              <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.45em", color: "#E8181C", marginBottom: 10 }}>
                Event Coverage
              </p>
              <h2 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", lineHeight: 0.95 }}>
                {t.project.concertGallery}
              </h2>
            </div>
            <span className="font-mono" style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: "0.25em" }}>
              {photos.length > 0 ? `${String(photos.length).padStart(2, "0")} frames` : ""}
            </span>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {CONCERT_GRID.map((slot, i) => {
              const src = photos[i]
              return src ? (
                <motion.div
                  key={i}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  onClick={() => setLightbox(src)}
                  style={{ gridColumn: slot.col, gridRow: slot.row, height: slot.height, borderRadius: FRAME_RADIUS, overflow: "hidden", position: "relative", cursor: "zoom-in" }}
                >
                  <motion.img
                    variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    src={src}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...imgStyle(src) }}
                    draggable={false}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 55%)" }} />
                  <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 4 }} aria-hidden />
                </motion.div>
              ) : (
                <div
                  key={i}
                  style={{ gridColumn: slot.col, gridRow: slot.row, height: slot.height, borderRadius: FRAME_RADIUS, background: "#0d0d0d", border: "1px dashed #1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <span className="font-mono" style={{ fontSize: 9, color: "#222", letterSpacing: "0.2em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )
            })}
          </div>

          {/* ── "And more" strip ── */}
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
            {overflow.length > 0 ? (
              <>
                <div style={{ display: "flex", gap: 4 }}>
                  {overflow.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 4,
                        overflow: "hidden",
                        opacity: 0.18 + (overflow.length - i) * 0.1,
                        filter: `blur(${i * 0.6}px)`,
                        flexShrink: 0,
                      }}
                    >
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flex: 1, height: 1, background: "linear-gradient(to right, #1f1f1f, transparent)" }} />
                <span className="font-mono" style={{ fontSize: 8, letterSpacing: "0.3em", color: "#333", textTransform: "uppercase", flexShrink: 0 }}>
                  +{gallery.length - 12} more frames
                </span>
              </>
            ) : (
              <>
                <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
                <span className="font-mono" style={{ fontSize: 8, letterSpacing: "0.3em", color: "#2a2a2a", textTransform: "uppercase" }}>
                  {photos.length} selected frames — full archive on request
                </span>
                <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
          >
            <motion.img
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={lightbox}
              alt=""
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 4, cursor: "default" }}
              draggable={false}
            />
            <button
              onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: 24, right: 28, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Live Edits — 9:16 vertical reels ── */}
      {reels.length > 0 && (
        <section style={{ background: "#080808", padding: "72px 28px 80px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <p className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.18)", marginBottom: 52 }}>
              Live Edits
            </p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(reels.length, 3)}, 1fr)`, gap: 16 }}>
              {reels.map((reel, i) => (
                <ReelCard key={i} reel={reel} onPlay={onPlay} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const COLLAGE_PATTERN = [
  { col: "span 2", row: "span 2" },
  { col: "span 1", row: "span 1" },
  { col: "span 1", row: "span 1" },
  { col: "span 1", row: "span 2" },
  { col: "span 2", row: "span 1" },
  { col: "span 1", row: "span 1" },
  { col: "span 1", row: "span 1" },
  { col: "span 2", row: "span 1" },
  { col: "span 1", row: "span 1" },
]

/* ─── PitchDeckCard ───────────────────────────────────────── */
function PitchDeckCard({ deck, index, onOpen }: { deck: PitchDeck; index: number; onOpen: (d: PitchDeck) => void }) {
  const cover = deck.slides[0] ?? null
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={() => onOpen(deck)}
      style={{ position: "relative", cursor: "pointer" }}
    >
      {/* Stacked paper layers */}
      <motion.div
        variants={{ rest: { x: 0, y: 0, rotate: 0 }, hover: { x: 7, y: -5, rotate: 1.8 } }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, background: "#1c1c1c", borderRadius: FRAME_RADIUS, zIndex: 0 }}
      />
      <motion.div
        variants={{ rest: { x: 0, y: 0, rotate: 0 }, hover: { x: 3.5, y: -2.5, rotate: 0.9 } }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, background: "#242424", borderRadius: FRAME_RADIUS, zIndex: 1 }}
      />
      {/* Main card */}
      <div style={{ position: "relative", zIndex: 2, overflow: "hidden", borderRadius: FRAME_RADIUS, aspectRatio: "4/3" }}>
        {cover ? (
          <motion.img
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            src={cover}
            alt={deck.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            draggable={false}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "clamp(5rem, 10vw, 10rem)", color: "rgba(255,255,255,0.03)", letterSpacing: "-0.02em" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)" }} />

        {/* Top: industry + year */}
        <div style={{ position: "absolute", top: 18, left: 20, zIndex: 10 }}>
          <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.38em", color: "rgba(255,255,255,0.4)" }}>
            {deck.industry ?? "Strategy"}{deck.year ? `  ·  ${deck.year}` : ""}
          </span>
        </div>
        {deck.slides.length > 0 && (
          <div style={{ position: "absolute", top: 18, right: 20, zIndex: 10 }}>
            <span className="font-mono" style={{ fontSize: 8, color: "rgba(255,255,255,0.22)", letterSpacing: "0.2em" }}>
              {deck.slides.length} slides
            </span>
          </div>
        )}

        {/* Bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 22px", zIndex: 10 }}>
          {deck.client && (
            <p className="font-mono uppercase" style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", marginBottom: 6 }}>
              {deck.client}
            </p>
          )}
          <h3 className="font-display font-bold uppercase text-white" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.6rem)", letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 16 }}>
            {deck.name}
          </h3>
          <motion.div
            variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: 8, letterSpacing: "0.32em", color: "#E8181C", border: "1px solid rgba(232,24,28,0.35)", padding: "5px 14px", display: "inline-block" }}
            >
              View Deck →
            </span>
          </motion.div>
        </div>
        <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
      </div>
    </motion.div>
  )
}

/* ─── SlideshowLightbox ───────────────────────────────────── */
function SlideshowLightbox({ deck, onClose }: { deck: PitchDeck; onClose: () => void }) {
  const [current, setCurrent] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") setCurrent(c => Math.max(0, c - 1))
      if (e.key === "ArrowRight") setCurrent(c => Math.min(deck.slides.length - 1, c + 1))
    }
    window.addEventListener("keydown", onKey)
    document.body.classList.add("overlay-open")
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.classList.remove("overlay-open")
    }
  }, [onClose, deck.slides.length])

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const thumb = strip.children[current] as HTMLElement | undefined
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [current])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(4,2,0,0.97)", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.3em", marginBottom: 4 }}>
            {[deck.client, deck.industry, deck.year].filter(Boolean).join("  ·  ")}
          </p>
          <p className="font-display font-bold uppercase text-white" style={{ fontSize: "1.05rem", letterSpacing: "-0.01em", lineHeight: 1 }}>
            {deck.name}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {deck.slides.length > 0 && (
            <span className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.25em" }}>
              {String(current + 1).padStart(2, "0")} / {String(deck.slides.length).padStart(2, "0")}
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ color: "rgba(255,255,255,0.45)", background: "none", border: "none", fontSize: 24, cursor: "pointer", lineHeight: 1, fontWeight: 300, padding: "0 4px" }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Main slide */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 72px", position: "relative", overflow: "hidden", minHeight: 0 }}>
        {deck.slides.length === 0 ? (
          <p className="font-mono uppercase" style={{ fontSize: 9, color: "#333", letterSpacing: "0.35em" }}>
            No slides uploaded yet
          </p>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={deck.slides[current]}
                alt={`Slide ${current + 1}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", boxShadow: "0 32px 100px rgba(0,0,0,0.7)", borderRadius: 3 }}
                draggable={false}
              />
            </AnimatePresence>
            {/* Prev */}
            {current > 0 && (
              <button
                onClick={() => setCurrent(c => c - 1)}
                aria-label="Previous slide"
                style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
              >
                ←
              </button>
            )}
            {/* Next */}
            {current < deck.slides.length - 1 && (
              <button
                onClick={() => setCurrent(c => c + 1)}
                aria-label="Next slide"
                style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
              >
                →
              </button>
            )}
          </>
        )}
      </div>

      {/* Filmstrip */}
      {deck.slides.length > 0 && (
        <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 28px 14px" }}>
          <div
            ref={stripRef}
            style={{ display: "flex", gap: 5, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2 }}
          >
            {deck.slides.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{ flexShrink: 0, width: 90, aspectRatio: "16/9", overflow: "hidden", borderRadius: 2, border: `2px solid ${i === current ? "#E8181C" : "transparent"}`, opacity: i === current ? 1 : 0.38, cursor: "pointer", background: "#111", padding: 0, transition: "opacity 0.2s, border-color 0.2s" }}
              >
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function GalleryLightbox({ theme, onClose }: { theme: EventTheme; onClose: () => void }) {
  const [zoomed, setZoomed] = useState<string | null>(null)
  const cols = theme.aspectRatio === "16/9" ? 3 : 5
  const { t } = useLang()

  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.body.classList.add("overlay-open")
    return () => {
      document.body.style.overflow = ""
      document.body.classList.remove("overlay-open")
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { zoomed ? setZoomed(null) : onClose() }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose, zoomed])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="gallery-lightbox"
      style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(4,2,0,0.96)", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.4em", color: "#E8181C", marginBottom: 6 }}>
            {t.project.gallery}
          </p>
          <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.4rem,2.5vw,2.4rem)", lineHeight: 0.9, color: "#f0ede8" }}>
            {theme.name}
          </h2>
        </div>
        <motion.button
          onClick={onClose}
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="gallery-close"
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 3, padding: "8px 18px", position: "relative", overflow: "hidden" }}
        >
          <motion.span
            variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, background: "#E8181C", transformOrigin: "bottom", zIndex: 0 }}
          />
          <motion.span
            variants={{ rest: { color: "rgba(255,255,255,0.55)" }, hover: { color: "#ffffff" } }}
            transition={{ duration: 0.2 }}
            className="font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.3em", position: "relative", zIndex: 1 }}
          >
            {t.project.close}
          </motion.span>
          <motion.span
            variants={{ rest: { color: "rgba(255,255,255,0.35)" }, hover: { color: "#ffffff" } }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 14, position: "relative", zIndex: 1, lineHeight: 1 }}
          >
            ✕
          </motion.span>
        </motion.button>
      </div>

      {/* Masonry grid or empty state */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 40px" }}>
        {theme.images.length > 0 ? (
          <div style={{ columns: cols, columnGap: 5 }}>
            {theme.images.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setZoomed(src)}
                className="gallery-thumb"
                style={{ breakInside: "avoid", marginBottom: 5, borderRadius: 4, overflow: "hidden" }}
              >
                <img src={src} alt="" style={{ width: "100%", height: "auto", display: "block", transition: "opacity 0.2s" }} draggable={false} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: 0.4 }}>
            <span className="font-display font-bold" style={{ fontSize: "clamp(4rem,10vw,9rem)", lineHeight: 1, color: "#f0ede8" }}>
              {theme.name.split(" ")[0]}
            </span>
            <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)" }}>
              Photos coming soon
            </p>
          </div>
        )}
      </div>

      {/* Full-size zoom overlay */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setZoomed(null)}
            className="gallery-zoom-overlay"
            style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          >
            <motion.img
              src={zoomed}
              alt=""
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 4, boxShadow: "0 40px 120px rgba(0,0,0,0.8)" }}
            />
            <button
              onClick={() => setZoomed(null)}
              className="gallery-close"
              style={{ position: "absolute", top: 20, right: 24, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PosterShowcase({
  posters,
  imgStyle,
}: {
  posters: string[]
  imgStyle: (src: string) => React.CSSProperties
}) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [lightbox])

  return (
    <>
      <section
        style={{
          background: "#040404",
          borderBottom: "1px solid #1f1f1f",
          padding: "80px 40px",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p
              className="font-mono uppercase"
              style={{ fontSize: 9, letterSpacing: "0.45em", color: "#E8181C", marginBottom: 12 }}
            >
              Visual Identity
            </p>
            <h3
              className="font-display font-bold uppercase"
              style={{
                fontSize: "clamp(2rem,4vw,4rem)",
                color: "#f0ede8",
                lineHeight: "0.9em",
                letterSpacing: "-0.03em",
              }}
            >
              Event Posters
            </h3>
          </div>

          {/* Poster grid — 4:5 portrait */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(posters.length, 5)}, 1fr)`,
              gap: 10,
            }}
          >
            {posters.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: (i % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03 }}
                style={{
                  position: "relative",
                  aspectRatio: "4/5",
                  borderRadius: FRAME_RADIUS,
                  overflow: "hidden",
                  cursor: "zoom-in",
                  background: "#0a0a0a",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                }}
                onClick={() => setLightbox(src)}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    ...imgStyle(src),
                  }}
                  draggable={false}
                />
                <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} aria-hidden />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,0.96)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-out",
            }}
            onClick={() => setLightbox(null)}
          >
            <img
              src={lightbox}
              alt=""
              style={{ maxWidth: "90vw", maxHeight: "92vh", objectFit: "contain", borderRadius: 4 }}
              draggable={false}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute",
                top: 24,
                right: 28,
                background: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#f0ede8",
                width: 44,
                height: 44,
                borderRadius: "50%",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function EditorialAlbumSection({
  gallery,
  shortTitle,
  imgStyle,
}: {
  gallery: string[]
  shortTitle: string
  imgStyle: (src: string) => React.CSSProperties
}) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [lightbox])

  type SpreadType = "full" | "split" | "triptych"
  const COUNTS = [1, 2, 3]
  const TYPES: SpreadType[] = ["full", "split", "triptych"]
  const spreads: Array<{ type: SpreadType; photos: string[] }> = []
  let cursor = 0
  let pi = 0
  while (cursor < gallery.length) {
    const n = COUNTS[pi % 3]
    const photos = gallery.slice(cursor, cursor + n)
    spreads.push({ type: TYPES[pi % 3], photos })
    cursor += photos.length
    pi++
  }

  return (
    <>
      {/* Intro title card */}
      <section
        style={{
          background: "#060606",
          padding: "96px 40px 72px",
          borderBottom: "1px solid #1f1f1f",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost word */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: "clamp(10rem,22vw,22rem)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            color: "rgba(255,255,255,0.025)",
            letterSpacing: "-0.05em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          ALBUM
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <p
            className="font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: "0.45em", color: "#E8181C", marginBottom: 20 }}
          >
            Wedding Album
          </p>
          <h2
            className="font-display font-bold uppercase"
            style={{
              fontSize: "clamp(3rem,7vw,7rem)",
              color: "#f0ede8",
              lineHeight: "0.88em",
              letterSpacing: "-0.04em",
            }}
          >
            {shortTitle}
          </h2>
        </div>
      </section>

      {/* Spreads */}
      <div style={{ background: "#060606", display: "flex", flexDirection: "column", gap: 3 }}>
        {spreads.map((spread, si) => {
          const { type, photos } = spread

          if (type === "full") {
            return (
              <motion.div
                key={si}
                initial={{ opacity: 0, scale: 1.02 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%", height: "75vh", position: "relative", cursor: "zoom-in", overflow: "hidden" }}
                onClick={() => setLightbox(photos[0])}
              >
                <img
                  src={photos[0]}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", ...imgStyle(photos[0]) }}
                  draggable={false}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 40%, rgba(0,0,0,0.45) 100%)",
                  }}
                />
                <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} aria-hidden />
                <span
                  className="font-mono"
                  style={{
                    position: "absolute",
                    bottom: 20,
                    right: 24,
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: "rgba(240,237,232,0.3)",
                    zIndex: 4,
                  }}
                >
                  {String(si + 1).padStart(2, "0")} / {String(spreads.length).padStart(2, "0")}
                </span>
              </motion.div>
            )
          }

          if (type === "split") {
            return (
              <div key={si} style={{ display: "grid", gridTemplateColumns: "38fr 62fr", gap: 3, height: "62vh" }}>
                {photos.slice(0, 2).map((src, pi) => (
                  <motion.div
                    key={pi}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.9, delay: pi * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: "relative", overflow: "hidden", cursor: "zoom-in" }}
                    onClick={() => setLightbox(src)}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", ...imgStyle(src) }}
                      draggable={false}
                    />
                    <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} aria-hidden />
                  </motion.div>
                ))}
                {photos.length < 2 && <div style={{ background: "#0a0a0a" }} />}
              </div>
            )
          }

          /* triptych */
          return (
            <div key={si} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.65fr", gap: 3, height: "66vh" }}>
              {photos.slice(0, 3).map((src, pi) => (
                <motion.div
                  key={pi}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.9, delay: pi * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "relative", overflow: "hidden", cursor: "zoom-in" }}
                  onClick={() => setLightbox(src)}
                >
                  <img
                    src={src}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", ...imgStyle(src) }}
                    draggable={false}
                  />
                  <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} aria-hidden />
                </motion.div>
              ))}
              {Array.from({ length: Math.max(0, 3 - photos.length) }).map((_, fi) => (
                <div key={`fill-${fi}`} style={{ background: "#0a0a0a" }} />
              ))}
            </div>
          )
        })}
      </div>

      {/* Bottom border */}
      <div style={{ background: "#060606", height: 80, borderBottom: "1px solid #1f1f1f" }} />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "zoom-out",
            }}
            onClick={() => setLightbox(null)}
          >
            <img
              src={lightbox}
              alt=""
              style={{ maxWidth: "95vw", maxHeight: "92vh", objectFit: "contain", borderRadius: 4 }}
              draggable={false}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute",
                top: 24,
                right: 28,
                background: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#f0ede8",
                width: 44,
                height: 44,
                borderRadius: "50%",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function YouTubeLightbox({ videoId, onClose, portrait = false }: { videoId: string; onClose: () => void; portrait?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    document.body.classList.add("overlay-open")
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      document.body.classList.remove("overlay-open")
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "transparent",
          color: "#f0ede8",
          fontSize: 20,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        ×
      </button>

      {/* Player */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...(portrait
            ? { height: "85vh", maxHeight: 700, aspectRatio: "9/16" }
            : { width: "100%", maxWidth: 1100, aspectRatio: "16/9" }),
          borderRadius: "10px 12px 11px 10px / 11px 10px 12px 10px",
          overflow: "hidden",
          boxShadow: "0 0 120px rgba(232,24,28,0.15)",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white${portrait ? "&controls=0" : ""}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function ProjectClient({ project, nextProject }: Props) {
  const [activeVideo, setActiveVideo] = useState<{ id: string; portrait: boolean } | null>(null)
  const [activeTheme, setActiveTheme] = useState<EventTheme | null>(null)
  const [activeDeck, setActiveDeck] = useState<PitchDeck | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLang()
  const tp = t.project
  const { pos: objPos, style: imgStyle } = useObjPos(project)

  const featuredCrew = project.crew.slice(0, 2)
  const secondaryCrew = project.crew.slice(2, 4)
  const extraCrew = project.crew.slice(4)

  // Title parallax
  const titleRef = useRef<HTMLElement>(null)
  const { scrollYProgress: titleScroll } = useScroll({
    target: titleRef,
    offset: ["start end", "end start"],
  })
  const overviewRef = useRef<HTMLElement>(null)
  const words = project.shortTitle.split(" ")
  const mid = Math.ceil(words.length / 2)
  const titleLine1 = words.slice(0, mid).join(" ")
  const titleLine2 = words.slice(mid).join(" ")
  const line1X = useTransform(titleScroll, [0, 1], ["4%", "-4%"])
  const line2X = useTransform(titleScroll, [0, 1], ["-4%", "4%"])
  const catX  = useTransform(titleScroll, [0, 1], ["-2%", "2%"])

  return (
    <>
      {/* ── Logo (fixed — stays while scrolling) ── */}
      <div style={{ position: "fixed", top: 20, left: 28, zIndex: 9000 }}>
        <Link href="/" aria-label="KLIPVISUAL home">
          <Image
            src="/Logos/Logo.png"
            alt="KLIPVISUAL"
            width={140}
            height={38}
            style={{ height: 38, width: "auto", objectFit: "contain", display: "block" }}
          />
        </Link>
      </div>

      {/* ── Burger menu button (fixed top-right) ── */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9000 }}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t.burger.toggleLabel}
          style={{
            background: "#f5f0e8",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 8,
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            cursor: "pointer",
            position: "relative",
          }}
        >
          {/* Corner punch holes */}
          {[{ top: 0, left: 0, transform: "translate(-50%,-50%)" }, { top: 0, right: 0, transform: "translate(50%,-50%)" }, { bottom: 0, left: 0, transform: "translate(-50%,50%)" }, { bottom: 0, right: 0, transform: "translate(50%,50%)" }].map((pos, i) => (
            <div key={i} style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#080808", ...pos }} />
          ))}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 16,
                height: 1.5,
                background: menuOpen ? "rgba(0,0,0,0.25)" : "#080808",
                borderRadius: 1,
                transition: "background 0.2s",
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Burger menu overlay ── */}
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ══════════════════════════════════
          SECTION 1 — HERO (full screen)
      ══════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          height: "65vh",
          background: "#080808",
          overflow: "hidden",
        }}
      >
        {/* ── Back button (absolute — scrolls away with hero) ── */}
        <Link
          href="/work"
          className="flex items-center gap-3 font-mono uppercase text-[#f0ede8]/60 hover:text-[#f0ede8] transition-colors duration-200"
          style={{ position: "absolute", top: 80, left: 28, zIndex: 100, fontSize: 9, letterSpacing: "0.25em" }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ←
          </span>
          {tp.allWork}
        </Link>
        {/* Film frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <motion.img
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            src={project.cover}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: project.coverFit ?? "cover", ...imgStyle(project.cover) }}
            draggable={false}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(8,8,8,0.15) 0%, transparent 35%, rgba(8,8,8,0.7) 100%)",
            }}
          />
          {/* Film grain */}
          <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 2 — TITLE
      ══════════════════════════════════ */}
      <section
        ref={titleRef}
        style={{
          padding: "72px 0 64px",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          textAlign: "center",
          overflow: "hidden",
          background: "#f5f0e8",
        }}
      >
        <motion.p
          style={{ x: catX, fontSize: 10, letterSpacing: "0.35em", marginBottom: 20, color: "rgba(0,0,0,0.4)" }}
          className="font-mono uppercase"
        >
          {project.category}
        </motion.p>

        <motion.div style={{ x: line1X }}>
          <h1
            className="font-display font-bold uppercase leading-none"
            style={{ fontSize: "clamp(2.8rem,6vw,6.5rem)", lineHeight: 1, color: "#0a0a0a" }}
          >
            {titleLine1}
          </h1>
        </motion.div>

        {titleLine2 && (
          <motion.div style={{ x: line2X }}>
            <h1
              className="font-display font-bold uppercase leading-none"
              style={{ fontSize: "clamp(2.8rem,6vw,6.5rem)", lineHeight: 1, color: "#0a0a0a" }}
            >
              {titleLine2}
            </h1>
          </motion.div>
        )}

        {/* Scroll-down button */}
        <div style={{ display: "flex", justifyContent: "center", margin: "36px 0 40px" }}>
          <button
            onClick={() => overviewRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.2)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a0a0a",
              fontSize: 18,
              cursor: "pointer",
              transition: "border-color 0.2s, background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#E8181C"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8181C"; (e.currentTarget as HTMLButtonElement).style.color = "#fff" }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "#0a0a0a" }}
          >
            ↓
          </button>
        </div>

        {/* Metadata strip */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
            paddingTop: 0,
          }}
        >
          {[
            [tp.director, "Achraf Chibane"],
            [tp.year, project.year],
            [tp.type, project.category.split("+")[0].trim()],
            ...(project.client ? [[tp.client, project.client]] : []),
          ].map(([label, value], i, arr) => (
            <div
              key={label}
              style={{
                paddingRight: i < arr.length - 1 ? 32 : 0,
                marginRight: i < arr.length - 1 ? 32 : 0,
                borderRight: i < arr.length - 1 ? "1px solid #1f1f1f" : "none",
                textAlign: "center",
              }}
            >
              <span
                className="font-mono uppercase block"
                style={{ fontSize: 9, letterSpacing: "0.2em", marginBottom: 4, color: "rgba(0,0,0,0.35)" }}
              >
                {label}
              </span>
              <span
                className="font-mono uppercase"
                style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(0,0,0,0.7)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 3 — OVERVIEW
      ══════════════════════════════════ */}
      {!project.poster && <section ref={overviewRef} style={{ padding: "72px 40px", borderBottom: "1px solid rgba(0,0,0,0.1)", background: "#f5f0e8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "40px 64px" }}>
            <div className="md:col-span-2">
              <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 20, color: "rgba(0,0,0,0.4)" }}>
                {tp.overview}
              </p>
              <p className="font-sans font-light leading-relaxed" style={{ fontSize: 17, color: "rgba(0,0,0,0.75)" }}>
                {project.description}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 10, color: "rgba(0,0,0,0.4)" }}>
                  {tp.services}
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {project.services.map((s) => (
                    <li key={s} className="font-sans font-light" style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                      · {s}
                    </li>
                  ))}
                </ul>
              </div>
              {project.client && (
                <div>
                  <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 10, color: "rgba(0,0,0,0.4)" }}>
                    {tp.client}
                  </p>
                  <p className="font-sans font-light" style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                    {project.client}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>}

      {/* ══════════════════════════════════
          SECTION 3b — MOVIE POSTER + INFO
      ══════════════════════════════════ */}
      {project.poster && (
        <section
          style={{
            background: "#060606",
            borderBottom: "1px solid #1f1f1f",
            padding: "80px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ghost year */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: -10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "clamp(10rem,20vw,20rem)",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "rgba(255,255,255,0.025)",
              letterSpacing: "-0.05em",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {project.year}
          </div>

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: "clamp(40px,6vw,80px)",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* ── Left: Poster ── */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                aspectRatio: "2/3",
                borderRadius: "10px 12px 11px 10px / 11px 10px 12px 10px",
                overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <img
                src={project.poster}
                alt={`${project.title} poster`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                draggable={false}
              />
              <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 3 }} aria-hidden />
            </motion.div>

            {/* ── Right: Film info ── */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >
              {/* Category label */}
              <p
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.45em", color: "#E8181C" }}
              >
                {project.category}
              </p>

              {/* Title */}
              <h2
                className="font-display font-bold uppercase"
                style={{
                  fontSize: "clamp(3rem,5.5vw,6.5rem)",
                  color: "#f0ede8",
                  lineHeight: "0.88em",
                  letterSpacing: "-0.04em",
                }}
              >
                {project.shortTitle}
              </h2>

              {/* Divider */}
              <div style={{ height: 1, background: "#1f1f1f" }} />

              {/* Info strip */}
              <div style={{ display: "flex", gap: 36 }}>
                <div>
                  <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(240,237,232,0.28)", marginBottom: 7 }}>{tp.year}</p>
                  <p className="font-mono" style={{ fontSize: 13, color: "#f0ede8" }}>{project.year}</p>
                </div>
                {project.client && (
                  <div>
                    <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(240,237,232,0.28)", marginBottom: 7 }}>{tp.productionLabel}</p>
                    <p className="font-mono" style={{ fontSize: 13, color: "#f0ede8" }}>{project.client}</p>
                  </div>
                )}
                <div>
                  <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(240,237,232,0.28)", marginBottom: 7 }}>Format</p>
                  <p className="font-mono" style={{ fontSize: 13, color: "#f0ede8" }}>
                    {project.category.split("+")[0].trim()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                className="font-sans font-light"
                style={{ fontSize: 15, color: "rgba(240,237,232,0.5)", lineHeight: 1.8 }}
              >
                {project.description}
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: "#1f1f1f" }} />

              {/* Crew */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {project.crew.map((member) => (
                  <div
                    key={member.role}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 16,
                    }}
                  >
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(240,237,232,0.28)", flexShrink: 0 }}
                    >
                      {member.role}
                    </span>
                    <span
                      className="font-display font-bold uppercase"
                      style={{
                        fontSize: "clamp(0.85rem,1.3vw,1.15rem)",
                        color: "#f0ede8",
                        letterSpacing: "0.02em",
                        textAlign: "right",
                      }}
                    >
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          SECTION 4 — REEL / VIDEO / ALBUMS
      ══════════════════════════════════ */}
      {project.editorialLayout ? (
        project.gallery.length > 0 ? (
          <EditorialAlbumSection
            gallery={project.gallery}
            shortTitle={project.shortTitle}
            imgStyle={imgStyle}
          />
        ) : null
      ) : project.concertLayout ? (
        /* ── Concert photo grid + 9:16 reels ── */
        <ConcertSection gallery={project.gallery} reels={project.reels ?? []} onPlay={(id) => setActiveVideo({ id, portrait: true })} imgStyle={imgStyle} />
      ) : project.pitchDecks ? (
        /* ── Pitch Deck cards ── */
        <section style={{ padding: "80px 40px", borderBottom: "1px solid #1f1f1f", background: "#080808" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: "0.45em", color: "#E8181C", marginBottom: 10 }}>
              Selected Work
            </p>
            <p className="font-mono uppercase text-center" style={{ fontSize: 8, letterSpacing: "0.25em", color: "rgba(255,255,255,0.18)", marginBottom: 56 }}>
              Click any deck to view all slides
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {project.pitchDecks.map((deck, i) => (
                <PitchDeckCard key={i} deck={deck} index={i} onOpen={setActiveDeck} />
              ))}
            </div>
          </div>
        </section>
      ) : project.brandingLayout ? (
        /* ── Brand identity case studies + Logofolio ── */
        <>
          {project.brandProjects?.map((bp: BrandCaseStudy, idx: number) => (
            <section key={idx} style={{ padding: "88px 40px", borderBottom: "1px solid #1f1f1f", background: idx % 2 === 0 ? "#080808" : "#060606" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.45em", color: "#E8181C", marginBottom: 56 }}>
                  Brand Identity · {String(idx + 1).padStart(2, "0")}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 72, alignItems: "flex-start" }}>

                  {/* Left: project info */}
                  <div>
                    {bp.industry && (
                      <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>
                        {bp.industry}
                      </p>
                    )}
                    <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(2rem,3.5vw,4rem)", lineHeight: 0.9, color: "#fff", letterSpacing: "-0.02em", marginBottom: 20 }}>
                      {bp.name}
                    </h2>
                    {bp.subtitle && (
                      <p className="font-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", marginBottom: 24 }}>
                        {bp.subtitle}
                      </p>
                    )}
                    <p className="font-sans font-light" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.85, marginBottom: 36 }}>
                      {bp.description}
                    </p>
                    {bp.scopeOfWork && bp.scopeOfWork.length > 0 && (
                      <div style={{ marginBottom: 32 }}>
                        <p className="font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.32em", color: "rgba(255,255,255,0.22)", marginBottom: 16 }}>
                          Scope of Work
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {bp.scopeOfWork.map((item: string, i: number) => (
                            <li key={i} style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 9 }}>
                              <span style={{ color: "#E8181C", fontSize: 10, flexShrink: 0, lineHeight: 1 }}>·</span>
                              <span className="font-sans font-light" style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {bp.note && (
                      <p className="font-sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", fontStyle: "italic", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        {bp.note}
                      </p>
                    )}
                  </div>

                  {/* Right: masonry image grid */}
                  {bp.images.length > 0 ? (
                    <div style={{ columns: 3, columnGap: 6, lineHeight: 0 }}>
                      {bp.images.map((src: string, i: number) => (
                        <div
                          key={i}
                          style={{ breakInside: "avoid", marginBottom: 6, borderRadius: 8, overflow: "hidden", cursor: "zoom-in" }}
                          onClick={() => setActiveImage(src)}
                        >
                          <img
                            src={src}
                            alt=""
                            style={{ width: "100%", display: "block", borderRadius: 8 }}
                            draggable={false}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Placeholder mosaic */
                    <div style={{ columns: 3, columnGap: 6, lineHeight: 0 }}>
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} style={{ breakInside: "avoid", marginBottom: 6, borderRadius: 8, border: "1px dashed rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", aspectRatio: i === 0 ? "3/4" : "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <p className="font-mono" style={{ fontSize: 7, color: "rgba(255,255,255,0.1)", letterSpacing: "0.2em" }}>{String(i + 1).padStart(2, "0")}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}

          {/* Logofolio */}
          {(project.logofolio ?? []).length > 0 ? (
            <section style={{ padding: "88px 40px", borderBottom: "1px solid #1f1f1f", background: "#050505" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <p className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.18)", marginBottom: 64 }}>
                  {tp.logofolio}
                </p>
                {(() => {
                  const logos = project.logofolio!
                  const cols = logos.length % 4 === 0 ? 4 : logos.length % 3 === 0 ? 3 : logos.length > 6 ? 4 : 3
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                      {logos.map((src: string, i: number) => (
                        <div
                          key={i}
                          onClick={() => setActiveImage(src)}
                          style={{
                            padding: "56px 32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: i % cols < cols - 1 ? "1px solid #161616" : "none",
                            borderBottom: i < logos.length - cols ? "1px solid #161616" : "none",
                            cursor: "zoom-in",
                          }}
                        >
                          <img src={src} alt="" style={{ maxWidth: "80%", maxHeight: 130, objectFit: "contain" }} draggable={false} />
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </section>
          ) : (
            /* Logofolio placeholder */
            <section style={{ padding: "88px 40px", borderBottom: "1px solid #1f1f1f", background: "#050505" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <p className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.18)", marginBottom: 64 }}>
                  {tp.logofolio}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "56px 32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: i % 4 < 3 ? "1px solid #161616" : "none",
                        borderBottom: i < 4 ? "1px solid #161616" : "none",
                        minHeight: 160,
                      }}
                    >
                      <div style={{ width: 120, height: 40, border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p className="font-mono" style={{ fontSize: 7.5, color: "rgba(255,255,255,0.1)", letterSpacing: "0.2em" }}>LOGO {String(i + 1).padStart(2, "0")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : project.themes ? (
        /* ── Theme galleries + Show reels (Le Balcon style) ── */
        <>
          {/* Theme containers */}
          <section style={{ padding: "72px 40px", borderBottom: "1px solid #1f1f1f", background: "#080808" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <p className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: "0.45em", color: "#E8181C", marginBottom: 48 }}>
                {project.themeSectionLabel ?? tp.exploreByGenre}
              </p>

              {/* Wide (16:9) cards — centered, one per row */}
              {project.themes.filter(t => t.aspectRatio === "16/9").map((theme, i) => (
                <div key={`wide-${i}`} style={{ maxWidth: 860, margin: "0 auto 8px" }}>
                  <ThemeCard theme={theme} index={project.themes!.indexOf(theme)} onOpen={setActiveTheme} imgStyle={imgStyle} />
                </div>
              ))}

              {/* Normal (4:3) cards — 3-col grid */}
              {(() => {
                const normal = project.themes.filter(t => t.aspectRatio !== "16/9")
                if (normal.length === 0) return null
                return (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: normal.length >= 3 ? "repeat(3, 1fr)" : "1fr 1fr",
                    gap: 8,
                    marginTop: project.themes!.some(t => t.aspectRatio === "16/9") ? 0 : 0,
                  }}>
                    {normal.map((theme) => (
                      <ThemeCard key={theme.name} theme={theme} index={project.themes!.indexOf(theme)} onOpen={setActiveTheme} imgStyle={imgStyle} />
                    ))}
                  </div>
                )
              })()}
            </div>
          </section>

          {/* Reels */}
          {project.reels && project.reels.length > 0 && (
            <section style={{ padding: "72px 40px", borderBottom: "1px solid #1f1f1f", background: "#060606" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <p className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.25)", marginBottom: 48 }}>
                  {project.reelSectionLabel ?? tp.showTeasers}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  {project.reels.map((reel, i) => (
                    <div key={i} style={{ width: "min(380px, 100%)" }}>
                      <ReelCard reel={reel} onPlay={(id) => setActiveVideo({ id, portrait: true })} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Event Posters */}
          {project.posters && project.posters.length > 0 && (
            <PosterShowcase posters={project.posters} imgStyle={imgStyle} />
          )}
        </>
      ) : project.reels && project.reels.length > 0 ? (
        /* ── Standalone 9:16 reels + gallery marquee ── */
        <>
          <section style={{ background: "#080808", padding: "72px 28px 80px", borderBottom: "1px solid #1f1f1f" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.45em", color: "rgba(255,255,255,0.2)" }}>
                  {project.reelSectionLabel ?? tp.shortFormContent}
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(project.reels.length, 3)}, 1fr)`, gap: 16, justifyContent: "center" }}>
                {project.reels.map((reel, i) => (
                  <ReelCard key={i} reel={reel} onPlay={(id) => setActiveVideo({ id, portrait: true })} />
                ))}
              </div>
            </div>
          </section>

          {/* Gallery marquee — directly after reels */}
          {project.gallery.length > 0 && (
            <section style={{ background: "#060606", padding: "64px 0 72px", borderBottom: "1px solid #1f1f1f", overflow: "hidden" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <GalleryBadge />
              </div>
              <div style={{ overflow: "hidden", marginBottom: 10 }}>
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                  style={{ display: "flex", gap: 10, width: "max-content" }}
                >
                  {[...project.gallery, ...project.gallery].map((src, i) => (
                    <div key={i} style={{ flexShrink: 0, width: [280, 360, 220, 300, 240, 320][i % 6], height: 340, borderRadius: 10, overflow: "hidden" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: i % 3 === 0 ? "brightness(0.72)" : i % 3 === 1 ? "none" : "grayscale(0.35) brightness(0.82)", ...imgStyle(src) }} draggable={false} />
                    </div>
                  ))}
                </motion.div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  animate={{ x: ["-50%", "0%"] }}
                  transition={{ duration: 34, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                  style={{ display: "flex", gap: 10, width: "max-content" }}
                >
                  {[...project.gallery.slice().reverse(), ...project.gallery.slice().reverse()].map((src, i) => (
                    <div key={i} style={{ flexShrink: 0, width: [320, 240, 380, 260, 300, 210][i % 6], height: 280, borderRadius: 10, overflow: "hidden" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: i % 2 === 0 ? "brightness(0.78) saturate(0.8)" : "brightness(0.9)", ...imgStyle(src) }} draggable={false} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>
          )}
        </>
      ) : project.albums ? (
        /* ── Photo Album sections ── */
        <section style={{ background: "#f5f0e8", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          {project.albums.map((album: PhotoAlbum, idx: number) => (
            <div
              key={album.label}
              style={{
                padding: "72px 40px",
                borderBottom: idx < (project.albums?.length ?? 0) - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
              }}
            >
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                {/* Album header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 40,
                    marginBottom: 36,
                    paddingBottom: 20,
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <div>
                    <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.38em", color: "#E8181C", marginBottom: 10 }}>
                      {String(idx + 1).padStart(2, "0")} · Album
                    </p>
                    <h3 className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.8rem,3vw,3.2rem)", lineHeight: 0.9, color: "#0a0a0a" }}>
                      {album.label}
                    </h3>
                  </div>
                  {album.description && (
                    <p className="font-sans font-light" style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", maxWidth: 340, textAlign: "right", lineHeight: 1.75 }}>
                      {album.description}
                    </p>
                  )}
                </div>

                {/* Photo grid */}
                {album.images.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${album.columns ?? 3}, 1fr)`, gap: 8 }}>
                    {album.images.map((src, i) => (
                      <div key={i} style={{ position: "relative", aspectRatio: album.aspectRatio ?? "4/3", borderRadius: 6, overflow: "hidden" }}>
                        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos(src) }} draggable={false} />
                        <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 10 }} aria-hidden />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Placeholder grid — shown until real photos are added */
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${album.columns ?? 3}, 1fr)`, gap: 8 }}>
                    {Array.from({ length: album.columns ?? 6 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          aspectRatio: album.aspectRatio ?? "4/3",
                          borderRadius: 6,
                          border: "1px dashed rgba(0,0,0,0.12)",
                          background: "rgba(0,0,0,0.03)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px dashed rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.2)" }}>+</span>
                        </div>
                        <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.25em", color: "rgba(0,0,0,0.2)" }}>
                          Photo {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </section>
      ) : null}

      {/* ══════════════════════════════════
          SECTION 4b — RECIPE REELS
      ══════════════════════════════════ */}
      {project.recipeReels && project.recipeReels.length > 0 && (
        <section style={{ background: "#f5f0e8", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "72px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 36, paddingBottom: 20, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
              <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.38em", color: "#E8181C", marginBottom: 10 }}>
                {tp.recipeDirection}
              </p>
              <h3 className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.8rem,3vw,3.2rem)", lineHeight: 0.9, color: "#0a0a0a" }}>
                {tp.recipeLabel}
              </h3>
            </div>
            {/* 3 portrait reel cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {project.recipeReels.map((reel, i) => (
                <motion.div
                  key={i}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  onClick={() => reel.videoId && setActiveVideo({ id: reel.videoId, portrait: true })}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "9/16",
                    borderRadius: FRAME_RADIUS,
                    cursor: reel.videoId ? "pointer" : "default",
                    background: "#0a0a0a",
                  }}
                >
                  {reel.cover ? (
                    <motion.img
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      src={reel.cover}
                      alt={reel.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objPos(reel.cover) }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.2)" }}>▶</span>
                      </div>
                      <span className="font-mono uppercase" style={{ fontSize: 8, letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)" }}>
                        {reel.title}
                      </span>
                    </div>
                  )}
                  {reel.cover && (
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)" }} />
                  )}
                  {reel.videoId && (
                    <motion.div
                      variants={{ rest: { opacity: 0, scale: 0.85 }, hover: { opacity: 1, scale: 1 } }}
                      transition={{ duration: 0.25 }}
                      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(232,24,28,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </motion.div>
                  )}
                  <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 10 }} aria-hidden />
                  <p className="font-mono uppercase" style={{ position: "absolute", bottom: 14, left: 14, fontSize: 8, letterSpacing: "0.3em", color: "rgba(255,255,255,0.45)", zIndex: 11 }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!project.albums && !project.editorialLayout && !project.concertLayout && !project.themes && !project.pitchDecks && !project.brandingLayout && (
        /* ── Video / Reel section (all other projects) ── */
        <section style={{ padding: "72px 28px", borderBottom: "1px solid rgba(0,0,0,0.1)", background: "#f5f0e8" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 24, textAlign: "center", color: "rgba(0,0,0,0.4)" }}>
              {project.videos ? tp.productionReels : tp.productionReel}
            </p>

            {project.videos ? (
              /* ── Multi-video grid ── */
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {project.videos.map((video, i) => (
                  <VideoCard key={i} video={video} onPlay={(id) => setActiveVideo({ id, portrait: false })} objPos={objPos(video.cover ?? "")} />
                ))}
              </div>
            ) : (
              /* ── Single reel ── */
              <div
                style={{
                  position: "relative",
                  borderRadius: FRAME_RADIUS,
                  overflow: "hidden",
                  aspectRatio: "16/9",
                  boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <img src={project.cover} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
                <button
                  onClick={() => project.videoUrl && setActiveVideo({ id: project.videoUrl, portrait: false })}
                  style={{
                    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 16,
                    cursor: project.videoUrl ? "pointer" : "default",
                  }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E8181C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path d="M1 1L17 10L1 19V1Z" fill="white" />
                    </svg>
                  </div>
                  <span className="font-display font-bold uppercase text-[#E8181C]" style={{ fontSize: "clamp(1.2rem,2.5vw,2rem)", letterSpacing: "0.1em" }}>
                    {tp.watchReel}
                  </span>
                </button>
                <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          SECTION 4b — GALLERY (auto-scroll marquee)
      ══════════════════════════════════ */}
      {project.gallery.length > 0 && !project.pitchDecks && !project.concertLayout && !project.reels && !project.editorialLayout && !project.brandingLayout && <section style={{ background: "#060606", padding: "64px 0 72px", borderBottom: "1px solid #1f1f1f", overflow: "hidden" }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <GalleryBadge />
        </div>

        {/* Row 1 — scrolls LEFT */}
        <div style={{ overflow: "hidden", marginBottom: 10 }}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            style={{ display: "flex", gap: 10, width: "max-content", alignItems: "center" }}
          >
            {[...project.gallery, ...project.gallery].map((src, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: project.galleryLandscape
                    ? [500, 560, 480, 540, 520, 500][i % 6]
                    : [280, 360, 220, 300, 240, 320][i % 6],
                  height: project.galleryLandscape
                    ? Math.round([500, 560, 480, 540, 520, 500][i % 6] * 9 / 16)
                    : 340,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: i % 3 === 0 ? "brightness(0.72)" : i % 3 === 1 ? "none" : "grayscale(0.35) brightness(0.82)",
                    ...imgStyle(src),
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 — scrolls RIGHT */}
        <div style={{ overflow: "hidden" }}>
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            style={{ display: "flex", gap: 10, width: "max-content", alignItems: "center" }}
          >
            {[...project.gallery.slice().reverse(), ...project.gallery.slice().reverse()].map((src, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: project.galleryLandscape
                    ? [540, 480, 580, 500, 560, 520][i % 6]
                    : [320, 240, 380, 260, 300, 210][i % 6],
                  height: project.galleryLandscape
                    ? Math.round([540, 480, 580, 500, 560, 520][i % 6] * 9 / 16)
                    : 280,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: i % 2 === 0 ? "brightness(0.78) saturate(0.8)" : "brightness(0.9)",
                    ...imgStyle(src),
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>}

      {/* ══════════════════════════════════
          SECTION 5 — CREDITS
      ══════════════════════════════════ */}
      <section style={{ borderBottom: "1px solid #1f1f1f", padding: "28px", background: "#f5f0e8" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "1.2rem", alignItems: "stretch" }}>

          {/* ── Left: cover image card ── */}
          <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", minHeight: 360 }}>
            <img
              src={project.creditsCover ?? project.cover}
              alt={project.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...imgStyle(project.creditsCover ?? project.cover) }}
            />
            <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.6 }} />
            <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1.2rem", color: "#f5f0e8", textTransform: "uppercase" }}>
              <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", marginBottom: "0.8rem", opacity: 0.5 }}>
                {featuredCrew[0]?.role}
              </span>
              <span className="font-display font-bold uppercase" style={{ fontSize: "clamp(2rem,3vw,3.2rem)", lineHeight: "0.9em", display: "block" }}>
                {featuredCrew[0]?.name}
              </span>
            </div>
          </div>

          {/* ── Right: crew grid stack ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

            {/* Row 1 — featured (Director / Editor), black bg, dashed divider */}
            <div style={{ borderRadius: 6, overflow: "hidden", background: "#0a0a0a" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {featuredCrew.map((member, i) => (
                  <div
                    key={member.role}
                    style={{
                      padding: "1.2rem",
                      textAlign: "center",
                      borderRight: i < featuredCrew.length - 1 ? "1px dashed rgba(245,240,232,0.2)" : "none",
                    }}
                  >
                    <span className="font-mono uppercase block" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", marginBottom: "0.8rem", color: "rgba(245,240,232,0.4)" }}>
                      {member.role}
                    </span>
                    <span className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.8rem,2.8vw,3.2rem)", lineHeight: "0.9em", display: "block", color: "#f5f0e8", wordBreak: "break-word" }}>
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 — secondary crew: per-column black headers + names with dashed border */}
            {secondaryCrew.length > 0 && (
              <div style={{ borderRadius: 6, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${secondaryCrew.length}, 1fr)` }}>
                  {secondaryCrew.map((member, i) => (
                    <div
                      key={member.role + "-h"}
                      style={{
                        background: "#0a0a0a",
                        height: "2.6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: i < secondaryCrew.length - 1 ? "1px dashed rgba(245,240,232,0.15)" : "none",
                      }}
                    >
                      <span className="font-mono uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(245,240,232,0.35)" }}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${secondaryCrew.length}, 1fr)`,
                    border: "1px dashed rgba(0,0,0,0.15)",
                    borderTop: "none",
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                  }}
                >
                  {secondaryCrew.map((member, i) => (
                    <div
                      key={member.role}
                      style={{
                        padding: "1.2rem",
                        textAlign: "center",
                        borderRight: i < secondaryCrew.length - 1 ? "1px dashed rgba(0,0,0,0.12)" : "none",
                      }}
                    >
                      <span className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.6rem,2.5vw,3rem)", lineHeight: "0.9em", display: "block", color: "#0a0a0a", wordBreak: "break-word" }}>
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 3 — additional credits */}
            {extraCrew.length > 0 && (
              <div style={{ borderRadius: 6, overflow: "hidden" }}>
                <div style={{ background: "#E8181C", height: "2.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="font-display font-bold uppercase text-white" style={{ fontSize: "0.65rem", letterSpacing: "0.3em" }}>
                    {tp.additionalCredits}
                  </span>
                </div>
                <div
                  style={{
                    border: "1px dashed rgba(0,0,0,0.15)",
                    outline: "3px dashed rgba(0,0,0,0.06)",
                    borderTop: "none",
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                  }}
                >
                  {extraCrew.map((member, i) => (
                    <div
                      key={member.role}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.9rem 1.2rem",
                        borderTop: i > 0 ? "1px dashed rgba(0,0,0,0.1)" : "none",
                      }}
                    >
                      <span className="font-mono uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", flex: 1, color: "rgba(0,0,0,0.35)" }}>
                        {member.role}
                      </span>
                      <span className="font-display font-bold uppercase" style={{ fontSize: "clamp(1rem,1.8vw,2rem)", whiteSpace: "nowrap", color: "#0a0a0a" }}>
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 5B — EXTENDED CREDITS (optional)
      ══════════════════════════════════ */}
      {project.extendedCredits && (
        <section style={{ background: "#060606", borderBottom: "1px solid #1f1f1f", padding: "64px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p className="font-mono uppercase text-center" style={{ fontSize: 9, letterSpacing: "0.4em", marginBottom: 52, color: "#333" }}>
              {tp.fullCredits}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "48px 40px",
              }}
            >
              {project.extendedCredits.map((block) => (
                <div key={block.label}>
                  <p
                    className="font-mono uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.3em", marginBottom: 16, color: "#E8181C" }}
                  >
                    {block.label}
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {block.names.map((name) => (
                      <li
                        key={name}
                        className="font-display font-bold uppercase text-[#f0ede8]"
                        style={{ fontSize: "clamp(1rem,1.6vw,1.4rem)", lineHeight: 1.1, letterSpacing: "0.01em" }}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          SECTION 6b — SELECTED FRAMES (stills)
      ══════════════════════════════════ */}
      {project.stills && project.stills.length > 0 && (
        <StillsSection stills={project.stills} objPos={objPos} imgStyle={imgStyle} />
      )}

      {/* ══════════════════════════════════
          SECTION 7 — RESULTS (if any)
      ══════════════════════════════════ */}
      {project.results && (() => {
        const bgSrc = project.resultsBg ?? project.cover
        const rows: Array<{ stat: string; label: string }> = project.resultsData?.length
          ? project.resultsData
          : project.results.map(r => {
              const words = r.trim().split(/\s+/)
              return { stat: words[0], label: words.slice(1).join(" ") }
            })
        return (
          <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(0,0,0,0.1)", background: "#f5f0e8" }}>
            <img
              src={bgSrc}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...imgStyle(bgSrc) }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
            <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "96px 40px", textAlign: "center" }}>
              <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 48, color: "rgba(255,255,255,0.25)" }}>
                {tp.results}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${rows.length}, 1fr)`, gap: 2, background: "rgba(255,255,255,0.06)" }}>
                {rows.map(({ stat, label }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: "48px 32px", background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
                  >
                    <p className="font-display font-bold uppercase text-[#E8181C]" style={{ fontSize: "clamp(1.4rem,2.8vw,2.6rem)", lineHeight: 1.05, marginBottom: 10 }}>
                      {stat}
                    </p>
                    <p className="font-mono text-[#f0ede8]/50 uppercase" style={{ fontSize: 9, letterSpacing: "0.2em" }}>
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ══════════════════════════════════
          SECTION 8 — NEXT PROJECT
      ══════════════════════════════════ */}
      <section style={{ padding: "0 28px 28px", paddingTop: 28, background: "#f5f0e8" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
          {/* All Work card */}
          <Link
            href="/work"
            className="group"
            style={{
              border: "1px dashed rgba(0,0,0,0.2)",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 320,
            }}
          >
            <p className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(0,0,0,0.3)" }}>
              Showcase
            </p>
            <div>
              <h3
                className="font-display font-bold uppercase group-hover:text-[#E8181C] transition-colors duration-300"
                style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: 1, marginBottom: 24, color: "#0a0a0a" }}
              >
                {tp.allWork}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)" }}>
                  Explore
                </span>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "rgba(0,0,0,0.4)",
                  }}
                >
                  →
                </div>
              </div>
            </div>
          </Link>

          {/* Next project card */}
          <Link
            href={`/work/${nextProject.slug}`}
            className="group relative overflow-hidden"
            style={{
              borderRadius: "10px 10px 10px 10px",
              minHeight: 320,
              position: "relative",
            }}
          >
            <SerratedEdge side="right" />
            <img
              src={nextProject.cover}
              alt={nextProject.shortTitle}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.7s ease",
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
              }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}>
              <p className="font-mono text-white/40 uppercase" style={{ fontSize: 9, letterSpacing: "0.25em", marginBottom: 8 }}>
                Next Showcase
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <h3
                  className="font-display font-bold uppercase text-[#f0ede8]"
                  style={{ fontSize: "clamp(1.5rem,3vw,3rem)", lineHeight: 1 }}
                >
                  {nextProject.shortTitle}
                </h3>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#E8181C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginLeft: 16,
                  }}
                >
                  <span style={{ color: "white", fontSize: 16 }}>→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>


      <Footer />

      {/* YouTube Lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <YouTubeLightbox videoId={activeVideo.id} portrait={activeVideo.portrait} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      {/* Gallery Lightbox */}
      <AnimatePresence>
        {activeTheme && (
          <GalleryLightbox theme={activeTheme} onClose={() => setActiveTheme(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeDeck && (
          <SlideshowLightbox deck={activeDeck} onClose={() => setActiveDeck(null)} />
        )}
      </AnimatePresence>

      {/* Image lightbox */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setActiveImage(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "zoom-out", padding: "40px",
            }}
          >
            <motion.img
              src={activeImage}
              alt=""
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 6, cursor: "default" }}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
            <button
              onClick={() => setActiveImage(null)}
              style={{ position: "absolute", top: 20, right: 28, background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: 30, lineHeight: 1, cursor: "pointer" }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
