import type { MetadataRoute } from "next"
import { SITE_URL } from "@/app/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The dashboard also carries a noindex meta tag, which is what actually
        // protects it. This is belt and braces for the main host.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
