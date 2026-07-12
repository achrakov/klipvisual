import { notFound } from "next/navigation"
import type { Metadata } from "next"
import AboutPage from "./AboutClient"
import { JsonLd } from "@/app/components/JsonLd"
import { LOCALES, isLang, pageMetadata } from "@/app/lib/seo"
import { breadcrumbSchema } from "@/app/lib/schema"

type Params = { params: Promise<{ lang: string }> }

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMetadata("about", "/about", lang)
}

export default async function Page({ params }: Params) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const crumbs = [
    { name: "KLIPVISUAL", path: "" },
    { name: lang === "fr" ? "À propos" : "About", path: "/about" },
  ]

  return (
    <>
      <JsonLd schema={breadcrumbSchema(lang, crumbs)} />
      <AboutPage />
    </>
  )
}
