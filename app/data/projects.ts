import mediaJson from "./media.json"


export interface CrewMember {
  role: string
  name: string
}

export interface CreditBlock {
  label: string
  names: string[]
}

export interface ProjectVideo {
  talent: string
  role: string
  cover: string
  videoId?: string
}

export interface PhotoAlbum {
  label: string
  description?: string
  images: string[]
  aspectRatio?: string
  columns?: number
}

export interface EventEntry {
  name: string
  type: string
  date?: string
  cover: string
  videoId?: string
}

export interface EventTheme {
  name: string
  cover: string
  images: string[]
  aspectRatio?: string
}

export interface EventReel {
  title?: string
  cover?: string
  videoId?: string
}

export interface PitchDeck {
  name: string
  client?: string
  industry?: string
  year?: string
  description?: string
  slides: string[]
}

export interface BrandCaseStudy {
  name: string
  subtitle?: string
  industry?: string
  description: string
  scopeOfWork?: string[]
  note?: string
  images: string[]
}

export interface Project {
  slug: string
  title: string
  shortTitle: string
  category: string
  year: string
  description: string
  cover: string
  workCover?: string
  gradient: string
  accent: string
  results?: string[]
  services: string[]
  client?: string
  featured: boolean
  crew: CrewMember[]
  gallery: string[]
  videoUrl?: string
  extendedCredits?: CreditBlock[]
  coverFit?: 'cover' | 'contain'
  videos?: ProjectVideo[]
  albums?: PhotoAlbum[]
  events?: EventEntry[]
  themes?: EventTheme[]
  reels?: EventReel[]
  themeSectionLabel?: string
  reelSectionLabel?: string
  pitchDecks?: PitchDeck[]
  brandProjects?: BrandCaseStudy[]
  logofolio?: string[]
  brandingLayout?: boolean
  noGallery?: boolean
  galleryLandscape?: boolean
  concertLayout?: boolean
  editorialLayout?: boolean
  poster?: string
  hasPoster?: boolean
  posters?: string[]
  hasPosters?: boolean
  recipeReels?: EventReel[]
  creditsCover?: string
  stills?: string[]
  resultsBg?: string
  resultsData?: Array<{ stat: string; label: string }>
  imagePositions?: Record<string, { x: number; y: number; scale?: number; panX?: number; panY?: number }>
}

