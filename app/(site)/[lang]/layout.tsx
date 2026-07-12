import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Barlow_Condensed, DM_Sans, Space_Mono } from "next/font/google"
import "@/app/globals.css"
import { Navbar } from "@/app/components/Navbar"
import { CustomCursor } from "@/app/components/CustomCursor"
import { FilmGrain } from "@/app/components/FilmGrain"
import { SmoothScroll } from "@/app/components/SmoothScroll"
import { JsonLd } from "@/app/components/JsonLd"
import { LanguageProvider } from "@/app/i18n/LanguageContext"
import { Analytics } from "@vercel/analytics/next"
import { LOCALES, OG_LOCALE, SITE_URL, alternates, PAGE_META, isLang } from "@/app/lib/seo"
import { businessSchema, personSchema, websiteSchema } from "@/app/lib/schema"

const barlow = Barlow_Condensed({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
})

const dmSans = DM_Sans({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}

  const meta = PAGE_META.home[lang]
  const canonical = alternates(lang).canonical

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `KLIPVISUAL | ${meta.title}`,
      template: "%s | KLIPVISUAL",
    },
    description: meta.description,
    alternates: alternates(lang),
    openGraph: {
      type: "website",
      siteName: "KLIPVISUAL",
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      title: `KLIPVISUAL | ${meta.title}`,
      description: meta.description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `KLIPVISUAL | ${meta.title}`,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <html
      lang={lang}
      className={`${barlow.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[#0a0a0a] text-[#f0ede8] antialiased overflow-x-hidden">
        <JsonLd schema={[businessSchema(lang), personSchema(), websiteSchema(lang)]} />
        <LanguageProvider lang={lang}>
          <FilmGrain />
          <CustomCursor />
          <Navbar />
          <SmoothScroll>{children}</SmoothScroll>
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
