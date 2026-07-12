import type { Lang } from "@/app/i18n/translations"

// Vercel serves the site on www and redirects the apex to it. Canonicals,
// hreflang and the sitemap must name the host that actually answers with a 200,
// otherwise every URL we hand Google points at a redirect.
export const SITE_URL = "https://www.klipvisual.com"
export const LOCALES: Lang[] = ["en", "fr"]
export const DEFAULT_LOCALE: Lang = "en"

export const OG_LOCALE: Record<Lang, string> = {
  en: "en_CA",
  fr: "fr_CA",
}

export function isLang(value: string): value is Lang {
  return (LOCALES as string[]).includes(value)
}

/** Absolute URL for a locale + path. `path` is the locale-less route, e.g. "/work". */
export function url(lang: Lang, path = "") {
  const clean = path === "/" ? "" : path
  return `${SITE_URL}/${lang}${clean}`
}

/**
 * hreflang set for a route. Google ignores the whole set unless every version
 * self-references and links back to the others, so this always emits the full
 * mesh plus a single x-default.
 */
export function alternates(lang: Lang, path = "") {
  return {
    canonical: url(lang, path),
    languages: {
      en: url("en", path),
      fr: url("fr", path),
      "x-default": url(DEFAULT_LOCALE, path),
    },
  }
}

interface PageMeta {
  title: string
  description: string
}

/**
 * Builds the full metadata block for a page: title, description, canonical,
 * the hreflang mesh, and locale-correct Open Graph. `key` indexes PAGE_META,
 * `path` is the locale-less route ("/work", "" for home).
 */
export function pageMetadata(key: string, path: string, lang: Lang) {
  const meta = PAGE_META[key][lang]
  const alts = alternates(lang, path)

  return {
    title: meta.title,
    description: meta.description,
    alternates: alts,
    openGraph: {
      type: "website" as const,
      siteName: "KLIPVISUAL",
      locale: OG_LOCALE[lang],
      title: `${meta.title} | KLIPVISUAL`,
      description: meta.description,
      url: alts.canonical,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${meta.title} | KLIPVISUAL`,
      description: meta.description,
    },
  }
}

/**
 * Per-page titles and descriptions. Descriptions carry the Montreal service
 * terms people actually search, in both languages, and follow the brand rules:
 * first person, no em dashes.
 */
export const PAGE_META: Record<string, Record<Lang, PageMeta>> = {
  home: {
    en: {
      title: "Video Production & Photography in Montreal",
      description:
        "I am Achraf Chibane, a Montreal videographer and photographer. I shoot, direct, edit and brand: video production, brand photography and visual identity, from concept to final grade.",
    },
    fr: {
      title: "Production vidéo et photographie à Montréal",
      description:
        "Je suis Achraf Chibane, vidéaste et photographe à Montréal. Je filme, réalise, monte et crée l'identité de marque : production vidéo, photographie et branding, du concept à l'étalonnage final.",
    },
  },
  work: {
    en: {
      title: "Work & Portfolio",
      description:
        "Selected video production and photography projects in Montreal: brand films, event coverage, food and product photography, portraits and brand identity work.",
    },
    fr: {
      title: "Réalisations et portfolio",
      description:
        "Projets de production vidéo et de photographie à Montréal : films de marque, couverture d'événements, photographie culinaire et de produits, portraits et identité de marque.",
    },
  },
  services: {
    en: {
      title: "Services & Pricing",
      description:
        "Video production, photography, and design and branding in Montreal. Brand films, content days, event coverage, food and product photography, logos and brand identity. Clear packages and pricing.",
    },
    fr: {
      title: "Services et tarifs",
      description:
        "Production vidéo, photographie, design et image de marque à Montréal. Films de marque, journées de contenu, couverture d'événements, photographie culinaire et de produits, logos et identité visuelle. Forfaits et tarifs clairs.",
    },
  },
  about: {
    en: {
      title: "About Achraf Chibane",
      description:
        "Cinema-trained in Morocco, design-educated in Quebec, eight years of video, photo and branding work. Based in Montreal, I handle the full pipeline myself: no agency, no middleman.",
    },
    fr: {
      title: "À propos d'Achraf Chibane",
      description:
        "Formé en cinéma au Maroc, en design au Québec, huit ans de projets en vidéo, photo et image de marque. Basé à Montréal, je gère toute la chaîne moi-même : sans agence, sans intermédiaire.",
    },
  },
  contact: {
    en: {
      title: "Contact",
      description:
        "Start a video production, photography or branding project in Montreal. Tell me what you are building and I will come back with a plan and a quote.",
    },
    fr: {
      title: "Contact",
      description:
        "Lancez un projet de production vidéo, de photographie ou d'image de marque à Montréal. Dites-moi ce que vous construisez et je reviens avec un plan et une soumission.",
    },
  },
  privacy: {
    en: { title: "Privacy Policy", description: "How KLIPVISUAL collects, uses and protects your personal information." },
    fr: { title: "Politique de confidentialité", description: "Comment KLIPVISUAL recueille, utilise et protège vos renseignements personnels." },
  },
  terms: {
    en: { title: "Terms of Service", description: "The terms that apply to KLIPVISUAL projects and to the use of this website." },
    fr: { title: "Conditions d'utilisation", description: "Les conditions qui s'appliquent aux projets KLIPVISUAL et à l'utilisation de ce site." },
  },
  cookie: {
    en: { title: "Cookie Policy", description: "How this website uses cookies and how you can control them." },
    fr: { title: "Politique de témoins", description: "Comment ce site utilise les témoins et comment vous pouvez les contrôler." },
  },
}
