# KLIPVISUAL — Website Project Brief
*Complete build document for Claude Code / Cursor*
*Generated: 2026-05-20*

---

> ⚠️ **STATUS: PARTIALLY SUPERSEDED (updated 2026-06-05).** This was the original planning brief. Several details below are now stale. Current truth:
> - **Domain:** `klipvisual.com` (not `.ca`) · **Email:** `hello@klipvisual.com` (not `contact@`)
> - **Fonts:** Barlow Condensed (display) · DM Sans (body) · Space Mono (mono) — NOT Bebas Neue/Syne
> - **Stack:** Next.js 16 App Router · Tailwind v4 · Framer Motion · deployed on Vercel · bilingual EN/FR (`app/i18n/`)
> - **Real projects + pricing:** live source of truth is [app/data/projects.ts](app/data/projects.ts) and [app/services/page.tsx](app/services/page.tsx), not the lists below.
> - **Brand/content direction for social + marketing:** see `brand/` folder (being built).
> Keep this file for build history; do not treat the specifics below as current.

---

## 1. PROJECT OVERVIEW

**Brand:** KLIPVISUAL
**Tagline:** Creative Content Production
**Credit:** by Achraf Chibane
**Domain:** klipvisual.ca
**Inspiration:** siena.film
**Goal:** A cinematic, immersive portfolio website that converts visitors into paying clients

---

## 2. DESIGN LANGUAGE

### Colors
- Background: `#0a0a0a` (near black)
- Primary text: `#f0ede8` (off-white/bone)
- Accent: `#E8181C` (KLIP red — exact brand red)
- Secondary text: `#555555` (muted gray)
- Borders/dividers: `#1a1a1a`
- Grain texture overlay: always present at 15-25% opacity

### Typography
- **Display/Logo:** Bebas Neue (Google Fonts) — all caps, compressed
- **Headings:** Syne 700 or Barlow Condensed 700
- **Body:** DM Sans 300/400
- **Metadata/Labels:** Space Mono 400 — for project numbers, dates, categories
- **All nav items:** uppercase, tight letter-spacing 0.15em+

### Aesthetic Rules
- Dark background ALWAYS — no light mode
- Film grain texture overlay on every section (CSS or SVG filter)
- Red used ONLY for: logo, CTAs, hover states, active elements
- No gradients — flat dark surfaces only
- Images: high contrast, cinematic, full-bleed
- Cursor: custom red dot cursor
- Page transitions: smooth fade or cinematic wipe

---

## 3. SITE ARCHITECTURE

### Pages
1. **Home** — immersive hero + horizontal scroll projects
2. **Work** — full project grid
3. **Project Detail** — individual case study page (template)
4. **Services** — pricing and packages
5. **About** — Achraf's story + gear + philosophy
6. **Contact** — booking form

### Navigation
- Fixed top nav: KLIPVISUAL logo left, menu items right
- Menu items: WORK · SERVICES · ABOUT · CONTACT
- Mobile: hamburger → full screen overlay menu

---

## 4. PAGE-BY-PAGE SPECIFICATIONS

---

### PAGE 1: HOME

**Section A — Intro/Loading Screen**
- Full screen black with KLIPVISUAL logo (red) centered
- Logo animates in (fade + slight scale)
- "PRESS PLAY" or "ENTER" button below
- Background: subtle film grain texture
- Duration: 1.5s then auto-enters or click to enter

**Section B — Hero**
- Full viewport height
- Background: looping showreel video (muted, autoplay) OR full-bleed cinematic still image
- Overlay: dark vignette + grain
- Center text: Large "KLIPVISUAL" in Bebas Neue
- Below: "CREATIVE CONTENT PRODUCTION" in Space Mono small caps
- Bottom left: "EST. 2026 · MONTREAL, CA"
- Bottom right: scroll indicator "↓ SCROLL"
- Red custom cursor active

**Section C — Featured Projects (Horizontal Scroll — like siena.film)**
- Horizontal scrolling carousel of 6-8 project cards
- Each card: full-height, ~60vw wide
- Card structure:
  - Full bleed project image/video
  - Bottom overlay: Project name (Syne bold), Category (Space Mono), Year
  - Hover: slight zoom on image + red underline on name
  - Click: goes to project detail page
