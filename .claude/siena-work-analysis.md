# Siena.film /work — Technical Analysis

## Core Concept
NOT a scrollable grid. A **fixed-viewport (100svh) horizontal carousel** of portrait cards.  
Vertical scroll/drag moves cards horizontally with momentum physics. No page scroll at all.

## Layout
- Page: `height: 100svh; overflow: clip; background: black`
- Cards: horizontal flex row, centered vertically
- 3 cards visible at once — center card is active
- Card size: `width: 33vw; max-width: 26rem; aspect-ratio: 1/1.635` (portrait ~2:3)
- Gap between cards: ~1.2rem (gutter)

## Scroll Physics (custom JS, no library)
- `lerpFactor: 0.05` (desktop), `0.09` (mobile)
- `scrollSpeed: 0.001` (wheel multiplier)
- `dragSensitivity: 0.005`
- Velocity decays each frame: `vel *= friction`
- Position lerped: `current += (target - current) * lerp`
- **Blur on speed**: `filter: blur(Npx)` proportional to velocity — fast scroll = blurry cards

## Card Structure
```
.work-roll-item
  └── .work-roll-c [data-parallax="1"]  ← Y offset proportional to position
      └── .roll-cont-item.work
          ├── category eyebrow (P22 Parrish Roman, 0.6rem, letter-spacing 0.3em)
          ├── h2 title (Neue Brücke, 3rem, line-height 0.77em, width: 9ch)
          └── metadata list (year, location, category) — 2-col grid, 11px height rows
  └── image div [abs fill] — in their case WebGL texture, for us: regular <img>
```

## Card Visual Effects
- Image: `position: absolute; inset: 0; object-fit: cover`
- Gradient overlay: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)`
- **WebGL shader effects** (we approximate with CSS):
  - Lens barrel distortion — skip or use CSS `perspective`
  - Film grain noise — use our existing `.grain-overlay-frame`
  - Motion blur vertical — approximated by overall `filter: blur()` on scroll
- `border-radius: 6px` on each card
- Inactive cards: reduced opacity (~0.5) + slight scale down (0.93) + translateY(+16px)
- Active card: `opacity: 1; scale: 1; translateY: 0`
- Transition: `0.5s ease` on opacity + transform

## Parallax Within Cards
- `.work-roll-c [data-parallax="1"]`: `translateY(offset * position * 10%)` per frame
- Cards further from center have more Y shift (creates depth)

## UI Elements
- **Vertical center guide line**: `position: fixed; left: 50%; width: 1px; height: 100svh`
  - Subtle gradient: `transparent → rgba(white, 0.08) → transparent`
- **Bottom left**: "Scroll or drag to explore" — `font-mono; 0.6rem; opacity 0.25`
- **Bottom center**: Tick indicators — active tick wider (20px), inactive (3px), height 1px
- **Bottom right**: `01 / 07` counter
- **Top center**: Current project category label (fades between projects)

## No Filter System
Only a FOOTAGE / POSTER image toggle (not relevant for us).

## Typography (adapted to our fonts)
- Category eyebrow: `font-mono; 0.6rem; letter-spacing: 0.3em; uppercase; opacity 0.4`
- Title: `font-display font-bold; clamp(1.5rem, 3vw, 3rem); line-height: 0.85em; letter-spacing: -0.03em; width: 9ch`
- Words stacked: each word on its own line (`display: block` per word span)
- Year: `font-mono; 0.6rem; letter-spacing 0.3em; opacity 0.3`

## Design Tokens
```
--black: #000000 (bg)
--white: #faf7ef (text)
--gutter: 1.2rem
--rounded-xs: 6px
Card opacity inactive: 0.5
Card scale inactive: 0.93
```

## Implementation Approach for KLIPVISUAL
1. `height: 100svh; overflow: hidden` page container
2. Wheel + pointer events → velocity accumulator
3. RAF loop: `vel *= 0.86; x += vel; lerped += (x - lerped) * 0.075`
4. Blur: `filter: blur(clamp(speed * 0.06, 0, 8)px)` on track
5. Active index: `round(-lerped / (cardW + gap))`
6. Cards: flex row, centered via paddingLeft on track
7. Inactive cards dimmed + scaled down
8. Navbar floats above (z-index 8000, already fixed)
