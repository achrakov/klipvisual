"use client"

// Photo + video landing page. Everything on it is real work from projects.ts.
// Copy rules (brand/BRAND.md): first person, no em dashes, EN + FR.

import { useMemo, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Footer } from "@/app/components/Footer"
import { useLang } from "@/app/i18n/LanguageContext"
import { projects, type Project } from "@/app/data/projects"

const RED = "#E8181C"
const BONE = "#f0ede8"
const ease = [0.22, 1, 0.36, 1] as const

// Production work only, strongest first.
const SHOWCASE = [
  "lebalcon-events", "boudchart-lolympia", "la-famille-quebec-alimentation", "terry-osias",
  "culinary-photography", "portrait-photography", "simo-x-nesrine", "jidar-toiles-de-rue", "coma",
]
// How many frames each project gives to the photo wall.
const WALL_TAKE: Record<string, number> = {
  "lebalcon-events": 6, "boudchart-lolympia": 6, "portrait-photography": 6, "culinary-photography": 4,
  "simo-x-nesrine": 4, "terry-osias": 4, "jidar-toiles-de-rue": 2, "coma": 2,
}

const imagesOf = (p: Project) => [
  ...(p.gallery ?? []), ...(p.themes ?? []).flatMap((t) => t.images), ...(p.albums ?? []).flatMap((a) => a.images),
]

type Copy = Record<"en" | "fr", string>
const T = (c: Copy, lang: string) => (lang === "fr" ? c.fr : c.en)

const SERVICES: { slug: string; title: Copy; body: Copy; from: Copy }[] = [
  {
    slug: "la-famille-quebec-alimentation",
    title: { en: "Brand and corporate video", fr: "Vidéo de marque et corporative" },
    body: { en: "Campaigns, company films, testimonials and launches. Concept, shoot, edit and color, one vision from start to finish.", fr: "Campagnes, films d'entreprise, témoignages et lancements. Concept, tournage, montage et étalonnage, une seule vision du début à la fin." },
    from: { en: "From $1,800", fr: "Dès 1 800 $" },
  },
  {
    slug: "lebalcon-events",
    title: { en: "Events and shows", fr: "Événements et spectacles" },
    body: { en: "Conferences, launches, galas, concerts. Photos and recap videos, with express delivery for your socials the next day.", fr: "Conférences, lancements, galas, concerts. Photos et vidéos récap, avec livraison express pour vos réseaux dès le lendemain." },
    from: { en: "From $1,200", fr: "Dès 1 200 $" },
  },
  {
    slug: "terry-osias",
    title: { en: "Content and reels", fr: "Contenu et reels" },
    body: { en: "A content day that gives you weeks of reels, stories and photos, shot vertically and made to perform.", fr: "Une journée de contenu qui vous donne des semaines de reels, de stories et de photos, tournés à la verticale et faits pour performer." },
    from: { en: "Half day $1,200", fr: "Demi-journée 1 200 $" },
  },
  {
    slug: "culinary-photography",
    title: { en: "Photography", fr: "Photographie" },
    body: { en: "Corporate portraits, food and product, interiors and real estate. Retouched, ready for your site, Google and print.", fr: "Portraits corporatifs, culinaire et produits, intérieurs et immobilier. Retouchées, prêtes pour votre site, Google et l'imprimé." },
    from: { en: "From $700", fr: "Dès 700 $" },
  },
]

const STATS: { n: string; l: Copy }[] = [
  { n: "750K+", l: { en: "reach for La Famille Québec Alimentation", fr: "de portée pour La Famille Québec Alimentation" } },
  { n: "15+", l: { en: "events as Le Balcon's official visual partner", fr: "événements comme partenaire visuel officiel du Balcon" } },
  { n: "300K+", l: { en: "reach for champion Terry Osias", fr: "de portée pour le champion Terry Osias" } },
  { n: "8+", l: { en: "years of video, photo and film", fr: "ans de vidéo, de photo et de cinéma" } },
]