- Left side: fixed vertical label "SELECTED WORK" rotated 90°
- Navigation: scroll horizontally with mouse wheel OR drag
- Project numbers: 01, 02, 03... displayed top right of each card

**Section D — Stats/Social Proof**
- 3-4 numbers displayed large:
  - "750K+" · Organic Reach Generated
  - "1.2M" · Impressions Delivered
  - "7+" · Years of Experience
  - "50+" · Projects Completed
- Dark section, numbers in Bebas Neue huge, labels in Space Mono small

**Section E — Services Teaser**
- 4 service categories displayed as large text rows
- Each row: SERVICE NAME left, short descriptor right
- Hover: row highlights in red
- Click: goes to services page
- Services: VIDEO PRODUCTION / PHOTOGRAPHY / DESIGN & BRANDING / EVENT COVERAGE

**Section F — CTA / Contact Teaser**
- Full width dark section
- Large text: "LET'S CREATE SOMETHING."
- Subtext: "Book a project or get a quote"
- Red button: "GET IN TOUCH →"
- Background: cinematic BW photo with dark overlay

**Section G — Footer**
- Logo top left
- Links: WORK · SERVICES · ABOUT · CONTACT
- Social: Instagram · TikTok · LinkedIn (icons)
- Bottom: "© 2026 KLIPVISUAL · BY ACHRAF CHIBANE · ALL RIGHTS RESERVED"
- Right: "MONTREAL, CA"

---

### PAGE 2: WORK

**Layout:**
- Grid of projects: 2 columns desktop, 1 column mobile
- Each card: image, project name, category, year
- Filter bar at top: ALL · VIDEO · PHOTO · DESIGN · EVENTS
- Hover: image darkens, red "VIEW PROJECT →" appears
- Clicking: goes to project detail

**Projects to feature (8 total):**
1. La Famille Québec Alimentation — Social Media / Food Photography
2. Boudchart at L'Olympia — Event Coverage / Live Production
3. TikTok Canada — Influencer Content / Video Production
4. Coach Racicot — Social Media / Video Series
5. Ilinca x Sofia — Portrait Photography / Creative Direction
6. Simo x Nesrine Wedding — Wedding Photography / Videography
7. iamstevedaniel / Troy Bond — Content Creation / Video
8. Romeo & Fils / Télé-Québec — Video Production / TV

---

### PAGE 3: PROJECT DETAIL (Template — replicated for each project)

**Structure:**
- Full bleed hero image/video (100vh)
- Project title large (Bebas Neue)
- Metadata row: CLIENT · CATEGORY · YEAR · DELIVERABLES
- Project description (2-3 paragraphs)
- Key results/stats (if applicable — e.g. "+43% growth", "750K reach")
- Gallery: masonry or horizontal scroll of images/videos
- "NEXT PROJECT →" at bottom

---

### PAGE 4: SERVICES

**Hero:**
- Page title: "SERVICES" in huge Bebas Neue
- Subtitle: "What we do · How we work · What it costs"

**Service Sections (one per service):**

**01 — VIDEO PRODUCTION**
- Brand / Promotional Video: starting at $2,000
- Social Media Content Day (batch shoot): $1,200 half-day / $2,000 full-day
- Corporate / Interview Video: starting at $1,800
- Music Video / Creative Short: starting at $3,000
- Video Editing Only: $150–$1,500

**02 — PHOTOGRAPHY**
- Food & Product Photography: $700 half-day / $1,400 full-day
- Event Coverage: $800 half-day / $1,500 full-day
- Portrait & Headshots: $400 (1h) / $700 (2h)
- Real Estate / Interior: $500–$900

**03 — DESIGN & BRANDING**
- Logo Design: starting at $500
- Brand Identity Package: starting at $2,000
- Pitch Deck Design: starting at $800
- Social Media Templates: starting at $400

**04 — BUNDLES**
- The Launch Package: $4,500
- The Content Batch: $3,000
- The Event Package: $3,000

**How It Works Section:**
- 3 steps: 01 BRIEF → 02 PRODUCE → 03 DELIVER
- Simple, clean, reassuring

**CTA:** "Ready to start? → GET A QUOTE"

---

