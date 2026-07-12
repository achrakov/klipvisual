import type { Lang } from "@/app/i18n/translations"
import { SITE_URL, url } from "./seo"

/**
 * KLIPVISUAL is a service area business: I work across Montreal and travel to
 * clients, and there is no public storefront. So the schema carries areaServed
 * and no streetAddress. Inventing an address to look "more local" is the fastest
 * way to get a Google Business Profile suspended.
 */

const ORG_ID = `${SITE_URL}/#business`
const PERSON_ID = `${SITE_URL}/#achraf`
const SITE_ID = `${SITE_URL}/#website`

const SAME_AS = ["https://www.instagram.com/klipvisual.mtl/"]

export function businessSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "KLIPVISUAL",
    url: url(lang),
    email: "hello@klipvisual.com",
    image: `${SITE_URL}/Logos/Logo.png`,
    logo: `${SITE_URL}/Logos/Logo.png`,
    description:
      lang === "fr"
        ? "Production vidéo, photographie et image de marque à Montréal. Vidéaste et photographe indépendant, du concept à la livraison finale."
        : "Video production, photography and brand identity in Montreal. Independent videographer and photographer, from concept to final delivery.",
    priceRange: "$$",
    founder: { "@id": PERSON_ID },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Montreal",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    areaServed: [
      { "@type": "City", name: "Montreal" },
      { "@type": "City", name: "Laval" },
      { "@type": "City", name: "Longueuil" },
      { "@type": "AdministrativeArea", name: "Greater Montreal" },
      { "@type": "AdministrativeArea", name: "Quebec" },
    ],
    knowsLanguage: ["en", "fr"],
    sameAs: SAME_AS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: lang === "fr" ? "Services" : "Services",
      itemListElement: serviceList(lang).map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          serviceType: s.name,
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "City", name: "Montreal" },
        },
      })),
    },
  }
}

function serviceList(lang: Lang) {
  if (lang === "fr") {
    return [
      { name: "Production vidéo", description: "Films de marque, journées de contenu, vidéos corporatives, vidéoclips et montage." },
      { name: "Photographie", description: "Photographie culinaire et de produits, événements, portraits et immobilier." },
      { name: "Design et image de marque", description: "Logo, identité visuelle, présentations et gabarits pour les réseaux sociaux." },
    ]
  }
  return [
    { name: "Video Production", description: "Brand films, content days, corporate video, music video and editing." },
    { name: "Photography", description: "Food and product photography, events, portraits and real estate." },
    { name: "Design and Branding", description: "Logo, brand identity, pitch decks and social templates." },
  ]
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Achraf Chibane",
    jobTitle: "Director, Videographer and Photographer",
    worksFor: { "@id": ORG_ID },
    url: `${SITE_URL}/en/about`,
    image: `${SITE_URL}/Logos/Logo.png`,
    knowsLanguage: ["en", "fr", "ar"],
    knowsAbout: [
      "Video production",
      "Cinematography",
      "Photography",
      "Brand identity",
      "Colour grading",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "ISMAC (Institut Supérieur des Métiers de l'Audiovisuel et du Cinéma)",
    },
    sameAs: SAME_AS,
  }
}

export function websiteSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: url(lang),
    name: "KLIPVISUAL",
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
  }
}

export function breadcrumbSchema(lang: Lang, trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: url(lang, item.path),
    })),
  }
}

interface WorkItem {
  slug: string
  title: string
  description: string
  cover?: string
}

export function portfolioSchema(lang: Lang, items: WorkItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: lang === "fr" ? "Réalisations" : "Work",
    inLanguage: lang,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: url(lang, `/work/${p.slug}`),
        name: p.title,
      })),
    },
  }
}

export function caseStudySchema(
  lang: Lang,
  project: { slug: string; title: string; description: string; cover?: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.description,
    inLanguage: lang,
    url: url(lang, `/work/${project.slug}`),
    ...(project.cover
      ? { image: project.cover.startsWith("http") ? project.cover : `${SITE_URL}${project.cover}` }
      : {}),
    creator: { "@id": PERSON_ID },
    provider: { "@id": ORG_ID },
  }
}