const STEPS: { t: Copy; b: Copy }[] = [
  { t: { en: "You tell me the project", fr: "Vous me décrivez le projet" }, b: { en: "Two minutes with the form, or a call.", fr: "Deux minutes avec le formulaire, ou un appel." } },
  { t: { en: "Quote within 24 h", fr: "Soumission en 24 h" }, b: { en: "A clear fixed price, with what is included.", fr: "Un prix fixe et clair, avec tout ce qui est inclus." } },
  { t: { en: "The shoot", fr: "Le tournage" }, b: { en: "I direct, film and photograph on site.", fr: "Je dirige, filme et photographie sur place." } },
  { t: { en: "Delivery", fr: "La livraison" }, b: { en: "Edited, color graded, in every format you need.", fr: "Monté, étalonné, dans tous les formats dont vous avez besoin." } },
]

const FAQ: { q: Copy; a: Copy }[] = [
  { q: { en: "How fast do I get the files?", fr: "En combien de temps je reçois les fichiers?" }, a: { en: "Photos within 5 business days, videos within 7 to 10. Express delivery the next day is available for events.", fr: "Les photos en 5 jours ouvrables, les vidéos en 7 à 10. La livraison express le lendemain est offerte pour les événements." } },
  { q: { en: "Do you travel outside Montréal?", fr: "Vous vous déplacez hors de Montréal?" }, a: { en: "Yes, across Québec and Ontario. Travel is quoted upfront.", fr: "Oui, partout au Québec et en Ontario. Le déplacement est indiqué dans la soumission." } },
  { q: { en: "French or English?", fr: "En français ou en anglais?" }, a: { en: "Both. I direct, interview and subtitle in French and English.", fr: "Les deux. Je dirige, j'interviewe et je sous-titre en français et en anglais." } },
  { q: { en: "Can I get the raw files?", fr: "Est-ce que je peux avoir les fichiers bruts?" }, a: { en: "Yes, as an option. Ask for it in your quote.", fr: "Oui, en option. Demandez-le dans votre soumission." } },
]

const TYPES: Copy[] = [
  { en: "Corporate or brand video", fr: "Vidéo corporative ou de marque" },
  { en: "Event or show", fr: "Événement ou spectacle" },
  { en: "Content day / reels", fr: "Journée de contenu / reels" },
  { en: "Photography", fr: "Photographie" },
  { en: "Something else", fr: "Autre chose" },
]
const BUDGETS = ["$1,200 – $3,000", "$3,000 – $6,000", "$6,000 – $10,000", "$10,000+"]

type FormValues = { name: string; email: string; phone: string; company: string; type: string; date: string; budget: string; message: string; company_website?: string }

const label = "font-mono uppercase text-[#666] block"
const input: React.CSSProperties = { width: "100%", background: "transparent", border: "1px solid #262626", color: BONE, padding: "15px 18px", fontSize: 16, outline: "none" }

