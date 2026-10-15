import type { Lang } from "@/app/i18n/translations"

/**
 * Website projects shown on /websites. One entry per site, newest first.
 * To add one: drop a desktop (1440x900) and a phone (390x844) screenshot in
 * public/images/websites/ as .webp, then add an entry here.
 *
 * `kind` is shown on the card so the page stays honest:
 *   "client"  = a site delivered to a paying client
 *   "concept" = a sample site for a made-up business (always labelled as such)
 *   "own"     = KLIPVISUAL's own site
 */
export type WebsiteKind = "client" | "concept" | "own"

export interface WebsiteProject {
  slug: string
  name: string
  url: string
  year: number
  kind: WebsiteKind
  desktop: string
  mobile: string
  tags: Record<Lang, string[]>
  summary: Record<Lang, string>
}

export const KIND_LABEL: Record<WebsiteKind, Record<Lang, string>> = {
  client: { en: "Client", fr: "Client" },
  concept: { en: "Concept", fr: "Concept" },
  own: { en: "In-house", fr: "Projet maison" },
}

export const websites: WebsiteProject[] = [
  {
    slug: "klipvisual",
    name: "KLIPVISUAL",
    url: "https://www.klipvisual.com",
    year: 2026,
    kind: "own",
    desktop: "/images/websites/klipvisual-desktop.webp",
    mobile: "/images/websites/klipvisual-mobile.webp",
    tags: {
      en: ["Design", "Development", "Bilingual", "SEO"],
      fr: ["Design", "Développement", "Bilingue", "SEO"],
    },
    summary: {
      en: "A dark, cinematic portfolio, designed and built from scratch. A horizontal gallery you drag like film, a case study for every project, French and English versions, and a contact form wired straight into the KLIPVISUAL dashboard.",
      fr: "Un portfolio sombre et cinématographique, conçu et développé de A à Z. Une galerie horizontale qu'on fait défiler comme une pellicule, une étude de cas pour chaque projet, une version française et anglaise, et un formulaire de contact relié directement au tableau de bord de KLIPVISUAL.",
    },
  },
]
