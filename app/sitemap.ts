import type { MetadataRoute } from "next"
import { projects } from "@/app/data/projects"
import { SITE_URL, DEFAULT_LOCALE, url } from "@/app/lib/seo"

/**
 * Every page is listed once per locale, and each entry declares its language
 * alternates. Google drops the whole hreflang set if the return links are
 * missing, so both locales are always emitted together.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookie", priority: 0.2, changeFrequency: "yearly" },
  ]

  const caseStudies = projects.map((p) => ({
    path: `/work/${p.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }))

  const all = [...routes, ...caseStudies]
  const lastModified = new Date()

  return all.flatMap(({ path, priority, changeFrequency }) =>
    (["en", "fr"] as const).map((lang) => ({
      url: url(lang, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: url("en", path),
          fr: url("fr", path),
          "x-default": url(DEFAULT_LOCALE, path),
        },
      },
    }))
  )
}

export const baseUrl = SITE_URL
