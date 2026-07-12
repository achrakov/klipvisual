# KLIPVISUAL SEO

What is built into the site, and what still has to happen outside it.

---

## Part 1: What the site now does

Before this work, the site was effectively invisible to Google. Every page was a
client component, so no page could declare a title or description; there was no
sitemap, no robots.txt, no structured data, and no French URLs at all (language
lived in `localStorage`, so `/work` was the only address that ever existed).

Now:

| Thing | Where |
|---|---|
| `/en` and `/fr` URLs, 38 indexable pages | `app/(site)/[lang]/` |
| Per-page bilingual titles and descriptions | `app/lib/seo.ts` |
| Canonical + hreflang mesh with `x-default` | `app/lib/seo.ts` (`alternates`) |
| `ProfessionalService`, `Person`, `WebSite`, `BreadcrumbList`, `CreativeWork` schema | `app/lib/schema.ts` |
| Sitemap with localized alternates | `app/sitemap.ts` |
| robots.txt | `app/robots.ts` |
| Locale redirect for old URLs (308) | `proxy.ts` |
| French case-study titles and descriptions | `app/data/projectsSeo.ts` |

The business is modelled as a **service area business**: `areaServed` covers
Montreal, Laval, Longueuil and Greater Quebec, and there is deliberately **no
street address** in the schema. Inventing an address to look more local is the
fastest way to get a Google Business Profile suspended.

---

## Part 2: The part that actually lands clients this month

Organic ranking is slow. A new site does not rank for "video production
Montreal" in three weeks, no matter how clean the markup is. The **local pack**
(the map results) is a different system, and it moves in weeks.

Weighting for local pack ranking, roughly:

- **Proximity to the searcher: ~55%** of ranking variance. Cannot be bought, only served.
- **Google Business Profile signals: ~32%.** Fully in your control.
- **Review signals: ~20%.** Fully in your control.

So the single highest-leverage action available to you is a complete, verified
Google Business Profile. Nothing on the website competes with it for speed.

### Google Business Profile setup

This one needs you: Google verifies identity (video or postcard), and I cannot
complete that step.

1. Create the profile at [business.google.com](https://business.google.com).
2. **Business type: service area business.** Do not publish your home address.
   Set the service area to Montreal, Laval, Longueuil, and the South Shore.
3. **Primary category: `Video Production Service`.** This is the one that matters
   most; it decides which searches you can appear in at all.
4. Secondary categories: `Photographer`, `Commercial Photographer`,
   `Graphic Designer`, `Videographer`.
5. Name it exactly `KLIPVISUAL`. Not "KLIPVISUAL Montreal Video Production".
   Keyword-stuffing the name is the most commonly reported and penalized
   violation in this category.
6. NAP must match the site character for character:
   - Name: `KLIPVISUAL`
   - Service area: Montreal, QC
   - Email: `hello@klipvisual.com`
   - Site: `https://klipvisual.com`
7. Set services from the same list the site advertises: video production,
   brand film, event coverage, food and product photography, portraits, brand
   identity, pitch decks.
8. Upload 20+ photos and at least 3 videos. Profiles with video get
   disproportionate engagement in this vertical, and you have the assets already.
9. Write the description in both French and English.

### Reviews

Reviews are ~20% of local pack weight and they are the thing you have that a new
competitor does not: real, named, recognizable Montreal clients.

Ask the ones who already got results. Le Balcon (15+ events), La Famille QA
(750K+ reach), Terry Osias (300K+ reach), L'Olympia. A review that names the
service and the city ("video production for our venue in Montreal") is worth
several generic five-star ratings.

Target: **10 reviews in the first month**, then a steady trickle. Velocity
matters more than the total.

### Citations

Consistent NAP across directories. Same name, same service area, same URL:

- Yelp Quebec, Yellow Pages / Pages Jaunes, Bing Places, Apple Business Connect
- Chambre de commerce du Montréal métropolitain
- Quebec production directories, wedding and event vendor listings

---

## Part 3: AI search (GEO)

Worth being precise here, because most advice on this is wrong. Google's own
position is that optimizing for AI Overviews **is** SEO. There is no separate
discipline. Specifically:

- `llms.txt` does nothing. Google has explicitly said it does not use it. Skipped
  on purpose.
- Structured data injected by JavaScript gets processed late or not at all, which
  is why the JSON-LD here is server-rendered.

What actually correlates with being cited by AI search: **brand mentions, not
backlinks.** In Ahrefs' 75,000-brand study, YouTube mentions correlated at ~0.74
with AI citations; domain rating correlated at ~0.27. Mentions on YouTube and
Reddit are worth more than link building.

Practical version for you: put the work on YouTube with real titles and
descriptions, and get named in Montreal venue/restaurant coverage.

---

## Part 4: Order of operations

1. **Deploy this branch.** Nothing else counts until the pages exist.
2. **Google Search Console:** add `klipvisual.com`, submit
   `https://klipvisual.com/sitemap.xml`, and request indexing on `/en` and `/fr`.
3. **Google Business Profile:** create, verify, complete. This is the fast money.
4. **Reviews:** ask 10 past clients this week.
5. **Citations:** the directory list above.
6. Then, and only then, worry about content and links.

---

## Open item: app.klipvisual.com

The dashboard is a **separate host**, so `klipvisual.com/robots.txt` does not
apply to it. It carries a `noindex` robots meta tag from `app/(admin)/layout.tsx`,
which is what actually keeps it out of the index.

That is an SEO control, not a security control. `noindex` stops Google from
listing the page; it does not stop anyone who has the URL from opening it. If
that dashboard shows business numbers, it needs authentication in front of it.