### PAGE 5: ABOUT

**Hero:** Full bleed photo of Achraf with camera (from portfolio)

**Content Sections:**
- **Who I am:** Short punchy bio (3-4 sentences max)
  "Achraf Chibane is a Montreal-based visual content producer. Cinema-trained in Morocco, design-educated in Quebec, and street-tested across 7+ years of real projects. I shoot, edit, and deliver — no middleman, no compromise."
- **What I bring:** Skills/expertise list styled as large text rows
- **The Gear:** Equipment list (Sony a7IV, 24mm GM, Ronin RS4 Pro, etc.)
- **Clients & Collaborators:** Logo strip or text list (TikTok Canada, L'Olympia, Télé-Québec, etc.)
- **The Numbers:** Same stats as homepage

---

### PAGE 6: CONTACT

**Layout:** Split screen
- Left: Large "LET'S TALK." text + contact info
- Right: Contact form

**Form Fields:**
- Name *
- Email *
- Company/Brand (optional)
- Service needed (dropdown): Video Production / Photography / Design / Event Coverage / Bundle / Other
- Project description (textarea)
- Budget range (dropdown): Under $1,000 / $1,000-$2,500 / $2,500-$5,000 / $5,000+
- How did you find us? (optional)
- Submit button: "SEND IT →" in red

**Below form:**
- Email: contact@klipvisual.ca
- Instagram: @klipvisual
- Response time: "We respond within 24h"

---

## 5. KEY INTERACTIONS (siena.film style)

1. **Custom cursor** — small red dot, grows on hover over clickable elements
2. **Horizontal scroll** on home projects section — mouse wheel scrolls horizontally
3. **Page load animation** — logo reveal on first visit
4. **Smooth page transitions** — fade between pages
5. **Hover on project cards** — image zoom + metadata reveal
6. **Parallax on hero** — subtle depth on scroll
7. **Grain overlay** — CSS film grain on all sections
8. **Number counter animation** — stats count up when scrolled into view
9. **Magnetic buttons** — CTA buttons slightly attract cursor on hover
10. **Mobile** — all horizontal scrolls convert to vertical swipe

---

## 6. TECH STACK

**Recommended for Claude Code:**
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + custom CSS for animations
- **Animations:** Framer Motion (page transitions, scroll animations, counter)
- **Horizontal scroll:** Custom JS or GSAP ScrollTrigger
- **Grain effect:** CSS noise filter or SVG feTurbulence
- **Custom cursor:** Vanilla JS
- **Contact form:** React Hook Form + Resend (email delivery) or Formspree
- **Fonts:** Google Fonts (Bebas Neue, Syne, DM Sans, Space Mono)
- **Images:** next/image with optimization
- **Video:** HTML5 video with lazy loading
- **Hosting:** Vercel (free tier, perfect for Next.js)
- **Domain:** klipvisual.ca → point to Vercel

---

## 7. FILE STRUCTURE

```
klipvisual/
├── app/
│   ├── layout.tsx          (root layout, fonts, cursor, grain)
│   ├── page.tsx            (home)
│   ├── work/
│   │   └── page.tsx        (work grid)
│   ├── work/[slug]/
│   │   └── page.tsx        (project detail template)
│   ├── services/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CustomCursor.tsx
│   ├── GrainOverlay.tsx
│   ├── HorizontalScroll.tsx
│   ├── ProjectCard.tsx
│   ├── PageTransition.tsx
│   ├── StatCounter.tsx
│   └── ContactForm.tsx
├── data/
│   └── projects.ts         (all project data — images, descriptions, stats)
├── public/
│   ├── images/             (all project images)
│   ├── videos/             (showreel, project videos)
│   └── logo/               (KLIPVISUAL logo files)
├── styles/
│   └── globals.css         (grain, cursor, custom animations)
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 8. PROJECTS DATA STRUCTURE

```typescript
// data/projects.ts
export const projects = [
  {
    id: "01",
    slug: "la-famille-quebec",
    title: "La Famille Québec Alimentation",
    category: "Social Media · Food Photography",
    year: "2023",
    client: "La Famille Québec Alimentation",
    coverImage: "/images/lfqa-cover.jpg",
    images: ["/images/lfqa-1.jpg", "/images/lfqa-2.jpg"],
    description: "Full social media content production...",
    results: [
      { value: "+43%", label: "Organic Growth" },
      { value: "750K+", label: "Reach Generated" },
      { value: "+106%", label: "Engagement Rate" },
    ],
    tags: ["video", "photo"],
  },
  // ... repeat for each project
]
```

---

## 9. STEP-BY-STEP BUILD GUIDE

### STEP 1 — Setup (15 min)
```bash
npx create-next-app@latest klipvisual --typescript --tailwind --app
cd klipvisual
npm install framer-motion gsap @gsap/react react-hook-form
```

### STEP 2 — Global styles + fonts (30 min)
- Add Google Fonts to layout.tsx
- Set up CSS variables (colors, fonts)
- Add grain overlay CSS
- Add custom cursor JS

### STEP 3 — Components (2-3h)
Build in this order:
1. GrainOverlay
2. CustomCursor
3. Navbar
4. Footer
5. PageTransition
6. ProjectCard
7. HorizontalScroll
8. StatCounter
9. ContactForm

### STEP 4 — Pages (3-4h)
Build in this order:
1. Home (hero + horizontal scroll + stats + CTA)
2. Work (grid + filter)
3. Services (pricing sections)
4. About (bio + gear + clients)
5. Contact (form)
6. Project Detail template

### STEP 5 — Content (1-2h)
- Add all project images to /public/images
- Fill in projects.ts data file
- Write all copy

### STEP 6 — Deploy (30 min)
```bash
# Push to GitHub
git init && git add . && git commit -m "initial"
gh repo create klipvisual --public --push

# Deploy to Vercel
npx vercel --prod
# Connect klipvisual.ca domain in Vercel dashboard
```

---

## 10. CLAUDE CODE MASTER PROMPT

Use this as your first prompt in Claude Code / Cursor:

---

```
I am building a portfolio website for KLIPVISUAL, a creative content production brand by Achraf Chibane. The design inspiration is siena.film — immersive, cinematic, dark, horizontal scroll, custom cursor, film grain aesthetic.

TECH STACK: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, GSAP

BRAND:
- Name: KLIPVISUAL
- Tagline: Creative Content Production  
- Colors: Background #0a0a0a, Text #f0ede8, Red accent #E8181C, Muted #555555
- Fonts: Bebas Neue (display), Syne 700 (headings), DM Sans 300/400 (body), Space Mono (metadata)
- Aesthetic: Dark, cinematic, film grain texture, custom red cursor, no light mode

PAGES: Home, Work, Work/[slug], Services, About, Contact

START by:
1. Setting up the Next.js project with all dependencies
2. Creating globals.css with CSS variables, grain overlay, and custom cursor
3. Building the root layout.tsx with fonts and persistent components
4. Then building the Home page with: loading screen → hero with video background → horizontal scroll project cards → stats section → services teaser → CTA → footer

Make it look exactly like siena.film but with KLIPVISUAL's red/black/grain branding. Every interaction should feel cinematic and premium. No generic UI. No light backgrounds. No purple gradients. Only dark, raw, cinematic.
```

---

## 11. HOSTING SETUP

1. **Register domain:** klipvisual.ca on Namecheap or GoDaddy (~$15/year)
2. **Create Vercel account:** vercel.com (free)
3. **Connect GitHub repo to Vercel** — auto-deploys on every push
4. **Add custom domain** in Vercel dashboard → DNS settings
5. **Email:** Set up contact@klipvisual.ca via Zoho Mail (free) or Google Workspace ($6/mo)
6. **Form backend:** Formspree.io (free tier, 50 submissions/month) or Resend

---

## 12. CONTENT CHECKLIST

Before launching, you need:
- [ ] Logo files (PNG transparent, SVG) — light and dark versions
- [ ] 6-8 project cover images (high res, 16:9 or cinematic ratio)
- [ ] Gallery images per project (5-10 per project)
- [ ] Showreel video (60-90s, MP4, optimized for web)
- [ ] Photo of Achraf for About page
- [ ] Written descriptions for each project
- [ ] Final pricing confirmed
- [ ] Contact email set up
- [ ] Social media handles confirmed (@klipvisual)

