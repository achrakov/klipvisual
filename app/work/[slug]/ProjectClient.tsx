"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import type { Project } from "../../data/projects"
import { Footer } from "../../components/Footer"

const FRAME_RADIUS = "10px 12px 11px 10px / 11px 10px 12px 10px"

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
        Gallery
      </span>
    </div>
  )
}

export default function ProjectClient({ project, nextProject }: Props) {
  const [reelVisible, setReelVisible] = useState(false)

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
        <Image
          src="/Logos/Logo.png"
          alt="KLIPVISUAL"
          width={140}
          height={38}
          style={{ height: 38, width: "auto", objectFit: "contain", display: "block" }}
        />
      </div>

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
          All Work
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
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
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
            ["Director", "Achraf Chibane"],
            ["Year", project.year],
            ["Type", project.category.split("+")[0].trim()],
            ...(project.client ? [["Client", project.client]] : []),
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
      <section ref={overviewRef} style={{ padding: "72px 40px", borderBottom: "1px solid rgba(0,0,0,0.1)", background: "#f5f0e8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "40px 64px" }}>
            <div className="md:col-span-2">
              <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 20, color: "rgba(0,0,0,0.4)" }}>
                Overview
              </p>
              <p className="font-sans font-light leading-relaxed" style={{ fontSize: 17, color: "rgba(0,0,0,0.75)" }}>
                {project.description}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div>
                <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 10, color: "rgba(0,0,0,0.4)" }}>
                  Services
                </p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {project.services.map((s) => (
                    <li key={s} className="font-sans font-light" style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                      — {s}
                    </li>
                  ))}
                </ul>
              </div>
              {project.client && (
                <div>
                  <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 10, color: "rgba(0,0,0,0.4)" }}>
                    Client
                  </p>
                  <p className="font-sans font-light" style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                    {project.client}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 4 — REEL / VIDEO
      ══════════════════════════════════ */}
      <section style={{ padding: "72px 28px", borderBottom: "1px solid rgba(0,0,0,0.1)", background: "#f5f0e8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 24, textAlign: "center", color: "rgba(0,0,0,0.4)" }}>
            Production Reel
          </p>
          <div
            style={{
              position: "relative",
              borderRadius: FRAME_RADIUS,
              overflow: "hidden",
              aspectRatio: "16/9",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <img
              src={project.cover}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

            {/* Play button */}
            <button
              onClick={() => project.videoUrl && setReelVisible(true)}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                cursor: project.videoUrl ? "pointer" : "default",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#E8181C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <path d="M1 1L17 10L1 19V1Z" fill="white" />
                </svg>
              </div>
              <span
                className="font-display font-bold uppercase text-[#E8181C]"
                style={{ fontSize: "clamp(1.2rem,2.5vw,2rem)", letterSpacing: "0.1em" }}
              >
                Watch Reel
              </span>
            </button>

            {/* Film grain */}
            <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 5 — CREDITS
      ══════════════════════════════════ */}
      <section style={{ borderBottom: "1px solid #1f1f1f", padding: "28px", background: "#f5f0e8" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "1.2rem", alignItems: "stretch" }}>

          {/* ── Left: cover image card ── */}
          <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", minHeight: 360 }}>
            <img
              src={project.cover}
              alt={project.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.6 }} />
            <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1.2rem", color: "#f5f0e8", textTransform: "uppercase" }}>
              <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", marginBottom: "0.8rem", opacity: 0.5 }}>
                {featuredCrew[0]?.role}
              </span>
              <span className="font-display font-bold" style={{ fontSize: "clamp(2rem,3vw,3.2rem)", lineHeight: "0.85em", display: "block" }}>
                {featuredCrew[0]?.name.split(" ").map((w, i) => <span key={i} style={{ display: "block" }}>{w}</span>)}
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
                    <span className="font-display font-bold uppercase" style={{ fontSize: "clamp(2rem,3vw,3.2rem)", lineHeight: "0.85em", display: "block", color: "#f5f0e8" }}>
                      {member.name.split(" ").map((w, j) => <span key={j} style={{ display: "block" }}>{w}</span>)}
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
                      <span className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.6rem,2.5vw,3rem)", lineHeight: "0.85em", display: "block", color: "#0a0a0a" }}>
                        {member.name.split(" ").map((w, j) => <span key={j} style={{ display: "block" }}>{w}</span>)}
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
                    Additional Credits
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
          SECTION 6 — GALLERY (auto-scroll marquee)
      ══════════════════════════════════ */}
      <section style={{ background: "#060606", padding: "64px 0 72px", borderBottom: "1px solid #1f1f1f", overflow: "hidden" }}>
        {/* Badge */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <GalleryBadge />
        </div>

        {/* Row 1 — scrolls LEFT */}
        <div style={{ overflow: "hidden", marginBottom: 10 }}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            style={{ display: "flex", gap: 10, width: "max-content" }}
          >
            {[...project.gallery, ...project.gallery].map((src, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: [280, 360, 220, 300, 240, 320][i % 6],
                  height: 340,
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
            style={{ display: "flex", gap: 10, width: "max-content" }}
          >
            {[...project.gallery.slice().reverse(), ...project.gallery.slice().reverse()].map((src, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: [320, 240, 380, 260, 300, 210][i % 6],
                  height: 280,
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
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 7 — RESULTS (if any)
      ══════════════════════════════════ */}
      {project.results && (
        <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(0,0,0,0.1)", background: "#f5f0e8" }}>
          <img
            src={project.cover}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "96px 40px", textAlign: "center" }}>
            <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 48, color: "rgba(0,0,0,0.4)" }}>
              Results
            </p>
            <div
              style={{ display: "grid", gridTemplateColumns: `repeat(${project.results.length}, 1fr)`, gap: 2, background: "rgba(255,255,255,0.06)" }}
            >
              {project.results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: "48px 32px", background: "rgba(0,0,0,0.4)" }}
                >
                  <p
                    className="font-display font-bold uppercase text-[#E8181C]"
                    style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", lineHeight: 1, marginBottom: 8 }}
                  >
                    {result.replace(/[^0-9+×%KMB.]/g, "") || result.split(" ")[0]}
                  </p>
                  <p
                    className="font-mono text-[#f0ede8]/50 uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.2em" }}
                  >
                    {result.replace(/^[\d.+×%KMB]+\s*/, "")}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                All Work
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
                Next — Showcase
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
    </>
  )
}
