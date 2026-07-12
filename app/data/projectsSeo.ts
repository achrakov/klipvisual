import type { Lang } from "@/app/i18n/translations"
import { getProjectBySlug, type Project } from "./projects"

/**
 * SEO copy for case studies, kept separate from projects.ts so the long-form
 * page copy stays untouched.
 *
 * Two reasons this exists:
 *  - The body descriptions run to a full paragraph. Google truncates a meta
 *    description around 155 characters, so these are written short on purpose.
 *  - The French pages need French titles and descriptions, otherwise the FR
 *    URLs compete in French results with English snippets.
 *
 * Brand rules apply: first person, no em dashes.
 */

interface ProjectSeo {
  title: { en: string; fr: string }
  description: { en: string; fr: string }
}

const PROJECT_SEO: Record<string, ProjectSeo> = {
  "boudchart-lolympia": {
    title: {
      en: "Boudchart at L'Olympia: Concert Video",
      fr: "Boudchart à L'Olympia : vidéo de concert",
    },
    description: {
      en: "Multi-camera concert video for Boudchart's sold-out headline show at L'Olympia in Montreal, cut for both long-form and social.",
      fr: "Captation multicaméra du concert à guichets fermés de Boudchart à L'Olympia, à Montréal, montée en format long et pour les réseaux sociaux.",
    },
  },
  "la-famille-quebec-alimentation": {
    title: {
      en: "La Famille Quebec Alimentation: Brand Campaign",
      fr: "La Famille Québec Alimentation : campagne de marque",
    },
    description: {
      en: "A documentary-style corporate video campaign for Quebec Alimentation, from concept to grade. Reached over 750,000 people.",
      fr: "Campagne vidéo corporative de style documentaire pour Québec Alimentation, du concept à l'étalonnage. Plus de 750 000 personnes rejointes.",
    },
  },
  "lebalcon-events": {
    title: {
      en: "Le Balcon: Event Photography & Video",
      fr: "Le Balcon : photo et vidéo d'événements",
    },
    description: {
      en: "Official visual partner for Le Balcon in Montreal. Photo, video and posters for over 15 live events across a single season.",
      fr: "Partenaire visuel officiel du Balcon à Montréal. Photo, vidéo et affiches pour plus de 15 événements en une seule saison.",
    },
  },
  "culinary-photography": {
    title: {
      en: "Food & Menu Photography, Montreal",
      fr: "Photographie culinaire et de menu à Montréal",
    },
    description: {
      en: "Studio-lit food photography for Quebec restaurants and food brands, built for menus, social campaigns and in-store signage.",
      fr: "Photographie culinaire en studio pour restaurants et marques alimentaires du Québec, conçue pour les menus, les campagnes sociales et l'affichage en magasin.",
    },
  },
  "portrait-photography": {
    title: {
      en: "Portrait Photography, Montreal",
      fr: "Photographie de portrait à Montréal",
    },
    description: {
      en: "Portrait sessions across Montreal for professionals, couples and creatives, shot with natural and controlled lighting.",
      fr: "Séances de portrait à Montréal pour professionnels, couples et créatifs, en lumière naturelle ou contrôlée.",
    },
  },
  "branding-design": {
    title: {
      en: "Brand Identity & Logo Design",
      fr: "Identité de marque et design de logo",
    },
    description: {
      en: "Complete brand identity systems: logo, typography, moodboards and mockups, built to hold up across every platform.",
      fr: "Systèmes d'identité de marque complets : logo, typographie, planches d'ambiance et maquettes, conçus pour tenir sur toutes les plateformes.",
    },
  },
  "simo-x-nesrine": {
    title: {
      en: "Simo & Nesrine: Wedding Photography",
      fr: "Simo et Nesrine : photographie de mariage",
    },
    description: {
      en: "Cinematic wedding photography built on candid moments and composed portraits, with controlled lighting and refined grading.",
      fr: "Photographie de mariage cinématographique, entre moments spontanés et portraits composés, avec éclairage contrôlé et étalonnage soigné.",
    },
  },
  "jidar-toiles-de-rue": {
    title: {
      en: "JIDAR: Toiles de Rue, Documentary",
      fr: "JIDAR : Toiles de Rue, documentaire",
    },
    description: {
      en: "A 13-minute documentary on mural art in Morocco, following the Sbagha Bagha festival and the JIDAR organization.",
      fr: "Documentaire de 13 minutes sur l'art mural au Maroc, à travers le festival Sbagha Bagha et l'organisation JIDAR.",
    },
  },
  coma: {
    title: {
      en: "COMA: Short Fiction Film",
      fr: "COMA : court métrage de fiction",
    },
    description: {
      en: "A 6-minute psychological short film on the fragile space between consciousness and reality, told through atmosphere and pacing.",
      fr: "Court métrage psychologique de 6 minutes sur l'espace fragile entre la conscience et la réalité, porté par l'atmosphère et le rythme.",
    },
  },
  "pitch-decks": {
    title: {
      en: "Pitch Decks: Strategy & Brand Presentations",
      fr: "Présentations investisseurs et décks de marque",
    },
    description: {
      en: "Investor and client pitch decks built from positioning and narrative through to slide architecture and visual identity.",
      fr: "Décks pour investisseurs et clients, du positionnement et du récit jusqu'à l'architecture des diapositives et l'identité visuelle.",
    },
  },
  "terry-osias": {
    title: {
      en: "Terry Osias: Champion's Story",
      fr: "Terry Osias : l'histoire d'un champion",
    },
    description: {
      en: "Three cinematic films and a photo session for Canadian boxing champion Terry Osias, plus the launch of his boxing studio.",
      fr: "Trois films cinématographiques et une séance photo pour le champion de boxe canadien Terry Osias, ainsi que le lancement de son studio.",
    },
  },
}

export interface LocalizedProject {
  slug: string
  title: string
  description: string
  project: Project
}

/**
 * Title and description for a case study in the requested locale. Falls back to
 * the project's own English copy if a slug has no SEO entry yet, so a new
 * project never ships with an empty description.
 */
export function localizedProject(slug: string, lang: Lang): LocalizedProject | null {
  const project = getProjectBySlug(slug)
  if (!project) return null

  const seo = PROJECT_SEO[slug]
  return {
    slug,
    title: seo?.title[lang] ?? project.title,
    description: seo?.description[lang] ?? project.description,
    project,
  }
}
