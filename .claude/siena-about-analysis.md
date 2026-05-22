# Siena.film /about — Technical Analysis

## Core Layout (Top to Bottom)

1. **Three-panel hero** (100vh): left portrait image | manifesto text center | right portrait image
2. **Mission paragraph** — large bold uppercase, max-width ~900px
3. **Who We Are** — two founders: B&W photo + name + title + bio (2-col grid)
4. **Book section** — typographic reference (catalog/ISBN style)
5. **Services** — bold uppercase labels (FILM FINANCING, FILM PRODUCTION)
6. **Collaborators marquee** — A24 logo infinite horizontal scroll
7. **CTA "ADMIT ONE"** — ticket element with dark image background
8. **Newsletter** — email form
9. **Footer** — light bg, 3-col

## Hero Section Details

- Grid: `1fr 1.4fr 1fr` (images take ~28% each, center ~44%)
- Images: portrait ~2:3 aspect ratio, object-fit cover, sharp corners, no border-radius
- Images bleed to viewport edges
- Center text: ALL CAPS, huge grotesque sans (~60–120px fluid)
- "FILMPRODUCTIONHOUSE" — one intentional compound word (design choice)
- Category strip below: "TELEVISION / FILMS / DOCUMENTARY" — 12px mono uppercase

## Typography

| Element | Size | Weight | Case | Tracking |
|---|---|---|---|---|
| Hero headline | clamp(60px→120px) | Black/900 | UPPERCASE | Wide, -0.02em |
| Section label | 11–13px | Medium | UPPERCASE | 0.3–0.4em |
| Body copy | 15–18px | Regular | Sentence | Normal |
| Category strip | 12–14px | Medium | UPPERCASE | Wide |

Font: Clean grotesque (Neue Haas Grotesk / Helvetica Neue equivalent)

## Colors

- Background: white (#ffffff) — they're light-themed
- Text: #000000 / #111111
- No brand accent color — monochromatic
- Images carry all visual interest (cinematic film stills, B&W portraits)

## Animations (Webflow IX2)

- Hero images: clip-path reveal from bottom on page load (wipe-in)
- Text: fade + translateY on load, staggered
- Sections: whileInView fade up
- Marquee: CSS infinite scroll (A24 logos)
- No scroll-pinning or GSAP detected

## KLIPVISUAL Adaptation Notes

- Keep dark background (#0a0a0a) — don't go white
- Use project images as hero stills (savoy.webp left, moon.jpg right)
- Manifesto: "KLIPVISUAL IS A CREATIVE PRODUCTION STUDIO"
- Category strip: "VIDEO · PHOTO · BRAND · EVENTS"
- One founder (Achraf Chibane) not two
- Services marquee instead of just two labels
- Red (#E8181C) accent on key words
- clipPath wipe-in animation on hero images
- Parallax: left image moves up, right image moves down on scroll
