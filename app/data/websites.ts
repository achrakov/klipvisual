import type { Lang } from "@/app/i18n/translations"

/**
 * Website projects shown on /websites. One entry per site, newest first.
 *
 * Each site plays as an animated preview: the browser frame scrolls through
 * every page in `pages`, top to bottom, then fades to the next one, with the
 * phone version in sync. To add a site:
 *   1. Capture each page full-length, desktop at 1440 wide and phone at 390
 *      wide (capped at ~6 screens), saved as .webp in public/images/websites/<slug>/
 *      (desktop resized to 1200 wide is fine, only the ratio matters).
 *   2. Add an entry here with each page's capture height in px AT 1440 / 390 wide.
 *
 * `kind` is shown on the card so the page stays honest:
 *   "client"  = a site delivered to a paying client
 *   "concept" = a sample site for a made-up business (always labelled as such)
 *   "own"     = KLIPVISUAL's own site
 */
export type WebsiteKind = "client" | "concept" | "own"

export interface WebsitePage {
  /** Shown in the fake address bar after the host, e.g. "/fr/services". */
  path: string
  label: Record<Lang, string>
  desktop: string
  /** Capture height in px at 1440 wide (one screen = 900). */
  desktopH: number
  mobile: string
  /** Capture height in px at 390 wide (one screen = 844). */
  mobileH: number
}

/**
 * For sites whose animations are the point: a real scroll-through recording
 * (desktop 1440x900 and phone 390x844 viewports) plays in the frames instead of
 * the page-by-page captures. Recorded with scripts/record-site.cjs.
 */
export interface WebsiteVideo {
  /** Shown in the fake address bar after the host. */
  path: string
  desktop: string
  desktopPoster: string
  mobile: string
  mobilePoster: string
}

export interface WebsiteProject {
  slug: string
  name: string
  url: string
  year: number
  kind: WebsiteKind
  /** Either `pages` (captures, scrolled page by page) or `video`. */
  pages?: WebsitePage[]
  video?: WebsiteVideo
  tags: Record<Lang, string[]>
  summary: Record<Lang, string>
}

export const KIND_LABEL: Record<WebsiteKind, Record<Lang, string>> = {
  client: { en: "Client", fr: "Client" },
  concept: { en: "Concept", fr: "Concept" },
  own: { en: "In-house", fr: "Projet maison" },
}

const kv = (name: string) => `/images/websites/klipvisual/${name}.webp`

export const websites: WebsiteProject[] = [
  {
    slug: "klipvisual",
    name: "KLIPVISUAL",
    url: "https://www.klipvisual.com",
    year: 2026,
    kind: "own",
    pages: [
      { path: "/fr", label: { en: "Home", fr: "Accueil" }, desktop: kv("home-desktop"), desktopH: 5400, mobile: kv("home-mobile"), mobileH: 5064 },
      { path: "/fr/work", label: { en: "Portfolio", fr: "Portfolio" }, desktop: kv("work-desktop"), desktopH: 900, mobile: kv("work-mobile"), mobileH: 844 },
      { path: "/fr/work/boudchart-lolympia", label: { en: "Case study", fr: "Étude de cas" }, desktop: kv("work-boudchart-lolympia-desktop"), desktopH: 5400, mobile: kv("work-boudchart-lolympia-mobile"), mobileH: 5064 },
      { path: "/fr/services", label: { en: "Services", fr: "Services" }, desktop: kv("services-desktop"), desktopH: 5400, mobile: kv("services-mobile"), mobileH: 5064 },
      { path: "/fr/about", label: { en: "About", fr: "À propos" }, desktop: kv("about-desktop"), desktopH: 5400, mobile: kv("about-mobile"), mobileH: 5064 },
      { path: "/fr/contact", label: { en: "Contact", fr: "Contact" }, desktop: kv("contact-desktop"), desktopH: 1469, mobile: kv("contact-mobile"), mobileH: 2240 },
    ],
    tags: {
      en: ["Design", "Development", "Bilingual", "SEO"],
      fr: ["Design", "Développement", "Bilingue", "SEO"],
    },
    summary: {
      en: "A dark, cinematic portfolio, designed and built from scratch. A horizontal gallery you drag like film, a case study for every project, French and English versions, and a contact form wired straight into the KLIPVISUAL dashboard.",
      fr: "Un portfolio sombre et cinématographique, conçu et développé de A à Z. Une galerie horizontale qu'on fait défiler comme une pellicule, une étude de cas pour chaque projet, une version française et anglaise, et un formulaire de contact relié directement au tableau de bord de KLIPVISUAL.",
    },
  },
  {
    // Concept: a made-up salon (source + Flow originals in 3-DEMOS/concepts/atelier-nacre).
    slug: "atelier-nacre",
    name: "Atelier Nacre",
    url: "https://www.klipvisual.com/concepts/atelier-nacre/index.html",
    year: 2026,
    kind: "concept",
    video: {
      path: "/concepts/atelier-nacre",
      desktop: "/images/websites/atelier-nacre/desktop.mp4",
      desktopPoster: "/images/websites/atelier-nacre/desktop-poster.webp",
      mobile: "/images/websites/atelier-nacre/mobile.mp4",
      mobilePoster: "/images/websites/atelier-nacre/mobile-poster.webp",
    },
    tags: {
      en: ["Design", "Animations", "Bilingual", "Mobile first"],
      fr: ["Design", "Animations", "Bilingue", "Pensé mobile"],
    },
    summary: {
      en: "A website concept for an imaginary nail salon in Mile End. A deck of photos you shuffle with a tap, bands of text that slide by, a menu that reveals the work as you hover, a gallery you can open up, and a call button always within thumb's reach on a phone. Business and photos are fictional, the photos made with AI.",
      fr: "Un concept de site pour un salon d'ongles imaginaire du Mile End. Un jeu de photos qu'on brasse du bout du doigt, des bandeaux qui défilent, un menu qui dévoile les réalisations au survol, une galerie qu'on peut agrandir et un bouton d'appel toujours sous le pouce sur téléphone. Commerce et photos fictifs, photos créées par IA.",
    },
  },
]
