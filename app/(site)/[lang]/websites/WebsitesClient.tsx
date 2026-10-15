"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Footer } from "@/app/components/Footer"
import { useLang } from "@/app/i18n/LanguageContext"
import { websites, KIND_LABEL, type WebsiteProject } from "@/app/data/websites"

const COPY = {
  en: {
    label: "KLIPVISUAL · Websites",
    heading: "Websites",
    intro:
      "Sites built like storefronts: striking on a big screen, flawless on a phone, and made so that someone who finds you on Google wants to call you.",
    visit: "Visit the site",
    more: "New projects are added here as they launch.",
    ctaLabel: "Your business next",
    ctaHeading: "Want to see yours?",
    ctaText: "I'll put together a free preview of your new website and walk you through it. No commitment.",
    ctaButton: "Ask for a preview",
  },
  fr: {
    label: "KLIPVISUAL · Sites web",
    heading: "Sites web",
    intro:
      "Des sites pensés comme des vitrines : saisissants sur grand écran, impeccables sur téléphone, et faits pour qu'une personne qui vous découvre sur Google ait envie de vous appeler.",
    visit: "Voir le site",
    more: "Les nouveaux projets s'ajoutent ici à chaque lancement.",
    ctaLabel: "Votre commerce ensuite",
    ctaHeading: "Envie de voir le vôtre?",
    ctaText: "Je vous prépare gratuitement un aperçu de votre futur site et je vous le présente. Aucun engagement.",
    ctaButton: "Demander un aperçu",
  },
}

const EASE = [0.22, 1, 0.36, 1] as const

/** Desktop screenshot in a browser frame, with the phone version overlapping it. */
function Mockup({ site }: { site: WebsiteProject }) {
  const host = site.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
  return (
    <div style={{ position: "relative", paddingBottom: "6%", paddingRight: "7%" }}>
      <div
        style={{
          border: "1px solid #1f1f1f",
          borderRadius: 10,
          overflow: "hidden",
          background: "#111",
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: "1px solid #1a1a1a" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2a2a2a" }} />
          ))}
          <span
            className="font-mono"
            style={{ marginLeft: 12, fontSize: 10, letterSpacing: "0.08em", color: "#555", background: "#0a0a0a", padding: "4px 12px", borderRadius: 999 }}
          >
            {host}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.desktop} alt={`${site.name}, desktop`} style={{ display: "block", width: "100%", height: "auto" }} loading="lazy" />
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "24%",
          borderRadius: 18,
          border: "5px solid #1a1a1a",
          overflow: "hidden",
          background: "#0a0a0a",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.95)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.mobile} alt={`${site.name}, mobile`} style={{ display: "block", width: "100%", height: "auto" }} loading="lazy" />
      </div>
    </div>
  )
}

export default function WebsitesPage() {
  const { lang, href } = useLang()
  const c = COPY[lang]

  return (
    <>
      <main style={{ minHeight: "100vh", background: "#0a0a0a" }}>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section style={{ paddingTop: 140, paddingBottom: 80, borderBottom: "1px solid #141414" }}>
          <div className="m-px" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[#3a3a3a] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.32em", marginBottom: 24 }}
            >
              {c.label}
            </motion.p>
            <div style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, ease: EASE }}
                className="font-display font-bold uppercase text-[#f0ede8] leading-none m-h-hero"
                style={{ fontSize: "clamp(4.5rem,11vw,10.5rem)", letterSpacing: "-0.025em" }}
              >
                {c.heading}
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-sans text-[#555] font-light leading-relaxed"
              style={{ fontSize: 15, maxWidth: 540, marginTop: 48 }}
            >
              {c.intro}
            </motion.p>
          </div>
        </section>

        {/* ── Projects ──────────────────────────────────────── */}
        {websites.map((site, i) => (
          <section key={site.slug} style={{ borderBottom: "1px solid #141414" }}>
            <div
              className="m-px grid grid-cols-1 items-center gap-14 lg:grid-cols-[5fr_7fr]"
              style={{ maxWidth: 1200, margin: "0 auto", padding: "112px 40px" }}
            >
              <motion.div
                className="min-w-0"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                  <span className="font-mono text-[#E8181C]" style={{ fontSize: 11, letterSpacing: "0.2em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.22em", color: "#777", border: "1px solid #1f1f1f", padding: "5px 10px" }}
                  >
                    {KIND_LABEL[site.kind][lang]} · {site.year}
                  </span>
                </div>
                <h2
                  className="font-display font-bold uppercase text-[#f0ede8] leading-none"
                  style={{ fontSize: "clamp(2.8rem,5.5vw,5rem)", letterSpacing: "-0.02em", marginBottom: 28 }}
                >
                  {site.name}
                </h2>
                <p className="font-sans text-[#8a8a8a] font-light leading-relaxed" style={{ fontSize: 16, maxWidth: 460, marginBottom: 28 }}>
                  {site.summary[lang]}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
                  {site.tags[lang].map((tag) => (
                    <span key={tag} className="font-mono uppercase text-[#555]" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                      {tag}
                    </span>
                  )).reduce<React.ReactNode[]>((acc, el, j) => (j ? [...acc, <span key={`d${j}`} className="text-[#2a2a2a]">·</span>, el] : [el]), [])}
                </div>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 overflow-hidden font-mono uppercase"
                  style={{ border: "1px solid rgba(240,237,232,0.25)", padding: "14px 22px", fontSize: 10, letterSpacing: "0.25em", color: "#f0ede8", textDecoration: "none" }}
                >
                  <span
                    className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-400"
                    style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
                  />
                  <span className="relative z-10">{c.visit}</span>
                  <span className="relative z-10">↗</span>
                </a>
              </motion.div>

              <motion.div
                className="min-w-0"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              >
                <Mockup site={site} />
              </motion.div>
            </div>
          </section>
        ))}

        <p className="font-mono uppercase text-center text-[#3a3a3a]" style={{ fontSize: 10, letterSpacing: "0.25em", padding: "48px 24px 0" }}>
          {c.more}
        </p>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section style={{ padding: "120px 0 140px" }}>
          <div className="m-px" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <p className="font-mono text-[#3a3a3a] uppercase" style={{ fontSize: 10, letterSpacing: "0.32em", marginBottom: 24 }}>
              {c.ctaLabel}
            </p>
            <h2
              className="font-display font-bold uppercase text-[#f0ede8] leading-none"
              style={{ fontSize: "clamp(3rem,8vw,7.5rem)", letterSpacing: "-0.025em", marginBottom: 32 }}
            >
              {c.ctaHeading}
            </h2>
            <p className="font-sans text-[#777] font-light leading-relaxed" style={{ fontSize: 16, maxWidth: 520, marginBottom: 44 }}>
              {c.ctaText}
            </p>
            <Link
              href={href("/contact")}
              className="group relative inline-flex items-center gap-3 overflow-hidden font-mono uppercase"
              style={{ background: "#E8181C", padding: "16px 26px", fontSize: 10, letterSpacing: "0.25em", color: "#f0ede8", textDecoration: "none" }}
            >
              <span className="relative z-10">{c.ctaButton}</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
