import { notFound } from "next/navigation"
import type { Metadata } from "next"
import HomeClient from "./HomeClient"
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
  // The layout already sets the home title as the default, so this only needs
  // the canonical and hreflang for the home route itself.
  const meta = pageMetadata("home", "", lang)
  return { ...meta, title: `KLIPVISUAL | ${meta.title}` }
}

export default async function Page({ params }: Params) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <>
      <JsonLd schema={breadcrumbSchema(lang, [{ name: "KLIPVISUAL", path: "" }])} />
      <HomeClient />
    </>
  )
}
