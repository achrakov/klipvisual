"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { LoadingIntro } from "@/app/components/LoadingIntro"
import { HeroGallery } from "@/app/components/HeroGallery"
import { Footer } from "@/app/components/Footer"
import { featuredProjects } from "@/app/data/projects"
import type { Project } from "@/app/data/projects"
import { useLang } from "@/app/i18n/LanguageContext"

const FRAME_RADIUS = "10px 12px 11px 10px / 11px 10px 12px 10px"

const clients = [
  "TikTok Canada",
  "Boudchart",
  "La Famille QA",
  "Romeo & Fils",
  "Coach Racicot",
  "L'Olympia",
]

function SelectedWorkCard({ project, index }: { project: Project; index: number }) {
  const { href } = useLang()
  return (
    <Link href={href(`/work/${project.slug}`)} style={{ display: "block", textDecoration: "none" }}>
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        style={{
          position: "relative",
          overflow: "hidden",
          height: index === 0 ? "62vh" : "55vh",
          borderRadius: FRAME_RADIUS,
          cursor: "pointer",
        }}
      >
        <motion.img
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          src={project.cover}
          alt={project.shortTitle}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(4,2,0,0.90) 0%, rgba(4,2,0,0.18) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <span
          className="font-display font-bold pointer-events-none select-none absolute"
          style={{
            top: "4%",
            right: 24,
            fontSize: "clamp(7rem,16vw,20rem)",
            lineHeight: 1,
            color: "rgba(255,255,255,0.03)",
            letterSpacing: "-0.04em",
          }}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <motion.p
                variants={{ rest: { opacity: 0.35 }, hover: { opacity: 0.65 } }}
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.3em", marginBottom: 10 }}
              >
                {project.category.split("+")[0].trim()} · {project.year}
              </motion.p>
              <h3
                className="font-display font-bold uppercase text-[#f0ede8]"
                style={{ fontSize: "clamp(2.2rem,4.5vw,5rem)", lineHeight: 0.88, letterSpacing: "-0.01em" }}
              >
                {project.shortTitle}
              </h3>
            </div>
            <motion.div
              variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flexShrink: 0,
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#E8181C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: "white",
              }}
            >
              →
            </motion.div>
          </div>
        </div>
        <div className="grain-overlay-frame absolute inset-0 pointer-events-none" style={{ zIndex: 50 }} aria-hidden />
      </motion.div>
    </Link>
  )
}

function ServiceAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t, href } = useLang()
  const items = t.home.services.items

  return (
    <div>
      {items.map((svc, i) => (
        <div key={svc.num} style={{ borderTop: "1px solid #1f1f1f" }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left"
            style={{ padding: "28px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="font-mono text-[#333]" style={{ fontSize: 10, letterSpacing: "0.3em", flexShrink: 0 }}>
                {svc.num}
              </span>
              <span
                className="font-display font-bold uppercase text-[#f0ede8]"
                style={{ fontSize: "clamp(1.8rem,3.5vw,3.5rem)", lineHeight: 1 }}
              >
                {svc.label}
              </span>
            </div>
            <motion.span
              animate={{ rotate: openIndex === i ? 45 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[#555] flex-shrink-0"
              style={{ fontSize: 24, lineHeight: 1 }}
            >
              +
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="m-col m-gap-sm m-pl0"
                  style={{
                    paddingBottom: 36,
                    paddingLeft: 62,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 40,
                  }}
                >
                  <p className="font-sans text-[#555] font-light leading-relaxed" style={{ fontSize: 14, maxWidth: 520 }}>
                    {svc.desc}
                  </p>
                  <Link
                    href={svc.href}
                    className="group relative inline-flex items-center gap-2 overflow-hidden font-mono text-[#555] flex-shrink-0"
                    style={{ border: "1px solid #1f1f1f", padding: "12px 24px", fontSize: 9, letterSpacing: "0.3em" }}
                  >
                    <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 uppercase group-hover:text-white transition-colors duration-300">{t.home.services.explore}</span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">→</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #1f1f1f" }} />
    </div>
  )
}

export default function HomePage() {
  const [entered, setEntered] = useState(false)
  const { t, href } = useLang()

  return (
    <>
      <LoadingIntro onComplete={() => setEntered(true)} />

      <main
        className={`transition-opacity duration-700 ${
          entered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <HeroGallery />

        {/* ── Stats ── */}
        <section style={{ borderTop: "1px solid #1f1f1f" }}>
          <div className="grid grid-cols-2 md:grid-cols-6">
            {t.home.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderRight: i < t.home.stats.length - 1 ? "1px solid #1f1f1f" : "none",
                  borderBottom: "1px solid #1f1f1f",
                }}
                className="flex flex-col items-center justify-center text-center py-12 px-4"
              >
                <p className="font-display font-bold leading-none text-[#f0ede8]" style={{ fontSize: "clamp(2rem,3.5vw,3.5rem)" }}>
                  {s.value}
                </p>
                <p className="font-mono uppercase text-[#444] mt-2 whitespace-pre-line leading-relaxed" style={{ fontSize: 9, letterSpacing: "0.18em" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Marquee ── */}
        <div style={{ borderBottom: "1px solid #1f1f1f", padding: "18px 0", overflow: "hidden" }}>
          <div className="flex whitespace-nowrap" style={{ animation: "marquee 18s linear infinite" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="font-display font-bold uppercase text-[#1f1f1f] mr-12 tracking-widest select-none"
                style={{ fontSize: "clamp(1rem,1.8vw,1.4rem)" }}
              >
                Video Production &nbsp;·&nbsp; Photography &nbsp;·&nbsp; Brand
                Identity &nbsp;·&nbsp; Content Creation &nbsp;·&nbsp; Creative
                Direction &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── Selected Work ── */}
        <section style={{ padding: "80px 28px", borderBottom: "1px solid #1f1f1f" }}>
          <div className="m-col m-gap-sm" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, padding: "0 4px" }}>
            <div>
              <p className="font-mono text-[#444] uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 14 }}>
                {t.home.selectedWork.label}
              </p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display font-bold uppercase leading-none text-[#f0ede8]"
                style={{ fontSize: "clamp(2.5rem,5vw,5rem)" }}
              >
                {t.home.selectedWork.heading1}<br />{t.home.selectedWork.heading2}
              </motion.h2>
            </div>
            <Link
              href={href("/work")}
              className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#555] uppercase flex-shrink-0"
              style={{ border: "1px solid #1f1f1f", padding: "14px 28px", fontSize: 10, letterSpacing: "0.25em" }}
            >
              <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">{t.home.selectedWork.viewAll}</span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">→</span>
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {featuredProjects.slice(0, 3).map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <SelectedWorkCard project={project} index={i} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Services Accordion ── */}
        <section style={{ padding: "80px 0 80px", borderBottom: "1px solid #1f1f1f" }}>
          <div className="m-px" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
            <div
              className="m-col m-gap-sm"
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 48,
                paddingBottom: 32,
                borderBottom: "1px solid #1f1f1f",
              }}
            >
              <div>
                <p className="font-mono text-[#444] uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16 }}>
                  {t.home.services.label}
                </p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display font-bold uppercase leading-none text-[#f0ede8]"
                  style={{ fontSize: "clamp(2.5rem,4.5vw,4.5rem)" }}
                >
                  {t.home.services.heading}
                </motion.h2>
              </div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <Link
                  href={href("/services")}
                  className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#555] uppercase"
                  style={{ border: "1px solid #1f1f1f", padding: "14px 28px", fontSize: 10, letterSpacing: "0.25em" }}
                >
                  <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">{t.home.services.allServices}</span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">→</span>
                </Link>
              </motion.div>
            </div>
            <ServiceAccordion />
          </div>
        </section>

        {/* ── Clients ── */}
        <section className="m-px" style={{ padding: "80px 40px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p className="font-mono text-center uppercase" style={{ fontSize: 9, letterSpacing: "0.4em", marginBottom: 52, color: "#333" }}>
              {t.home.clients.label}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              {clients.map((name, i) => (
                <div key={name} style={{ display: "flex", alignItems: "center" }}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display font-bold uppercase"
                    style={{
                      fontSize: "clamp(1.2rem,2.2vw,2.6rem)",
                      color: "#1e1e1e",
                      letterSpacing: "0.03em",
                      padding: "0 24px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {name}
                  </motion.span>
                  {i < clients.length - 1 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.05, duration: 0.4 }}
                      style={{ width: 5, height: 5, borderRadius: "50%", background: "#E8181C", flexShrink: 0, display: "inline-block" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Philosophy ── */}
        <section className="m-px" style={{ padding: "120px 40px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[#444] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 40 }}
            >
              {t.home.philosophy.label}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold uppercase text-[#f0ede8] m-h-xl"
              style={{ fontSize: "clamp(3rem,6vw,6rem)", lineHeight: 0.9, marginBottom: 40 }}
            >
              {t.home.philosophy.line1}<br />
              {t.home.philosophy.line2}{" "}
              <em className="not-italic text-[#E8181C]">{t.home.philosophy.line3}</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-sans text-[#555] font-light leading-relaxed"
              style={{ fontSize: 15, maxWidth: 520, margin: "0 auto", textAlign: "center" }}
            >
              {t.home.philosophy.body}
            </motion.p>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="m-cta" style={{ margin: "0 32px 32px", background: "#E8181C", padding: "80px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display font-bold uppercase leading-none text-[#0a0a0a] m-h-lg"
                style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}
              >
                {t.home.cta.line1}<br />{t.home.cta.line2}<br />{t.home.cta.line3}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0"
              >
                <Link
                  href={href("/contact")}
                  className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#0a0a0a] uppercase"
                  style={{ border: "2px solid #0a0a0a", padding: "20px 44px", fontSize: 11, letterSpacing: "0.25em" }}
                >
                  <span className="absolute inset-0 bg-[#0a0a0a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-[#f0ede8] transition-colors duration-300">{t.home.cta.button}</span>
                  <span className="relative z-10 group-hover:text-[#f0ede8] transition-colors duration-300">→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
