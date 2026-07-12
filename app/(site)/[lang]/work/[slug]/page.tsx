import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { projects, getProjectBySlug } from "@/app/data/projects"
import { JsonLd } from "@/app/components/JsonLd"
import { LOCALES, isLang, alternates } from "@/app/lib/seo"
import { breadcrumbSchema, caseStudySchema } from "@/app/lib/schema"
import ProjectClient from "./ProjectClient"

type Params = { params: Promise<{ lang: string; slug: string }> }

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}

  const project = getProjectBySlug(slug)
  if (!project) return {}

  const path = `/work/${slug}`
  const alts = alternates(lang, path)
  const title = `${project.title} | KLIPVISUAL`

  return {
    title: project.title,
    description: project.description,
    alternates: alts,
    openGraph: {
      type: "article",
      siteName: "KLIPVISUAL",
      title,
      description: project.description,
      url: alts.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
    },
  }
}

export default async function CaseStudyPage({ params }: Params) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()

  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  const crumbs = [
    { name: "KLIPVISUAL", path: "" },
    { name: lang === "fr" ? "Réalisations" : "Work", path: "/work" },
    { name: project.title, path: `/work/${slug}` },
  ]

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(lang, crumbs),
          caseStudySchema(lang, {
            slug: project.slug,
            title: project.title,
            description: project.description,
          }),
        ]}
      />
      <ProjectClient project={project} nextProject={nextProject} />
    </>
  )
}
