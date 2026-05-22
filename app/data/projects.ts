const CDN = "https://cdn.prod.website-files.com/673306db3b111afa559bc378"

const IMGS = {
  savoy:   `${CDN}/675eb91e5fafbd1f37953c10_savoy.webp`,
  moon:    `${CDN}/67923c109ebd8d8a03e4960c_moon.jpg`,
  taboo:   `${CDN}/675eb903f604a7a856c87467_taboo.webp`,
  kafka:   `${CDN}/67923c37a45465ae82ee3f8b_kafka.jpg`,
  project: `${CDN}/67923c1fa550c616a38131b9_project.jpg`,
  ana:     `${CDN}/67923c551123732db723b050_ana.jpg`,
  freud:   `${CDN}/67923c44b96499e7828b3f02_freud.jpg`,
}

export interface CrewMember {
  role: string
  name: string
}

export interface Project {
  slug: string
  title: string
  shortTitle: string
  category: string
  year: string
  description: string
  cover: string
  gradient: string
  accent: string
  results?: string[]
  services: string[]
  client?: string
  featured: boolean
  crew: CrewMember[]
  gallery: string[]
  videoUrl?: string
}

export const projects: Project[] = [
  {
    slug: "la-famille-quebec-alimentation",
    title: "La Famille Québec Alimentation",
    shortTitle: "La Famille QA",
    category: "Food Photography + Social Media",
    year: "2023",
    description:
      "A full-scope visual identity and social media campaign for one of Quebec's premier food brands. We crafted a cinematic food photography style that transformed their digital presence — turning everyday meals into aspirational moments.",
    cover: IMGS.savoy,
    gradient: "linear-gradient(135deg, #3a1f0a 0%, #7c3f1a 40%, #c8621e 100%)",
    accent: "#c8621e",
    results: ["+43% audience growth", "750K total reach", "3× engagement rate"],
    services: ["Food Photography", "Social Media Strategy", "Content Direction"],
    client: "La Famille QA",
    featured: true,
    crew: [
      { role: "Director / DOP", name: "Achraf Chibane" },
      { role: "Editor", name: "Achraf Chibane" },
      { role: "Art Direction", name: "KLIPVISUAL" },
      { role: "Color Grade", name: "Achraf Chibane" },
      { role: "Client", name: "La Famille QA" },
      { role: "Production", name: "KLIPVISUAL" },
    ],
    gallery: [IMGS.savoy, IMGS.taboo, IMGS.project, IMGS.ana, IMGS.freud, IMGS.kafka],
  },
  {
    slug: "boudchart-lolympia",
    title: "Boudchart at L'Olympia",
    shortTitle: "Boudchart",
    category: "Event Coverage + Live Production",
    year: "2024",
    description:
      "Live concert documentation for Boudchart's headline show at L'Olympia, Montreal. Multi-camera production capturing the raw energy of a sold-out night — every flash of light, every roaring crowd moment locked in frame.",
    cover: IMGS.moon,
    gradient: "linear-gradient(135deg, #0a0a2a 0%, #1a1050 40%, #3a1580 100%)",
    accent: "#6b35d4",
    services: ["Live Event Coverage", "Multi-Camera Production", "Video Editing"],
    client: "Boudchart",
    featured: true,
    crew: [
      { role: "Director / DOP", name: "Achraf Chibane" },
      { role: "Multi-Cam Operator", name: "KLIPVISUAL" },
      { role: "Editor", name: "Achraf Chibane" },
      { role: "Color Grade", name: "Achraf Chibane" },
      { role: "Client", name: "Boudchart" },
      { role: "Venue", name: "L'Olympia, Montréal" },
    ],
    gallery: [IMGS.moon, IMGS.freud, IMGS.kafka, IMGS.taboo, IMGS.project, IMGS.savoy],
  },
  {
    slug: "tiktok-canada",
    title: "TikTok Canada",
    shortTitle: "TikTok Canada",
    category: "Influencer Content + Video Production",
    year: "2023",
    description:
      "Official content production for TikTok Canada's creator campaigns. Short-form video that didn't just meet the brief — it set the template. Scroll-stopping visuals built for the algorithm, driven by storytelling.",
    cover: IMGS.taboo,
    gradient: "linear-gradient(135deg, #0a0f1a 0%, #010b1a 40%, #0a2a4a 100%)",
    accent: "#00c8ff",
    services: ["Influencer Content", "Short-Form Video", "Creative Direction"],
    client: "TikTok Canada",
    featured: true,
    crew: [
      { role: "Creative Director", name: "Achraf Chibane" },
      { role: "Director / DOP", name: "Achraf Chibane" },
      { role: "Editor", name: "Achraf Chibane" },
      { role: "Content Strategy", name: "KLIPVISUAL" },
      { role: "Client", name: "TikTok Canada" },
      { role: "Production", name: "KLIPVISUAL" },
    ],
    gallery: [IMGS.taboo, IMGS.project, IMGS.moon, IMGS.ana, IMGS.savoy, IMGS.freud],
  },
  {
    slug: "coach-racicot",
    title: "Coach Racicot",
    shortTitle: "Coach Racicot",
    category: "Video Series + Social Media",
    year: "2023",
    description:
      "A documentary-style video series following performance coach Racicot. Built from the ground up — concept, production, editing, and distribution strategy. The result: a personal brand that commands attention.",
    cover: IMGS.kafka,
    gradient: "linear-gradient(135deg, #050d1a 0%, #0a1e38 40%, #0f3060 100%)",
    accent: "#1e5fa8",
    results: ["1.2M impressions", "4K new followers", "Top 5% creator growth"],
    services: ["Video Series", "Social Media Management", "Brand Strategy"],
    client: "Coach Racicot",
    featured: true,
    crew: [
      { role: "Director / DOP", name: "Achraf Chibane" },
      { role: "Series Editor", name: "Achraf Chibane" },
      { role: "Brand Strategy", name: "KLIPVISUAL" },
      { role: "Color Grade", name: "Achraf Chibane" },
      { role: "Client", name: "Coach Racicot" },
      { role: "Distribution", name: "KLIPVISUAL" },
    ],
    gallery: [IMGS.kafka, IMGS.freud, IMGS.taboo, IMGS.moon, IMGS.project, IMGS.ana],
  },
  {
    slug: "ilinca-x-sofia",
    title: "Ilinca × Sofia",
    shortTitle: "Ilinca × Sofia",
    category: "Portrait Photography + Creative Direction",
    year: "2024",
    description:
      "An editorial portrait session exploring the intersection of femininity, movement, and light. Every frame a conversation between subject and space. Shot on location across Montreal with a cinematic vision.",
    cover: IMGS.project,
    gradient: "linear-gradient(135deg, #1a0a10 0%, #3a1020 40%, #6b1f35 100%)",
    accent: "#c43b5e",
    services: ["Portrait Photography", "Creative Direction", "Retouching"],
    featured: false,
    crew: [
      { role: "Photographer / Director", name: "Achraf Chibane" },
      { role: "Creative Direction", name: "Achraf Chibane" },
      { role: "Retouching", name: "KLIPVISUAL" },
      { role: "Styling", name: "Ilinca & Sofia" },
      { role: "Location", name: "Montréal, QC" },
      { role: "Production", name: "KLIPVISUAL" },
    ],
    gallery: [IMGS.project, IMGS.ana, IMGS.taboo, IMGS.savoy, IMGS.freud, IMGS.kafka],
  },
  {
    slug: "simo-x-nesrine",
    title: "Simo × Nesrine",
    shortTitle: "Simo × Nesrine",
    category: "Wedding Photography + Videography",
    year: "2024",
    description:
      "A full-day wedding production for Simo and Nesrine — ceremony to last dance. Cinematic photography and a feature-length highlight film that captures the texture of one of the most important days of their lives.",
    cover: IMGS.ana,
    gradient: "linear-gradient(135deg, #1a1408 0%, #3a2e10 40%, #7a6020 100%)",
    accent: "#c8a040",
    services: ["Wedding Photography", "Cinematic Videography", "Same-Day Edit"],
    featured: false,
    crew: [
      { role: "Cinematographer", name: "Achraf Chibane" },
      { role: "Photographer", name: "Achraf Chibane" },
      { role: "Same-Day Editor", name: "Achraf Chibane" },
      { role: "Color Grade", name: "Achraf Chibane" },
      { role: "Sound", name: "KLIPVISUAL" },
      { role: "Production", name: "KLIPVISUAL" },
    ],
    gallery: [IMGS.ana, IMGS.savoy, IMGS.project, IMGS.taboo, IMGS.moon, IMGS.freud],
  },
  {
    slug: "iamstevedaniel-troy-bond",
    title: "iamstevedaniel × Troy Bond",
    shortTitle: "Steve × Troy",
    category: "Content Creation + Video",
    year: "2023",
    description:
      "A collaborative content day with creators iamstevedaniel and Troy Bond. High-volume, high-quality content built for multi-platform distribution. Directed, shot, and edited in 48 hours.",
    cover: IMGS.freud,
    gradient: "linear-gradient(135deg, #051a10 0%, #0a3020 40%, #145030 100%)",
    accent: "#1e8050",
    services: ["Content Day", "Video Production", "Photo Editing"],
    featured: false,
    crew: [
      { role: "Director / DOP", name: "Achraf Chibane" },
      { role: "Editor", name: "Achraf Chibane" },
      { role: "Content Strategy", name: "KLIPVISUAL" },
      { role: "Color Grade", name: "Achraf Chibane" },
      { role: "Talent", name: "iamstevedaniel × Troy Bond" },
      { role: "Production", name: "KLIPVISUAL" },
    ],
    gallery: [IMGS.freud, IMGS.kafka, IMGS.moon, IMGS.taboo, IMGS.ana, IMGS.savoy],
  },
  {
    slug: "romeo-et-fils",
    title: "Romeo & Fils",
    shortTitle: "Romeo & Fils",
    category: "Video Production + TV",
    year: "2022",
    description:
      "Broadcast-quality video production for Romeo & Fils, a Montreal institution. From pre-production through final delivery, a campaign built for television and digital — where craft meets commerce.",
    cover: IMGS.savoy,
    gradient: "linear-gradient(135deg, #1a0505 0%, #380808 40%, #700f0f 100%)",
    accent: "#b01818",
    services: ["TV Commercial", "Video Production", "Post Production"],
    client: "Romeo & Fils",
    featured: false,
    crew: [
      { role: "Director", name: "Achraf Chibane" },
      { role: "Director of Photography", name: "Achraf Chibane" },
      { role: "Editor", name: "Achraf Chibane" },
      { role: "Color Grade", name: "Achraf Chibane" },
      { role: "Client", name: "Romeo & Fils" },
      { role: "Production", name: "KLIPVISUAL" },
    ],
    gallery: [IMGS.savoy, IMGS.taboo, IMGS.freud, IMGS.kafka, IMGS.project, IMGS.moon],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export const featuredProjects = projects.filter((p) => p.featured)
