"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Footer } from "../components/Footer"
import { useLang } from "../i18n/LanguageContext"

// ─── Data ─────────────────────────────────────────────────────────────────────

const processSteps = [
  {
    num: "01",
    title: "Discovery Call",
    duration: "30 min · Free",
    desc: "We talk goals, timeline, and budget. No pressure, no pitch. Just the right questions to understand what you actually need.",
  },
  {
    num: "02",
    title: "Custom Proposal",
    duration: "24–48 hrs",
    desc: "You get a tailored scope document with a clear quote: transparent line items, no hidden fees. You approve before anything starts.",
  },
  {
    num: "03",
    title: "Production",
    duration: "Varies by scope",
    desc: "We show up with professional-grade gear, execute with intention, and keep you in the loop throughout. Every project is handled like it's our own.",
  },
  {
    num: "04",
    title: "Delivery",
    duration: "3–7 business days",
    desc: "Edited, color-graded, and polished. Delivered via private gallery or WeTransfer. Revisions included. You leave with files ready to publish.",
  },
]

const services = [
  {
    id: "video",
    num: "01",
    label: "Video Production",
    desc: "From brand films to content days. We handle the full production cycle. Concept to final cut, we don't cut corners.",
    offerings: [
      {
        name: "Brand Video",
        price: "From $2,000",
        timeline: "1–2 weeks post-shoot",
        best: "Startups, product launches, brand identity",
        deliverables: [
          "Pre-production planning call",
          "Scriptwriting assistance",
          "Full-day shoot (up to 8 hrs)",
          "1–3 min cinematic final cut",
          "Professional color grade",
          "Licensed music + sound design",
          "2 rounds of revisions",
          "4K master + web-optimized export",
        ],
      },
      {
        name: "Content Day / Half Day",
        price: "$1,200",
        timeline: "5–7 business days",
        best: "Social media, reels, campaigns",
        deliverables: [
          "4-hour shoot session",
          "Up to 5 edited short-form clips",
          "Raw footage included",
          "Color grade + basic sound mix",
          "1 round of revisions",
          "Delivery in 9:16, 1:1, and 16:9",
        ],
      },
      {
        name: "Content Day / Full Day",
        price: "$2,000",
        timeline: "5–7 business days",
        best: "Content batching, campaigns, multi-platform",
        deliverables: [
          "8-hour shoot session",
          "Up to 12 edited short-form clips",
          "Raw footage included",
          "Color grade + sound mix",
          "2 rounds of revisions",
          "Delivery in 9:16, 1:1, and 16:9",
        ],
      },
      {
        name: "Corporate Video",
        price: "From $1,800",
        timeline: "1–2 weeks post-shoot",
        best: "Internal comms, recruitment, events",
        deliverables: [
          "Pre-production call + run-of-show",
          "Interview or b-roll format",
          "Scripting support",
          "Professional edit + subtitles",
          "2 rounds of revisions",
          "4K master + web export",
        ],
      },
      {
        name: "Music Video",
        price: "From $3,000",
        timeline: "2–3 weeks post-shoot",
        best: "Artists, labels, independent musicians",
        deliverables: [
          "Creative concept development",
          "Location scouting",
          "Full-day shoot",
          "Cinematic color grade",
          "Sync to final audio master",
          "2 rounds of revisions",
          "4K final delivery",
        ],
      },
      {
        name: "Editing Only",
        price: "$150 – $1,500",
        timeline: "3–5 business days",
        best: "You have the footage, we craft the story",
        deliverables: [
          "Professional edit of your footage",
          "Color grade",
          "Sound mix + licensed music",
          "1 round of revisions",
          "Final export to spec",
        ],
      },
    ],
  },
  {
    id: "photography",
    num: "02",
    label: "Photography",
    desc: "Still images that carry weight. Product, events, portraits, real estate. Every frame gets the same cinematic eye.",
    offerings: [
      {
        name: "Food & Product / Half Day",
        price: "$700",
        timeline: "3–5 business days",
        best: "Restaurants, e-commerce, brands",
        deliverables: [
          "4-hour shoot session",
          "Up to 40 edited images",
          "Web-ready + print-ready exports",
          "Background removal on request",
          "Private online gallery",
        ],
      },
      {
        name: "Food & Product / Full Day",
        price: "$1,400",
        timeline: "3–5 business days",
        best: "Full menus, product lines, lookbooks",
        deliverables: [
          "8-hour shoot session",
          "Up to 80 edited images",
          "Web-ready + print-ready exports",
          "Background removal on request",
          "Private online gallery",
        ],
      },
      {
        name: "Event / Half Day",
        price: "$800",
        timeline: "5–7 business days",
        best: "Conferences, launches, exhibitions",
        deliverables: [
          "4 hours of coverage",
          "Up to 60 edited images",
          "Private online gallery",
          "Commercial usage rights",
        ],
      },
      {
        name: "Event / Full Day",
        price: "$1,500",
        timeline: "5–7 business days",
        best: "Full-day events, galas, brand activations",
        deliverables: [
          "8 hours of coverage",
          "Up to 150 edited images",
          "Private online gallery",
          "Same-day preview (10 images)",
          "Commercial usage rights",
        ],
      },
      {
        name: "Portrait / 1 Hour",
        price: "$400",
        timeline: "3–5 business days",
        best: "Headshots, personal branding, artists",
        deliverables: [
          "1-hour studio or location session",
          "Up to 20 edited selects",
          "Private online gallery",
          "High-res + web-ready exports",
        ],
      },
      {
        name: "Portrait / 2 Hours",
        price: "$700",
        timeline: "3–5 business days",
        best: "Brands, artists, actors, influencers",
        deliverables: [
          "2-hour studio or location session",
          "Up to 45 edited selects",
          "Multiple look changes",
          "Private online gallery",
          "High-res + web-ready exports",
        ],
      },
      {
        name: "Real Estate",
        price: "$500 – $900",
        timeline: "2–3 business days",
        best: "Agents, developers, rental listings",
        deliverables: [
          "Exterior + interior coverage",
          "HDR editing",
          "Virtual staging available on request",
          "MLS-ready exports",
          "Private online gallery",
        ],
      },
    ],
  },
  {
    id: "design",
    num: "03",
    label: "Design & Branding",
    desc: "Brand identity built to last. From logo to full visual system, we create languages that communicate before a word is read.",
    offerings: [
      {
        name: "Logo Design",
        price: "From $500",
        timeline: "1–2 weeks",
        best: "New businesses, rebrands",
        deliverables: [
          "2 initial concepts",
          "3 rounds of revisions",
          "All formats: SVG, PNG, PDF",
          "Light + dark variants",
          "Brand color codes",
        ],
      },
      {
        name: "Brand Identity",
        price: "From $2,000",
        timeline: "3–4 weeks",
        best: "Businesses ready to define their visual voice",
        deliverables: [
          "Logo design (full process)",
          "Color palette",
          "Typography system",
          "Business card design",
          "Brand guidelines PDF (20+ pages)",
          "Full asset export package",
        ],
      },
      {
        name: "Pitch Deck",
        price: "From $800",
        timeline: "1–2 weeks",
        best: "Founders, fundraising, investor meetings",
        deliverables: [
          "Up to 20 custom-designed slides",
          "Brand-aligned design",
          "Editable Figma or PowerPoint file",
          "2 rounds of revisions",
          "PDF export",
        ],
      },
      {
        name: "Social Media Templates",
        price: "From $400",
        timeline: "1 week",
        best: "Brands, influencers, content teams",
        deliverables: [
          "10 custom templates",
          "Feed post + Stories formats",
          "Editable in Canva or Figma",
          "Brand-matched colors + fonts",
          "Usage guide included",
        ],
      },
    ],
  },
  {
    id: "bundles",
    num: "05",
    label: "Bundles",
    desc: "The best value is a full ecosystem. Bundles combine video, photo, and design into one seamless production. One team, one vision.",
    offerings: [
      {
        name: "Launch Package",
        price: "$4,500",
        timeline: "3–4 weeks",
        best: "New brands launching at full volume",
        deliverables: [
          "Brand identity (logo + guidelines)",
          "Brand video (1–3 min)",
          "Full-day photo session (80 images)",
          "10 social media templates",
          "All files in a single handoff folder",
        ],
      },
      {
        name: "Content Batch",
        price: "$3,000",
        timeline: "2–3 weeks",
        best: "Brands needing 4–8 weeks of content",
        deliverables: [
          "Full content day (12 video clips)",
          "Professional editing",
          "30 social-ready posts",
          "Caption copy on request",
          "Delivery in all platform formats",
        ],
      },
      {
        name: "Event Package",
        price: "$3,000",
        timeline: "5–7 days post-event",
        best: "Galas, brand events, conferences",
        deliverables: [
          "Full-day photo coverage (150 images)",
          "Highlight reel video (2–4 min)",
          "Same-day photo preview (10 images)",
          "Branded teaser clip for social",
          "Private online gallery",
        ],
      },
    ],
  },
]

