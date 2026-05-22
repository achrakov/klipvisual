"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { LoadingIntro } from "./components/LoadingIntro"
import { HeroGallery } from "./components/HeroGallery"
import { Footer } from "./components/Footer"

const stats = [
  { value: "7+", label: "Years\nExperience" },
  { value: "80+", label: "Projects\nDelivered" },
  { value: "1.2M", label: "Combined\nReach" },
  { value: "3", label: "Countries\nActive" },
  { value: "500K+", label: "Social\nImpressions" },
  { value: "100%", label: "Client\nSatisfaction" },
]

const services = [
  {
    num: "01",
    label: "Video Production",
    desc: "From concept to final cut — cinematic content for brand campaigns, live events, and social media. Every frame crafted with a filmmaker's eye.",
    href: "/services#video",
  },
  {
    num: "02",
    label: "Photography",
    desc: "Editorial portraits, food, events, and lifestyle. Intentional composition, natural light, and a visual language built around your brand.",
    href: "/services#photography",
  },
  {
    num: "03",
    label: "Design & Branding",
    desc: "Visual identity that commands attention — logos, color systems, typography, and brand guidelines built to last across every medium.",
    href: "/services#design",
  },
  {
    num: "04",
    label: "Content Strategy",
    desc: "Scroll-stopping content built for the algorithm and the audience. Platform-native creative direction that converts views into clients.",
    href: "/services#content",
  },
]

function ServiceAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {services.map((svc, i) => (
        <div key={svc.num} style={{ borderTop: "1px solid #1f1f1f" }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left"
            style={{ padding: "28px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span
                className="font-mono text-[#333]"
                style={{ fontSize: 10, letterSpacing: "0.3em", flexShrink: 0 }}
              >
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
                  style={{
                    paddingBottom: 36,
                    paddingLeft: 62,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 40,
                  }}
                >
                  <p
                    className="font-sans text-[#555] font-light leading-relaxed"
                    style={{ fontSize: 14, maxWidth: 520 }}
                  >
                    {svc.desc}
                  </p>
                  <Link
                    href={svc.href}
                    className="group relative inline-flex items-center gap-2 overflow-hidden font-mono text-[#555] flex-shrink-0"
                    style={{
                      border: "1px solid #1f1f1f",
                      padding: "12px 24px",
                      fontSize: 9,
                      letterSpacing: "0.3em",
                    }}
                  >
                    <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative z-10 uppercase group-hover:text-white transition-colors duration-300">Explore</span>
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

  return (
    <>
      <LoadingIntro onComplete={() => setEntered(true)} />

      <main
        className={`transition-opacity duration-700 ${
          entered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* ── Hero Gallery ── */}
        <HeroGallery />

        {/* ── Stats — full width, 6 columns ── */}
        <section style={{ borderTop: "1px solid #1f1f1f" }}>
          <div className="grid grid-cols-3 md:grid-cols-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderRight: i < stats.length - 1 ? "1px solid #1f1f1f" : "none",
                  borderBottom: "1px solid #1f1f1f",
                }}
                className="flex flex-col items-center justify-center text-center py-12 px-4"
              >
                <p
                  className="font-display font-bold leading-none text-[#f0ede8]"
                  style={{ fontSize: "clamp(2rem,3.5vw,3.5rem)" }}
                >
                  {s.value}
                </p>
                <p
                  className="font-mono uppercase text-[#444] mt-2 whitespace-pre-line leading-relaxed"
                  style={{ fontSize: 9, letterSpacing: "0.18em" }}
                >
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Marquee ── */}
        <div style={{ borderBottom: "1px solid #1f1f1f", padding: "18px 0", overflow: "hidden" }}>
          <div
            className="flex whitespace-nowrap"
            style={{ animation: "marquee 18s linear infinite" }}
          >
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

        {/* ── Services Accordion ── */}
        <section style={{ padding: "80px 0 80px", borderBottom: "1px solid #1f1f1f" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
            {/* Header */}
            <div
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
                <p
                  className="font-mono text-[#444] uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16 }}
                >
                  What We Do
                </p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display font-bold uppercase leading-none text-[#f0ede8]"
                  style={{ fontSize: "clamp(2.5rem,4.5vw,4.5rem)" }}
                >
                  Our Services
                </motion.h2>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/services"
                  className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#555] uppercase"
                  style={{ border: "1px solid #1f1f1f", padding: "14px 28px", fontSize: 10, letterSpacing: "0.25em" }}
                >
                  <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">All Services</span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">→</span>
                </Link>
              </motion.div>
            </div>

            <ServiceAccordion />
          </div>
        </section>

        {/* ── Statement ── */}
        <section style={{ padding: "120px 40px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[#444] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 40 }}
            >
              Our Philosophy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold uppercase text-[#f0ede8]"
              style={{ fontSize: "clamp(3rem,6vw,6rem)", lineHeight: 0.9, marginBottom: 40 }}
            >
              We Don&apos;t Just<br />
              Document.{" "}
              <em className="not-italic text-[#E8181C]">We&nbsp;Create.</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-sans text-[#555] font-light leading-relaxed"
              style={{ fontSize: 15, maxWidth: 520, margin: "0 auto", textAlign: "center" }}
            >
              Cinema-trained. Design-educated. Montreal-based. KLIPVISUAL brings
              a filmmaker&apos;s eye to every frame — whether it&apos;s a brand
              campaign, a live event, or a portrait session.
            </motion.p>
          </div>
        </section>

        {/* ── CTA ── */}
        <div style={{ margin: "0 32px 32px", background: "#E8181C", padding: "80px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display font-bold uppercase leading-none text-[#0a0a0a]"
                style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}
              >
                Ready to Build<br />Something<br />Cinematic?
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0"
              >
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#0a0a0a] uppercase"
                  style={{ border: "2px solid #0a0a0a", padding: "20px 44px", fontSize: 11, letterSpacing: "0.25em" }}
                >
                  <span className="absolute inset-0 bg-[#0a0a0a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-[#f0ede8] transition-colors duration-300">Start a Project</span>
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
