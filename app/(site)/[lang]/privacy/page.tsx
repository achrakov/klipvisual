import { notFound } from "next/navigation"
import type { Metadata } from "next"
import PrivacyPage from "./PrivacyClient"
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
  return pageMetadata("privacy", "/privacy", lang)
}

export default async function Page({ params }: Params) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const crumbs = [
    { name: "KLIPVISUAL", path: "" },
    { name: lang === "fr" ? "Confidentialité" : "Privacy", path: "/privacy" },
  ]

  return (
    <>
      <JsonLd schema={breadcrumbSchema(lang, crumbs)} />
      <PrivacyPage />
    </>
  )
}
