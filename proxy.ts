import { NextResponse, type NextRequest } from "next/server"

/**
 * In Next 16 this file replaces middleware.ts (same job, new name).
 *
 * Every public page lives under /en or /fr. This redirects locale-less URLs
 * to the right one, picking French only when the browser actually asks for it.
 * Old URLs like /work keep working and pass their link equity along via a 308.
 */

const LOCALES = ["en", "fr"] as const
const DEFAULT_LOCALE = "en"

function preferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language")
  if (!header) return DEFAULT_LOCALE

  // Parse "fr-CA,fr;q=0.9,en;q=0.8" into a quality-ordered language list.
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=")
      return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const base = tag.split("-")[0]
    if (LOCALES.includes(base as (typeof LOCALES)[number])) return base
  }
  return DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocale) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url, 308)
}

export const config = {
  // Skip Next internals, the admin dashboard, API routes, and any file with an
  // extension (robots.txt, sitemap.xml, images, fonts).
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
}