const _raw: Project[] = [
  {
    slug: "la-famille-quebec-alimentation",
    title: "La Famille Québec Alimentation: Brand Campaign",
    shortTitle: "La Famille QA",
    category: "Corporate Video + Brand Identity",
    year: "2023",
    description:
      "A full-scope brand identity video campaign for Québec Alimentation, built independently from concept to delivery. The project focused on humanizing the company through documentary-style corporate storytelling, highlighting employee experiences and workplace culture across Facebook, LinkedIn, YouTube, and the company website. From interview structure and lighting design to editing and color grading, every frame was crafted to balance professional aesthetics with authentic human storytelling, creating a repeatable video pipeline that strengthened the brand's digital presence and supported recruitment efforts.",
    cover: "/images/projects/LafamilleQa-cover.jpg",
    gradient: "linear-gradient(135deg, #3a1f0a 0%, #7c3f1a 40%, #c8621e 100%)",
    accent: "#c8621e",
    results: ["750K+ total reach", "+43% engagement growth", "Multi-platform pipeline delivered"],
    services: ["Concept Development", "Art Direction", "Cinematography", "Lighting Design", "Editing", "Color Grading"],
    client: "Québec Alimentation",
    featured: true,
    crew: [
      { role: "Direction · Cinematography · Editing · Color", name: "Achraf Chibane" },
      { role: "Full Production", name: "KLIPVISUAL" },
      { role: "Client", name: "Québec Alimentation" },
    ],
    gallery: [],
    noGallery: true,
    videos: [
      { talent: "Kimberly Gauthier", role: "Adjointe Administrative", cover: "/images/projects/Qa-Talents-cover/Kimberly Gauthier.jpg" },
      { talent: "Alyss Nolet", role: "Adjointe Administrative", cover: "/images/projects/Qa-Talents-cover/Alyss Nolet.jpg" },
      { talent: "Anny Turbide", role: "Adjointe de Direction", cover: "/images/projects/Qa-Talents-cover/Anny Turbide.jpg" },
      { talent: "Tommy Gendreau", role: "Service à la Clientèle & Dispatch", cover: "/images/projects/Qa-Talents-cover/Tommy Gendreau.jpg" },
    ],
    extendedCredits: [
      {
        label: "On-Screen Talent",
        names: ["Kimberly Gauthier, Adjointe Administrative", "Alyss Nolet, Adjointe Administrative", "Anny Turbide, Adjointe de Direction", "Tommy Gendreau, Service à la Clientèle & Dispatch"],
      },
      {
        label: "Deliverables",
        names: ["Brand Awareness Videos", "Recruitment Content", "Social Media Series", "Website Video Assets"],
      },
      {
        label: "Distribution",
        names: ["YouTube", "LinkedIn", "Company Website"],
      },
      {
        label: "Art Direction",
        names: ["Clean modern corporate aesthetics", "Documentary-style realism", "Standardized lighting & framing", "Consistent visual identity across episodes"],
      },
    ],
  },
  {
    slug: "boudchart-lolympia",
    title: "Boudchart at L'Olympia",
    shortTitle: "Boudchart",
    category: "Event Coverage + Live Production",
    year: "2024",
    description:
      "Live concert documentation for Boudchart's headline show at L'Olympia, Montréal. Multi-camera production capturing the raw energy of a sold-out night — every flash of stage light, every roaring crowd moment, locked in frame. Shot and edited for maximum impact across both long-form concert cuts and short-form social content.",
    cover: "/images/projects/boudchart-cover.jpg",
    gradient: "linear-gradient(135deg, #0a0a2a 0%, #1a1050 40%, #3a1580 100%)",
    accent: "#6b35d4",
    services: ["Live Event Coverage", "Multi-Camera Production", "Concert Photography", "Video Editing", "Color Grading", "Social Media Content"],
    client: "Boudchart",
    featured: true,
    crew: [
      { role: "Direction · Cinematography · Editing · Color", name: "Achraf Chibane" },
      { role: "Multi-Cam Production", name: "KLIPVISUAL" },
      { role: "Artist", name: "Boudchart" },
      { role: "Venue", name: "L'Olympia, Montréal" },
    ],
    gallery: [],
    concertLayout: true,
    reels: [
      { title: "BTS Reel" },
      { title: "Concert Edit" },
    ],
    extendedCredits: [
      {
        label: "Event",
        names: ["Boudchart — Live at L'Olympia", "Sold-Out Headline Show", "Montréal, 2024"],
      },
      {
        label: "Coverage",
        names: ["Multi-Camera Photo & Video", "12-Frame Editorial Gallery", "2 Concert Video Edits"],
      },
      {
        label: "Deliverables",
        names: ["Concert Photography Series", "Live Performance Reels", "Social Media Content"],
      },
    ],
  },
  {
    slug: "terry-osias",
    title: "Terry Osias: Champion's Story",
    shortTitle: "Terry Osias",
    category: "Content Creation + Sports",
    year: "2023",
    description:
      "Three cinematic videos and a full photo session for Terry Osias, one of Canada's most recognized boxing champions. The project captured his personal brand ahead of his final match, documenting the raw intensity and discipline behind a champion's story. A fourth production covered the launch of his boxing studio, turning a new business into a visual brand statement that drove real bookings from day one.",
    cover: "/images/projects/TerryBox-covcer.jpg",
    gradient: "linear-gradient(135deg, #0f0505 0%, #1f0808 40%, #3f1010 100%)",
    accent: "#c82020",
    results: ["300K+ combined reach", "Studio fully booked at launch", "4 deliverables in 1 week"],
    services: ["Content Creation", "Video Production", "Photo Shoot", "Editing", "Color Grading", "Short-Form Social Content"],
    featured: false,
    crew: [
      { role: "Direction · Editing · Color · Creative Direction", name: "KLIPVISUAL" },
      { role: "Athlete", name: "Terry Osias" },
    ],
    gallery: [],
    reels: [
      { title: "Training Camp" },
      { title: "Before The Fight" },
    ],
  },
  {
    slug: "jidar-toiles-de-rue",
    title: "JIDAR: Toiles de Rue",
    shortTitle: "JIDAR",
    category: "Documentary Film",
    year: "2019",
    description:
      "JIDAR Toiles de Rue is a 13-minute documentary exploring mural art in Morocco through the Sbagha Bagha festival and the JIDAR organization. The documentary captures how large-scale murals transform public spaces and connect local communities with international street artists.",
    cover: "/images/projects/Jidar-cover.jpg",
    gradient: "linear-gradient(135deg, #1a0f05 0%, #3a2010 40%, #6b3e10 100%)",
    accent: "#c87820",
    services: ["Cinematography", "Camera Operation", "Direction of Photography"],
    client: "ISMAC",
    featured: true,
    crew: [
      { role: "Director of Photography", name: "Achraf Chibane" },
      { role: "Director", name: "Sophia Boulaamane" },
      { role: "Production", name: "Imane El Khattab · Yasmine Chaker" },
      { role: "Sound", name: "Mohammed Aymen Benkabbour" },
      { role: "Client", name: "ISMAC" },
    ],
    gallery: [],
    galleryLandscape: true,
  },
  {
    slug: "simo-x-nesrine",
    title: "Simo × Nesrine Wedding Shoot",
    shortTitle: "Simo × Nesrine",
    category: "Wedding Photography",
    year: "2024",
    description:
      "This wedding project captures the genuine connection between Simo and Nesrine through natural moments and intimate details. The focus was on documenting authentic emotion, subtle gestures, and the atmosphere of the day. By combining candid interactions with composed portraits, I always preserve a cinematic look through controlled lighting, thoughtful composition, and refined color grading. The series reflects both the elegance and warmth of their celebration while maintaining a strong visual identity.",
    cover: "/images/projects/SimoNesrine-cover.jpg",
    gradient: "linear-gradient(135deg, #1a1408 0%, #3a2e10 40%, #7a6020 100%)",
    accent: "#c8a040",
    services: ["Wedding Photography", "Color Grading", "Photo Retouching", "Creative Direction"],
    featured: false,
    crew: [
      { role: "Photography · Color Grade", name: "Achraf Chibane" },
      { role: "Creative Direction · Production · Retouching", name: "KLIPVISUAL" },
      { role: "Couple", name: "Simo & Nesrine" },
    ],
    gallery: [],
    editorialLayout: true,
  },
  {
    slug: "coma",
    title: "COMA: Short Fiction Film",
    shortTitle: "COMA",
    category: "Short Film + Fiction",
    year: "2020",
    description:
      "COMA is a 6-minute psychological short film exploring the fragile space between consciousness and reality. Set within a confined medical environment, the story unfolds through tension, silence, and subtle visual cues rather than heavy dialogue. The film relies on atmosphere, pacing, and controlled cinematography to immerse the viewer in a suspended state between life and uncertainty.",
    cover: "/images/projects/Coma_Cover.jpg",
    gradient: "linear-gradient(135deg, #050a0f 0%, #0a1520 40%, #0f2535 100%)",
    accent: "#2a7a9a",
    services: ["Co-Direction", "Cinematography", "Editing", "Color Grading", "Subtitles"],
    client: "ISMAC",
    featured: false,
    crew: [
      { role: "Co-Direction · DOP · Editing · Color", name: "Achraf Chibane" },
      { role: "Co-Directors", name: "Sirajeddine Abdessamad & Hadil Jamali" },
      { role: "Sound & Mixing", name: "Zakaria Zernine" },
      { role: "Hair & Makeup", name: "Asmae Hamouch" },
      { role: "Production", name: "Dép'Art / ISMAC" },
    ],
    gallery: [],
    galleryLandscape: true,
    hasPoster: true,
    extendedCredits: [
      {
        label: "Cast",
        names: ["Soufian Naim", "Hind Belaoula", "Laila Majdoubi", "Hafça El Khal", "Zakaria El Bouanani", "Salsabil Abaida"],
      },
      {
        label: "Screenplay",
        names: ["Sirajeddine Abdessamad", "Imane El Khattab", "Ali Solh", "Achraf Chibane", "Chaimae Houri", "Manal Daoudi", "Youssef Hachimi"],
      },
      {
        label: "Sound",
        names: ["Zakaria Zernine", "Manal Daoudi"],
      },
      {
        label: "Production Coordinators",
        names: ["Imane El Khattab", "Ali Solh"],
      },
      {
        label: "Technical Coordination",
        names: ["Hassan Benabbou"],
      },
      {
        label: "Subtitles",
        names: ["Achraf Chibane"],
      },
    ],
  },
  {
    slug: "lebalcon-events",
    title: "Le Balcon: Events & Shows Coverage",
    shortTitle: "Le Balcon",
    category: "Event Coverage + Live Production",
    year: "2026",
    description:
      "Le Balcon is one of Montréal's most active live entertainment venues, a stage running back to back across the season with themed nights, tribute shows, jazz sets, and late-night concerts. KLIPVISUAL served as the official Visual Partner and Content Creator, covering over 15 events in 2026 across four distinct categories: Themed Nights, Live & Stage, Jazz & Soul, and Atmosphere. Every show was documented through photo and video, paired with designed event posters and flyers, each piece of content built to capture the energy of the moment, reflect the identity of each performance, and drive real ticket sales across Instagram, Facebook, and TikTok.",
    cover: "/images/projects/lebalcon-cover.jpg",
    gradient: "linear-gradient(135deg, #0f0008 0%, #2a0018 40%, #4a0030 100%)",
    accent: "#c4006a",
    results: ["15+ events covered", "Sold-out shows driven by content", "Content delivered across Instagram, Facebook & TikTok"],
    services: ["Event Photography", "Live Video Coverage", "Social Media Content", "Video Editing", "Color Grading", "Creative Direction"],
    client: "Le Balcon",
    featured: true,
    crew: [
      { role: "Photography · Video · Editing · Color", name: "Achraf Chibane" },
      { role: "Content Creation · Social Media", name: "KLIPVISUAL" },
      { role: "Client", name: "Le Balcon" },
    ],
    gallery: [],
    hasPosters: true,
    themes: [
      {
        name: "Themed Nights",
        cover: "/images/projects/lebalcon-cover.jpg",
        images: [],
        aspectRatio: "4/5",
      },
      {
        name: "Live & Stage",
        cover: "/images/projects/lebalcon-cover.jpg",
        images: [],
        aspectRatio: "4/5",
      },
      {
        name: "Jazz & Soul",
        cover: "/images/projects/lebalcon-cover.jpg",
        images: [],
        aspectRatio: "4/5",
      },
      {
        name: "Atmosphere",
        cover: "/images/projects/lebalcon-cover.jpg",
        images: [],
        aspectRatio: "4/5",
      },
    ],
    reels: [
      { title: "Show Teaser 01" },
      { title: "Show Teaser 02" },
      { title: "Show Teaser 03" },
    ],
  },
  {
    slug: "culinary-photography",
    title: "Culinary Photography: Menu & Brand",
    shortTitle: "Culinary Photo",
    category: "Food Photography + Art Direction",
    year: "2023",
    description:
      "A full-scope culinary photography project covering menu items and brand imagery for two established Québec food businesses: La Famille Québec Alimentation and Le Balcon × Terrasse. Each shoot was designed from scratch with controlled studio lighting setups, food styling direction, and compositional frameworks tailored to each brand's visual identity. The result is a cohesive image library that translates physical products into commercially effective visuals, built for menus, digital campaigns, social content, and in-store signage. As Marketing and Creative Director at La Famille Québec Alimentation, I translated culinary products into visual experiences through controlled lighting, styling, and composition. My work emphasizes detail, mood, and authenticity to create images that are both visually striking and commercially effective.",
    cover: "/images/projects/food-cover.jpg",
    gradient: "linear-gradient(135deg, #1a0f05 0%, #3a2010 40%, #7a4515 100%)",
    accent: "#c87820",
    results: ["2 full menu campaigns delivered", "Multi-platform image library", "Consistent visual identity across both brands"],
    services: ["Food Photography", "Studio Lighting Design", "Food Styling Direction", "Art Direction", "Color Grading", "Creative Direction"],
    client: "La Famille QA · Le Balcon",
    featured: false,
    crew: [
      { role: "Photography · Art Direction · Color", name: "Achraf Chibane" },
      { role: "Full Production", name: "KLIPVISUAL" },
      { role: "Clients", name: "La Famille QA · Le Balcon" },
    ],
    gallery: [],
    albums: [
      {
        label: "La Famille Québec Alimentation",
        description: "A complete menu photography series covering the full product lineup: sandwiches, burgers, salmon, and premium cuts. Shot in a clean studio environment with controlled lighting for visual consistency across all platforms.",
        images: [],
      },
      {
        label: "Le Balcon × Terrasse",
        description: "Premium restaurant menu photography for Le Balcon × Terrasse. Elevated food styling and atmospheric lighting designed to reflect the restaurant's upscale positioning and seasonal menu offerings.",
        images: [],
      },
      {
        label: "Le Balcon · Cocktails & Drinks",
        description: "Cocktail and drink photography for Le Balcon. Each glass staged to reflect the venue's nightlife identity, shot in portrait format for social-first content and bar menu visuals.",
        images: [],
        aspectRatio: "4/5",
        columns: 4,
      },
    ],
    recipeReels: [
      { title: "Recipe 01" },
      { title: "Recipe 02" },
      { title: "Recipe 03" },
    ],
  },
  {
    slug: "portrait-photography",
    title: "Portrait Photography: People & Identity",
    shortTitle: "Portrait",
    category: "Portrait Photography",
    year: "2024",
    description:
      "A portrait series built around the belief that every subject carries a story worth preserving. Shot across Montreal with natural and controlled lighting, this collection spans individuals, couples, professionals, and creatives, each session crafted to capture presence, character, and the quiet details that define a person. The work balances technical precision with an intuitive, documentary-style approach, creating portraits that feel both intentional and alive.",
    cover: "/images/projects/lebalcon-cover.jpg",
    gradient: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #2d2d4a 100%)",
    accent: "#6c6cff",
    results: ["7 portrait series delivered", "Multi-format image library", "Diverse range of subjects and settings"],
    services: ["Portrait Photography", "Art Direction", "Natural Light", "Studio Lighting", "Retouching", "Color Grading"],
    client: "Various",
    featured: true,
    crew: [
      { role: "Photography · Art Direction · Retouching", name: "Achraf Chibane" },
      { role: "Full Production", name: "KLIPVISUAL" },
    ],
    gallery: [],
    themes: [
      { name: "Sofia × Ilinca", cover: "/images/projects/ilinca-sofia-cover.jpg", images: [], aspectRatio: "16/9" },
      { name: "Ahlam", cover: "/images/projects/lebalcon-cover.jpg", images: [] },
      { name: "Claude", cover: "/images/projects/lebalcon-cover.jpg", images: [] },
      { name: "Mailys", cover: "/images/projects/lebalcon-cover.jpg", images: [] },
    ],
    reels: [
      { title: "Portrait Reel 01" },
    ],
    themeSectionLabel: "Browse by Series",
    reelSectionLabel: "Portrait Reels",
    noGallery: true,
  },
  {
    slug: "branding-design",
    title: "Branding & Design: Brand Identity Portfolio",
    shortTitle: "Branding",
    category: "Brand Identity + Graphic Design",
    year: "2024",
    description:
      "A collection of brand identity projects built from strategic research through to complete and deployable brand systems. Each project covers logo design, typography, moodboards, mockups, and full visual identity — crafted to hold up across every application and platform.",
    cover: "/images/projects/lebalcon-cover.jpg",
    gradient: "linear-gradient(135deg, #0a0800 0%, #1a1400 40%, #2a2200 100%)",
    accent: "#c8a820",
    results: ["2 full brand identities delivered", "Logofolio of 6 original marks", "Final graduation projects"],
    services: ["Brand Identity", "Logo Design", "Typography Systems", "Moodboard Design", "Mockups", "Art Direction"],
    client: "Various",
    featured: true,
    crew: [
      { role: "Brand Strategy · Visual Identity · Art Direction", name: "Achraf Chibane" },
      { role: "Full Production", name: "KLIPVISUAL" },
    ],
    gallery: [],
    noGallery: true,
    brandingLayout: true,
    brandProjects: [
      {
        name: "OHM (HAMME)",
        subtitle: "Product Launch: HAMME Men's Shampoo",
        industry: "Men's Grooming / Skincare",
        description:
          "OHM is a fictitious men's shampoo brand inspired by Moroccan argan oil and natural care. The project focuses on creating a strong and cohesive visual identity for a product launch, combining bold typography, organic elements, and a premium aesthetic.",
        scopeOfWork: [
          "Target audience analysis (persona)",
          "Visual research & inspiration",
          "Typography selection",
          "Image research (royalty-free assets)",
          "Moodboard creation (keywords, photography, illustrations, textures, colors)",
          "Fragrance concept & label sketch design",
        ],
        note: "Final Graduation Project — Graphic Design & Photography",
        images: [],
      },
      {
        name: "Jack Black Studio",
        subtitle: "JB STUDIO",
        industry: "Tattoo Studio / Men's Lifestyle",
        description:
          "Jack Black Studio is a fictitious tattoo studio brand built around a bold, modern, minimal identity. The visual concept focuses on a strong JB monogram merged with a tattoo machine silhouette, creating an iconic mark that feels premium, sharp, and unmistakably tattoo-culture.",
        scopeOfWork: [
          "Brand positioning & target audience definition",
          "Visual research / references",
          "Logo redesign (monogram + symbol integration)",
          "Typography system selection",
          "Brand moodboard (materials, textures, lighting, style)",
          "Mockups (print, signage, interior, digital)",
        ],
        note: "Final Graduation Project — Graphic Design & Photography",
        images: [],
      },
    ],
    logofolio: [],
  },
  {
    slug: "pitch-decks",
    title: "Pitch Decks: Strategy & Brand Presentations",
    shortTitle: "Pitch Decks",
    category: "Brand Strategy + Design",
    year: "2024",
    description:
      "A collection of pitch decks built to communicate ideas with clarity and visual impact. Each deck is crafted from the ground up: brand positioning, narrative structure, slide architecture, and visual identity. Whether presenting to investors, partners, or clients, the goal is the same — make the idea impossible to ignore. From concept to final export, every slide earns its place.",
    cover: "/images/projects/lebalcon-cover.jpg",
    gradient: "linear-gradient(135deg, #0a0a14 0%, #12121f 50%, #1a1a2e 100%)",
    accent: "#4f46e5",
    results: ["4 pitch decks delivered", "Multi-sector client range", "Investor-ready visual presentations"],
    services: ["Brand Strategy", "Presentation Design", "Art Direction", "Visual Storytelling", "Investor Decks", "Narrative Structure"],
    client: "Various",
    featured: true,
    crew: [
      { role: "Strategy · Design · Art Direction", name: "Achraf Chibane" },
      { role: "Full Production", name: "KLIPVISUAL" },
    ],
    gallery: [],
    pitchDecks: [
      { name: "Deck 01", slides: [] },
      { name: "Deck 02", slides: [] },
      { name: "Deck 03", slides: [] },
    ],
  },
]

