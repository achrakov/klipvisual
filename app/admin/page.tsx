import { readFile } from "fs/promises"
import { join } from "path"
import { projects as allProjects } from "../data/projects"
import AdminClient from "./AdminClient"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  let media: Record<string, unknown> = {}
  try {
    const raw = await readFile(join(process.cwd(), "app", "data", "media.json"), "utf-8")
    media = JSON.parse(raw)
  } catch {}

  const projects = allProjects.map((p) => ({
    slug: p.slug,
    shortTitle: p.shortTitle,
    cover: p.cover,
    category: p.category,
    year: p.year,
    albumLabels: p.albums?.map((a) => a.label),
    themeNames: p.themes?.map((t) => t.name),
    themeAspectRatios: p.themes?.map((t) => t.aspectRatio ?? "4/3"),
    reelCount: p.reels?.length,
    recipeReelCount: p.recipeReels?.length,
    videoTalents: p.videos?.map((v) => ({ talent: v.talent, role: v.role, cover: v.cover })),
    pitchDeckNames: p.pitchDecks?.map((d) => d.name),
    hasMainVideo: !p.videos && !p.reels && !p.themes && !p.albums && !p.pitchDecks,
    hasGallery: !p.noGallery,
    galleryLandscape: !!p.galleryLandscape,
    concertLayout: !!p.concertLayout,
    editorialLayout: !!p.editorialLayout,
    hasPoster: !!p.hasPoster,
    hasPosters: !!p.hasPosters,
    hasResults: !!p.results,
    defaultResults: p.results?.map(r => {
      const words = r.trim().split(/\s+/)
      return { stat: words[0], label: words.slice(1).join(" ") }
    }),
  }))

  return <AdminClient projects={projects} initialMedia={media} />
}