// Web Design & Development — bilingual section spliced between Design (03) and Bundles (05).
const webService = {
  en: {
    id: "web",
    num: "04",
    label: "Web Design & Development",
    desc: "Cinematic websites, custom-built. Fast, bilingual, and designed to convert. No templates, no compromises.",
    offerings: [
      {
        name: "One-Page / Landing",
        price: "From $1,500",
        timeline: "1–2 weeks",
        best: "Launches, campaigns, link-in-bio, events",
        deliverables: [
          "Single-page custom design",
          "Mobile-responsive build",
          "Contact form or booking link",
          "Basic SEO setup",
          "1 round of revisions",
          "Bilingual EN/FR option",
        ],
      },
      {
        name: "Brand Website",
        price: "From $3,500",
        timeline: "3–5 weeks",
        best: "Brands, creators, small businesses",
        deliverables: [
          "Up to 6 custom-designed pages",
          "Mobile-responsive, fast-loading build",
          "Custom animations and transitions",
          "Bilingual EN/FR",
          "CMS or easy content updates",
          "Basic SEO + analytics setup",
          "2 rounds of revisions",
        ],
      },
      {
        name: "Premium Custom Build",
        price: "From $7,500",
        timeline: "5–8 weeks",
        best: "Premium brands, studios, portfolios",
        deliverables: [
          "Fully custom cinematic design and motion",
          "Video integration and interactive elements",
          "Bilingual EN/FR",
          "Advanced animations",
          "SEO, analytics, performance optimization",
          "CMS setup + training",
          "3 rounds of revisions",
        ],
      },
      {
        name: "Care & Maintenance (optional)",
        price: "$120–$300/mo",
        timeline: "Ongoing",
        best: "Anyone who wants their site handled",
        deliverables: [
          "Hosting oversight",
          "Content updates",
          "Security + performance monitoring",
          "Small changes and fixes",
        ],
      },
    ],
  },
  fr: {
    id: "web",
    num: "04",
    label: "Web Design & Development",
    desc: "Des sites web cinématographiques, sur mesure. Rapides, bilingues et conçus pour convertir. Pas de gabarits, pas de compromis.",
    offerings: [
      {
        name: "Page unique / Landing",
        price: "À partir de 1 500 $",
        timeline: "1 à 2 semaines",
        best: "Lancements, campagnes, lien bio, événements",
        deliverables: [
          "Design sur mesure d'une page",
          "Site adaptatif (mobile)",
          "Formulaire de contact ou lien de réservation",
          "Configuration SEO de base",
          "1 ronde de révisions",
          "Option bilingue FR/EN",
        ],
      },
      {
        name: "Site de marque",
        price: "À partir de 3 500 $",
        timeline: "3 à 5 semaines",
        best: "Marques, créateurs, petites entreprises",
        deliverables: [
          "Jusqu'à 6 pages sur mesure",
          "Site adaptatif et rapide",
          "Animations et transitions personnalisées",
          "Bilingue FR/EN",
          "CMS ou mises à jour faciles du contenu",
          "SEO de base + configuration analytique",
          "2 rondes de révisions",
        ],
      },
      {
        name: "Site sur mesure premium",
        price: "À partir de 7 500 $",
        timeline: "5 à 8 semaines",
        best: "Marques premium, studios, portfolios",
        deliverables: [
          "Design et animations cinématographiques entièrement sur mesure",
          "Intégration vidéo et éléments interactifs",
          "Bilingue FR/EN",
          "Animations avancées",
          "SEO, analytique, optimisation de la performance",
          "Configuration CMS + formation",
          "3 rondes de révisions",
        ],
      },
      {
        name: "Entretien et maintenance (optionnel)",
        price: "120 $ à 300 $/mois",
        timeline: "En continu",
        best: "Ceux qui veulent que leur site soit pris en charge",
        deliverables: [
          "Supervision de l'hébergement",
          "Mises à jour du contenu",
          "Surveillance sécurité + performance",
          "Petits changements et correctifs",
        ],
      },
    ],
  },
}