/* ── Media overlay (written by /admin) ─────────────────────────── */
type ThemeMedia = { cover?: string | null; images?: string[] }
type ImagePos = { x: number; y: number; scale?: number; panX?: number; panY?: number }
type MediaEntry = {
  cover?: string
  poster?: string
  posters?: string[]
  gallery?: string[]
  albums?: string[][]
  themes?: ThemeMedia[]
  reels?: Array<{ videoId?: string; cover?: string }>
  recipeReels?: Array<{ videoId?: string; cover?: string }>
  videoCovers?: string[]
  videoIds?: string[]
  pitchDecks?: Array<{ cover?: string; client?: string; industry?: string; year?: string; slides?: string[] }>
  brandProjects?: Array<{ images?: string[] }>
  logofolio?: string[]
  videoUrl?: string
  creditsCover?: string
  workCover?: string
  stills?: string[]
  resultsBg?: string
  results?: Array<{ stat: string; label: string }>
  imagePositions?: Record<string, ImagePos>
}
const _media = mediaJson as Record<string, MediaEntry>

export const projects: Project[] = _raw.map((p) => {
  const m = _media[p.slug] ?? {}
  return {
    ...p,
    cover: m.cover ?? p.cover,
    poster: m.poster ?? p.poster,
    posters: m.posters ?? p.posters,
    gallery: m.gallery ?? p.gallery,
    albums: p.albums?.map((a, i) => ({
      ...a,
      images: m.albums?.[i] ?? a.images,
    })),
    themes: p.themes?.map((t, i) => ({
      ...t,
      cover: m.themes?.[i]?.cover ?? t.cover,
      images: m.themes?.[i]?.images ?? t.images,
    })),
    reels: p.reels?.map((r, i) => ({
      ...r,
      videoId: m.reels?.[i]?.videoId ?? r.videoId,
      cover: m.reels?.[i]?.cover ?? r.cover,
    })),
    recipeReels: p.recipeReels?.map((r, i) => ({
      ...r,
      videoId: m.recipeReels?.[i]?.videoId ?? r.videoId,
      cover: m.recipeReels?.[i]?.cover ?? r.cover,
    })),
    videos: p.videos?.map((v, i) => ({
      ...v,
      cover: m.videoCovers?.[i] || v.cover,
      videoId: m.videoIds?.[i] ?? v.videoId,
    })),
    videoUrl: m.videoUrl ?? p.videoUrl,
    creditsCover: m.creditsCover ?? p.creditsCover,
    workCover: m.workCover ?? p.workCover,
    stills: m.stills ?? p.stills,
    resultsBg: m.resultsBg,
    resultsData: m.results,
    imagePositions: m.imagePositions,
    pitchDecks: p.pitchDecks?.map((d, i) => ({
      ...d,
      cover: m.pitchDecks?.[i]?.cover ?? d.slides?.[0],
      client: m.pitchDecks?.[i]?.client ?? d.client,
      industry: m.pitchDecks?.[i]?.industry ?? d.industry,
      year: m.pitchDecks?.[i]?.year ?? d.year,
      slides: m.pitchDecks?.[i]?.slides ?? d.slides,
    })),
    brandProjects: p.brandProjects?.map((bp, i) => ({
      ...bp,
      images: m.brandProjects?.[i]?.images ?? bp.images,
    })),
    logofolio: m.logofolio ?? p.logofolio,
  }
})

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export const featuredProjects = projects.filter((p) => p.featured)
