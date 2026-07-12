import { notFound } from "next/navigation"
import type { Metadata } from "next"
import WorkClient from "./WorkClient"
import { JsonLd } from "@/app/components/JsonLd"
import { projects } from "@/app/data/projects"
import { LOCALES, isLang, pageMetadata } from "@/app/lib/seo"
import { breadcrumbSchema, portfolioSchema } from "@/app/lib/schema"

type Params = { params: Promise<{ lang: string }> }

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return pageMetadata("work", "/work", lang)
}

export default async function Page({ params }: Params) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const crumbs = [
    { name: "KLIPVISUAL", path: "" },
    { name: lang === "fr" ? "Réalisations" : "Work", path: "/work" },
  ]

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(lang, crumbs),
          portfolioSchema(
            lang,
            projects.map((p) => ({ slug: p.slug, title: p.title, description: p.description }))
          ),
        ]}
      />
      <WorkClient />
    </>
  )
}
