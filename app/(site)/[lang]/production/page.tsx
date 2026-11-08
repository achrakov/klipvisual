import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ProductionClient from "./ProductionClient"
import { JsonLd } from "@/app/components/JsonLd"
import { LOCALES, isLang, pageMetadata } from "@/app/lib/seo"
import { breadcrumbSchema } from "@/app/lib/schema"

// Landing page for photo and video work: where ads, the Instagram bio and
// outreach emails send people who need a shoot. One message, one button: a quote.

type Params = { params: Promise<{ lang: string }> }

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMetadata("production", "/production", lang)
}

export default async function Page({ params }: Params) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const crumbs = [
    { name: "KLIPVISUAL", path: "" },
    { name: lang === "fr" ? "Production photo et vidéo" : "Photo and video production", path: "/production" },
  ]
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(lang, crumbs)]} />
      <ProductionClient />
    </>
  )
}