function Section({ id, kicker, title, children }: { id?: string; kicker: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} style={{ borderTop: "1px solid #1a1a1a", padding: "clamp(64px,10vw,128px) 0" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)" }}>
        <p className="font-mono uppercase" style={{ color: RED, fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 }}>{kicker}</p>
        <h2 className="font-display font-bold uppercase leading-[0.9] text-[#f0ede8]" style={{ fontSize: "clamp(2.6rem,7vw,6.5rem)", marginBottom: "clamp(32px,5vw,64px)" }}>{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default function ProductionClient() {
  const { lang } = useLang()
  const fr = lang === "fr"
  const href = (p: string) => `/${lang}${p}`
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const bySlug = useMemo(() => new Map(projects.map((p) => [p.slug, p])), [])
  const showcase = SHOWCASE.map((s) => bySlug.get(s)).filter(Boolean) as Project[]
  // Interleave projects so the wall mixes concerts, food, portraits and events.
  const wall = useMemo(() => {
    const lists = Object.entries(WALL_TAKE).map(([s, n]) => imagesOf(bySlug.get(s)!).slice(0, n))
    const out: string[] = []
    for (let i = 0; out.length < lists.reduce((t, l) => t + l.length, 0); i++) for (const l of lists) if (l[i]) out.push(l[i])
    return out
  }, [bySlug])

  const onSubmit = async (d: FormValues) => {
    if (d.company_website) { setSent(true); return }
    setSending(true)
    const message = [
      d.company && `${fr ? "Entreprise" : "Company"} : ${d.company}`,
      d.date && `${fr ? "Date" : "Date"} : ${d.date}`,
      d.message,
    ].filter(Boolean).join("\n")
    const payload = { name: d.name, email: d.email, phone: d.phone, service: `Production · ${d.type}`, budget: d.budget, message, lang }
    fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {})
    try {
      const res = await fetch("https://formspree.io/f/xpwroqgw", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, _subject: `Soumission production · ${d.type}` }),
      })
      if (res.ok) setSent(true)
    } catch { /* the lead API above is the safety net */ } finally { setSending(false) }
  }

  const cta = (
    <a href="#quote" className="font-mono uppercase inline-flex items-center justify-center" style={{ background: RED, color: "#fff", padding: "18px 30px", fontSize: 12, letterSpacing: "0.2em", minHeight: 52 }}>
      {fr ? "Demander une soumission" : "Get a quote"}
    </a>
  )

  return (
    <>
      <main style={{ background: "#0a0a0a" }}>
        {/* ── Hero: the reel plays first ───────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <video
            autoPlay muted loop playsInline preload="metadata"
            poster="/videos/production-hero-poster.jpg"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src="/videos/production-hero.mp4" type="video/mp4" />
          </video>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.62) 45%, rgba(10,10,10,0.25) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0) 55%, #0a0a0a 100%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 clamp(20px,4vw,48px) clamp(48px,8vw,96px)" }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono uppercase" style={{ color: RED, fontSize: 11, letterSpacing: "0.3em", marginBottom: 18 }}>
              {fr ? "Production photo et vidéo · Montréal" : "Photo and video production · Montréal"}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease }}
              className="font-display font-bold uppercase leading-[0.88] text-[#f0ede8]" style={{ fontSize: "clamp(3.2rem,10vw,10rem)", maxWidth: 1200 }}
            >
              {fr ? <>Des images qui<br /><span style={{ color: RED }}>font vendre.</span></> : <>Images that<br /><span style={{ color: RED }}>sell.</span></>}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="font-sans font-light" style={{ color: "#bdb9b2", fontSize: "clamp(1rem,1.4vw,1.25rem)", maxWidth: 620, margin: "24px 0 32px", lineHeight: 1.55 }}>
              {fr
                ? "Je réalise des vidéos et des photos pour les entreprises, les marques et les événements à Montréal. Du concept à l'étalonnage final, livrées vite."
                : "I produce video and photography for companies, brands and events in Montréal. From concept to final grade, delivered fast."}
            </motion.p>
            <div className="flex flex-wrap gap-3">
              {cta}
              <a href="#work" className="font-mono uppercase inline-flex items-center justify-center" style={{ border: "1px solid #444", color: BONE, padding: "18px 30px", fontSize: 12, letterSpacing: "0.2em", minHeight: 52 }}>
                {fr ? "Voir le travail" : "See the work"}
              </a>
            </div>
          </div>
        </section>

        {/* ── Proof in numbers ─────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #1a1a1a" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ maxWidth: 1400, margin: "0 auto" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: "clamp(28px,4vw,48px) clamp(20px,4vw,48px)", borderRight: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
                <div className="font-display font-bold" style={{ color: BONE, fontSize: "clamp(2.4rem,5vw,4.5rem)", lineHeight: 1 }}>{s.n}</div>
                <div className="font-sans font-light" style={{ color: "#8a867f", fontSize: 14, marginTop: 10, lineHeight: 1.4 }}>{T(s.l, lang)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── The reel ─────────────────────────────────────────────────── */}
        <Section kicker={fr ? "Le reel" : "The reel"} title={fr ? "Le travail en 28 secondes" : "The work in 28 seconds"}>
          <video controls playsInline preload="none" poster="/videos/klipvisual-reel-poster.jpg"
            style={{ width: "100%", aspectRatio: "16/9", background: "#000", display: "block" }}>
            <source src="/videos/klipvisual-reel.mp4" type="video/mp4" />
          </video>
        </Section>

        {/* ── What I shoot ─────────────────────────────────────────────── */}
        <Section kicker={fr ? "Ce que je fais" : "What I do"} title={fr ? "Quatre façons de travailler ensemble" : "Four ways to work together"}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
            {SERVICES.map((s) => {
              const p = bySlug.get(s.slug)
              return (
                <a key={s.slug} href="#quote" className="group" style={{ position: "relative", display: "block", aspectRatio: "16/10", overflow: "hidden", background: "#111" }}>
                  {p && <img src={p.workCover || p.cover} alt="" loading="lazy" className="transition-transform duration-700 group-hover:scale-105" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />}
                  <div style={{ position: "absolute", inset: 0, padding: "clamp(20px,3vw,36px)", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "linear-gradient(180deg, transparent 30%, rgba(10,10,10,0.92) 100%)" }}>
                    <span className="font-mono uppercase" style={{ color: RED, fontSize: 11, letterSpacing: "0.2em" }}>{T(s.from, lang)}</span>
                    <h3 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: "clamp(1.8rem,3.4vw,3rem)", lineHeight: 0.95, margin: "8px 0 10px" }}>{T(s.title, lang)}</h3>
                    <p className="font-sans font-light" style={{ color: "#bdb9b2", fontSize: 15, maxWidth: 520, lineHeight: 1.5 }}>{T(s.body, lang)}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </Section>

        {/* ── Every project ────────────────────────────────────────────── */}
        <Section id="work" kicker={fr ? "Les projets" : "The projects"} title={fr ? <>Le travail parle<br />de lui-même</> : <>The work speaks<br />for itself</>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
            {showcase.map((p, i) => (
              <Link key={p.slug} href={href(`/work/${p.slug}`)} className="group" style={{ display: "block", position: "relative", overflow: "hidden", background: "#111", aspectRatio: i === 0 ? undefined : "4/5", gridColumn: i === 0 ? "1 / -1" : undefined, height: i === 0 ? "clamp(320px,55vw,680px)" : undefined }}>
                <img src={p.workCover || p.cover} alt={p.title} loading="lazy" className="transition-transform duration-700 group-hover:scale-105" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(10,10,10,0.9) 100%)" }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "clamp(18px,2.5vw,28px)" }}>
                  <span className="font-mono uppercase" style={{ color: "#9a968f", fontSize: 10, letterSpacing: "0.2em" }}>{p.category} · {p.year}</span>
                  <h3 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: i === 0 ? "clamp(2.2rem,5vw,4.5rem)" : "clamp(1.6rem,2.6vw,2.4rem)", lineHeight: 0.95, marginTop: 6 }}>{p.title}</h3>
                  {p.results?.[0] && <p className="font-mono uppercase" style={{ color: RED, fontSize: 11, letterSpacing: "0.15em", marginTop: 8 }}>{p.results[0]}</p>}
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ── Photo wall ───────────────────────────────────────────────── */}
        <section style={{ borderTop: "1px solid #1a1a1a", padding: "clamp(48px,8vw,96px) clamp(8px,1.5vw,16px)" }}>
          <div className="columns-2 md:columns-3 lg:columns-4" style={{ columnGap: 8 }}>
            {wall.map((src, i) => (
              <img key={src + i} src={src} alt="" loading="lazy" style={{ width: "100%", display: "block", marginBottom: 8, breakInside: "avoid" }} />
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <Section kicker={fr ? "Comment ça marche" : "How it works"} title={fr ? "Simple, du début à la fin" : "Simple, start to finish"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 1, background: "#1a1a1a" }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ background: "#0a0a0a", padding: "clamp(24px,3vw,36px)" }}>
                <div className="font-display font-bold" style={{ color: RED, fontSize: 56, lineHeight: 1 }}>0{i + 1}</div>
                <h3 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: 26, margin: "16px 0 8px" }}>{T(s.t, lang)}</h3>
                <p className="font-sans font-light" style={{ color: "#8a867f", fontSize: 15, lineHeight: 1.5 }}>{T(s.b, lang)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Quote form ───────────────────────────────────────────────── */}
        <Section id="quote" kicker={fr ? "Soumission gratuite" : "Free quote"} title={fr ? <>Parlons de<br /><span style={{ color: RED }}>votre projet</span></> : <>Tell me about<br /><span style={{ color: RED }}>your project</span></>}>
          <div className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: "40px 64px" }}>
            <div className="lg:col-span-2 font-sans font-light" style={{ color: "#bdb9b2", fontSize: 16, lineHeight: 1.6 }}>
              <p>{fr ? "Projets à partir de 1 200 $. Je vous réponds avec un prix fixe en moins de 24 h." : "Projects from $1,200. I reply with a fixed price within 24 hours."}</p>
              <p style={{ marginTop: 20 }}>
                <a href="mailto:hello@klipvisual.com" style={{ color: BONE }}>hello@klipvisual.com</a>
              </p>
            </div>
            <div className="lg:col-span-3">
              {sent ? (
                <div style={{ padding: "48px 0" }}>
                  <p className="font-mono uppercase" style={{ color: RED, fontSize: 11, letterSpacing: "0.3em" }}>{fr ? "Bien reçu" : "Received"}</p>
                  <h3 className="font-display font-bold uppercase text-[#f0ede8]" style={{ fontSize: 44, marginTop: 12 }}>{fr ? "Je vous reviens en moins de 24 h." : "I will get back to you within 24 hours."}</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
                  <input {...register("company_website")} type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
                  <label><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{fr ? "Nom" : "Name"} *</span>
                    <input {...register("name", { required: true, minLength: 2 })} autoComplete="name" style={input} />
                    {errors.name && <span className="font-mono" style={{ color: RED, fontSize: 10 }}>{fr ? "Requis" : "Required"}</span>}
                  </label>
                  <label><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{fr ? "Entreprise" : "Company"}</span>
                    <input {...register("company")} autoComplete="organization" style={input} />
                  </label>
                  <label><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{fr ? "Courriel" : "Email"} *</span>
                    <input {...register("email", { required: true, pattern: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i })} type="email" autoComplete="email" style={input} />
                    {errors.email && <span className="font-mono" style={{ color: RED, fontSize: 10 }}>{fr ? "Courriel invalide" : "Invalid email"}</span>}
                  </label>
                  <label><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{fr ? "Téléphone" : "Phone"}</span>
                    <input {...register("phone")} type="tel" autoComplete="tel" style={input} />
                  </label>
                  <label><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{fr ? "Type de projet" : "Project type"} *</span>
                    <select {...register("type", { required: true })} style={{ ...input, background: "#0a0a0a" }} defaultValue="">
                      <option value="" disabled>{fr ? "Choisir" : "Choose"}</option>
                      {TYPES.map((t) => <option key={t.en} value={T(t, lang)}>{T(t, lang)}</option>)}
                    </select>
                  </label>
                  <label><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{fr ? "Date prévue" : "Planned date"}</span>
                    <input {...register("date")} placeholder={fr ? "ex. mi-décembre" : "e.g. mid-December"} style={input} />
                  </label>
                  <label className="sm:col-span-2"><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>Budget</span>
                    <select {...register("budget")} style={{ ...input, background: "#0a0a0a" }} defaultValue="">
                      <option value="">{fr ? "À discuter" : "Let's discuss"}</option>
                      {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </label>
                  <label className="sm:col-span-2"><span className={label} style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 8 }}>{fr ? "Le projet en quelques mots" : "The project in a few words"}</span>
                    <textarea {...register("message")} rows={4} style={{ ...input, resize: "vertical" }} />
                  </label>
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={sending} className="font-mono uppercase" style={{ background: RED, color: "#fff", padding: "18px 34px", fontSize: 12, letterSpacing: "0.2em", border: 0, cursor: "pointer", minHeight: 52, opacity: sending ? 0.6 : 1 }}>
                      {sending ? (fr ? "Envoi…" : "Sending…") : (fr ? "Recevoir ma soumission" : "Get my quote")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <Section kicker="FAQ" title={fr ? "Questions fréquentes" : "Common questions"}>
          <div style={{ borderTop: "1px solid #1a1a1a", maxWidth: 900 }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="font-display font-bold uppercase text-left w-full flex justify-between items-center" style={{ color: BONE, fontSize: "clamp(1.2rem,2vw,1.6rem)", padding: "22px 0", background: "none", border: 0, cursor: "pointer", minHeight: 44 }}>
                  {T(f.q, lang)} <span style={{ color: RED }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <p className="font-sans font-light" style={{ color: "#8a867f", fontSize: 16, lineHeight: 1.6, paddingBottom: 22 }}>{T(f.a, lang)}</p>}
              </div>
            ))}
          </div>
        </Section>
      </main>

      {/* Mobile: the quote button is always one thumb away. */}
      <div className="lg:hidden" style={{ position: "fixed", left: 12, right: 12, bottom: "calc(12px + env(safe-area-inset-bottom))", zIndex: 40 }}>
        <a href="#quote" className="font-mono uppercase flex items-center justify-center" style={{ background: RED, color: "#fff", minHeight: 52, fontSize: 12, letterSpacing: "0.2em" }}>
          {fr ? "Demander une soumission" : "Get a quote"}
        </a>
      </div>
      <Footer />
    </>
  )
}