const included = [
  "Pre-production planning call",
  "Professional cinema-grade equipment",
  "DaVinci Resolve color grading",
  "Licensed music (when applicable)",
  "Online delivery via private gallery",
  "Commercial usage rights",
  "1–2 revision rounds per package",
  "Communication throughout production",
]

const notIncluded = [
  "Location or venue rental fees",
  "Talent, model, or actor fees",
  "Hair, makeup, or styling",
  "Travel beyond 40 km from Montréal",
  "Rush delivery (available at +25%)",
  "Additional revision rounds beyond package",
  "Printing or physical production costs",
]

const faqs = [
  {
    q: "Do you travel for shoots?",
    a: "We're based in Montréal and cover the greater area without travel fees. Shoots outside a 40 km radius are quoted separately, typically $0.55/km or a flat day rate for distant cities. We've shot across Québec and are open to projects anywhere.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend reaching out 2–4 weeks before your ideal shoot date. High-demand periods (summer, Q4) fill up fast. Availability is first-come, first-served. A signed contract and 50% deposit secures your date.",
  },
  {
    q: "What's your cancellation or reschedule policy?",
    a: "Rescheduling is free with 72+ hours notice. Cancellations within 72 hours forfeit the deposit. We understand things happen. Communicate early and we'll always work something out.",
  },
  {
    q: "How do I receive my final files?",
    a: "Everything is delivered via a private online gallery or WeTransfer link within 3–7 business days of the shoot (depending on scope). High-res originals, web-optimized versions, and any raw files included in your package are all in one organized folder.",
  },
  {
    q: "Do you work with small businesses or solo brands?",
    a: "Absolutely. A significant portion of our clients are solo entrepreneurs, local restaurants, and emerging brands. We offer the same level of craft regardless of budget tier, and we'll always tell you if a simpler package fits your actual needs better.",
  },
  {
    q: "Can I see examples of past work?",
    a: "Yes, our full portfolio is at klipvisual.com/work. We have case studies across video, photo, and branding. If you want to see work specific to your industry or project type, just ask during the discovery call.",
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqRow({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      style={{ borderTop: "1px solid #1a1a1a" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left"
        style={{
          padding: "24px 0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          cursor: "pointer",
          background: "transparent",
          border: "none",
        }}
      >
        <span
          className="font-sans text-[#f0ede8]"
          style={{ fontSize: "clamp(0.95rem,1.8vw,1.1rem)", lineHeight: 1.4, fontWeight: 400 }}
        >
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="font-mono text-[#555] flex-shrink-0"
          style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="font-sans text-[#777] font-light leading-relaxed"
              style={{ fontSize: 14, paddingBottom: 28, maxWidth: 640 }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function OfferingCard({
  offering,
  index,
}: {
  offering: (typeof services)[0]["offerings"][0]
  index: number
}) {
  const { t } = useLang()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "28px 28px 24px", borderBottom: "1px solid #141414" }}>
        <p className="font-mono text-[#3a3a3a] uppercase" style={{ fontSize: 10, letterSpacing: "0.25em", marginBottom: 12 }}>
          {offering.timeline}
        </p>

        <h3
          className="font-display font-bold uppercase text-[#f0ede8]"
          style={{ fontSize: "clamp(1.3rem,2vw,1.7rem)", lineHeight: 1.1, marginBottom: 14 }}
        >
          {offering.name}
        </h3>
        <p className="font-mono text-[#E8181C]" style={{ fontSize: "clamp(1rem,1.4vw,1.15rem)", letterSpacing: "0.04em" }}>
          {offering.price}
        </p>
      </div>

      {/* Deliverables */}
      <div style={{ padding: "24px 28px", flex: 1 }}>
        <p className="font-mono text-[#3a3a3a] uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 16 }}>
          {t.services.offerings.whatYouGet}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
          {offering.deliverables.map((d) => (
            <li key={d} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ color: "#E8181C", flexShrink: 0, marginTop: 2, fontSize: 11, lineHeight: 1 }}>·</span>
              <span className="font-sans text-[#777] font-light" style={{ fontSize: 13, lineHeight: 1.55 }}>
                {d}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 28px", borderTop: "1px solid #111", background: "#080808", minHeight: 34, display: "flex", alignItems: "center" }}>
        <p className="font-mono text-[#444]" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
          {t.services.offerings.bestFor}{" "}
          <span style={{ color: "#555" }}>{offering.best}</span>
        </p>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const { t, lang } = useLang()
  const ts = t.services
  // Insert Web (04) between Design (03) and Bundles (05); nav + sections derive from this.
  const sections = [...services.slice(0, 3), webService[lang], ...services.slice(3)]
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
              {ts.hero.label}
            </motion.p>

            <div style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-bold uppercase text-[#f0ede8] leading-none m-h-hero"
                style={{ fontSize: "clamp(4.5rem,11vw,10.5rem)", letterSpacing: "-0.025em" }}
              >
                {ts.hero.heading}
              </motion.h1>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 40,
                marginTop: 48,
                flexWrap: "wrap",
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-sans text-[#555] font-light leading-relaxed"
                style={{ fontSize: 15, maxWidth: 500 }}
              >
                {ts.hero.intro}
              </motion.p>

              {/* Quick nav anchors */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
              >
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="font-mono text-[#555] uppercase hover:text-[#f0ede8] transition-colors duration-200"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      padding: "10px 18px",
                      border: "1px solid #1f1f1f",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    {s.num} · {s.label}
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── How We Work ───────────────────────────────────── */}
        <section style={{ padding: "100px 0", borderBottom: "1px solid #141414" }}>
          <div className="m-px" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[#3a3a3a] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.32em", marginBottom: 56 }}
            >
              {ts.process.label}
            </motion.p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "#141414" }}>
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  style={{ background: "#0a0a0a", padding: "44px 36px" }}
                >
                  <p className="font-mono text-[#E8181C]" style={{ fontSize: 11, letterSpacing: "0.22em", marginBottom: 24 }}>
                    {step.num}
                  </p>
                  <h3
                    className="font-display font-bold uppercase text-[#f0ede8]"
                    style={{ fontSize: "clamp(1.5rem,2.2vw,2rem)", lineHeight: 1.05, marginBottom: 14 }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.15em", marginBottom: 20, color: "#E8181C", opacity: 0.6 }}>
                    {step.duration}
                  </p>
                  <p className="font-sans text-[#666] font-light leading-relaxed" style={{ fontSize: 13 }}>
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Service Sections ──────────────────────────────── */}
        {sections.map((service) => (
          <section
            key={service.id}
            id={service.id}
            style={{ padding: "100px 0", borderBottom: "1px solid #141414" }}
          >
            <div className="m-px" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 40,
                  marginBottom: 64,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-mono text-[#333] uppercase"
                    style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 14 }}
                  >
                    {service.num}
                  </motion.p>
                  <div style={{ overflow: "hidden" }}>
                    <motion.h2
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display font-bold uppercase text-[#f0ede8] leading-none m-h-xl"
                      style={{ fontSize: "clamp(3rem,7vw,7rem)", letterSpacing: "-0.025em" }}
                    >
                      {service.label}
                    </motion.h2>
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="font-sans text-[#555] font-light leading-relaxed"
                  style={{ fontSize: 14, maxWidth: 380 }}
                >
                  {service.desc}
                </motion.p>
              </div>

              {/* Offerings grid */}
              <div
                className="m-stack"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 1,
                  background: "#141414",
                }}
              >
                {service.offerings.map((offering, i) => (
                  <OfferingCard key={offering.name} offering={offering} index={i} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── What's Included ───────────────────────────────── */}
        <section style={{ padding: "100px 0", borderBottom: "1px solid #141414" }}>
          <div className="m-px" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[#3a3a3a] uppercase"
              style={{ fontSize: 10, letterSpacing: "0.32em", marginBottom: 48 }}
            >
              {ts.included.label}
            </motion.p>

            <div style={{ overflow: "hidden", marginBottom: 64 }}>
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-bold uppercase text-[#f0ede8] leading-none m-h-xl"
                style={{ fontSize: "clamp(2.5rem,5.5vw,5.5rem)", letterSpacing: "-0.025em" }}
              >
                {ts.included.heading1}<br />{ts.included.heading2}
              </motion.h2>
            </div>

            <div
              className="m-stack"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                background: "#141414",
              }}
            >
              {/* Included */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="m-pad"
                style={{ background: "#0a0a0a", padding: "52px 44px" }}
              >
                <p className="font-mono text-[#3a3a3a] uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 32 }}>
                  {ts.included.always}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                  {included.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <span style={{ color: "#E8181C", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span className="font-sans text-[#888] font-light" style={{ fontSize: 14, lineHeight: 1.5 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Not included */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="m-pad"
                style={{ background: "#0a0a0a", padding: "52px 44px" }}
              >
                <p className="font-mono text-[#3a3a3a] uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 32 }}>
                  {ts.included.separately}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                  {notIncluded.map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <span style={{ color: "#333", fontSize: 13, flexShrink: 0, marginTop: 1 }}>×</span>
                      <span className="font-sans text-[#555] font-light" style={{ fontSize: 14, lineHeight: 1.5 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section style={{ padding: "100px 0", borderBottom: "1px solid #141414" }}>
          <div className="m-px" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
            <div className="m-stack m-gap" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>

              {/* Left label column */}
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="font-mono text-[#3a3a3a] uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.32em", marginBottom: 20 }}
                >
                  {ts.faq.label}
                </motion.p>
                <div style={{ overflow: "hidden" }}>
                  <motion.h2
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display font-bold uppercase text-[#f0ede8] leading-none m-h-lg"
                    style={{ fontSize: "clamp(2.5rem,4vw,4.5rem)", letterSpacing: "-0.025em" }}
                  >
                    {ts.faq.heading1}<br />{ts.faq.heading2}
                  </motion.h2>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="font-sans text-[#555] font-light leading-relaxed"
                  style={{ fontSize: 13, marginTop: 24 }}
                >
                  {ts.faq.body}
                </motion.p>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#f0ede8]/60 uppercase"
                  style={{
                    border: "1px solid #1f1f1f",
                    padding: "12px 22px",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    marginTop: 28,
                    textDecoration: "none",
                    display: "inline-flex",
                  }}
                >
                  <span className="absolute inset-0 bg-[#E8181C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">{ts.faq.askUs}</span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">→</span>
                </Link>
              </div>

              {/* Right FAQ column */}
              <div>
                {faqs.map((faq, i) => (
                  <FaqRow key={faq.q} faq={faq} index={i} />
                ))}
                <div style={{ borderTop: "1px solid #1a1a1a" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="m-cta" style={{ margin: "0 32px 32px", background: "#E8181C", padding: "100px 60px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[#0a0a0a]/50 uppercase"
              style={{ fontSize: 10, letterSpacing: "0.32em", marginBottom: 36 }}
            >
              {ts.cta.label}
            </motion.p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 40,
                flexWrap: "wrap",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <motion.h2
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display font-bold uppercase text-[#0a0a0a] leading-none m-h-xl"
                  style={{ fontSize: "clamp(2.5rem,6vw,6.5rem)", letterSpacing: "-0.025em", maxWidth: 680 }}
                >
                  {ts.cta.heading}
                </motion.h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-3 overflow-hidden font-mono text-[#0a0a0a] uppercase"
                  style={{
                    border: "2px solid #0a0a0a",
                    padding: "18px 44px",
                    fontSize: 11,
                    letterSpacing: "0.26em",
                    textDecoration: "none",
                    display: "inline-flex",
                  }}
                >
                  <span className="absolute inset-0 bg-[#0a0a0a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 group-hover:text-[#f0ede8] transition-colors duration-300">
                    {ts.cta.quote}
                  </span>
                  <span className="relative z-10 group-hover:text-[#f0ede8] transition-colors duration-300">→</span>
                </Link>
                <Link
                  href="/work"
                  className="font-mono text-[#0a0a0a]/60 uppercase hover:text-[#0a0a0a] transition-colors duration-200"
                  style={{ fontSize: 10, letterSpacing: "0.2em", textAlign: "center", textDecoration: "none" }}
                >
                  {ts.cta.seeWork}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
