# InnoCooks — Frontend v2 · "Industrial Kinetic"

The second, independent version of the InnoCooks site, built from the Stitch
design you loved (`stitch_innocooks_studio_site_fresh/`). The original lives in
`../frontend` and is untouched — pick the winner at the end.

## The look
Deep-onyx void · stark-white oversized **Bricolage Grotesque** headlines ·
a single **kinetic-orange (#c45b35)** signal · **JetBrains Mono** technical
labels · **Hanken Grotesk** body · zero radius · hairline structural seams.
Swiss precision meets digital brutalism.

## What's here (and improved over the raw Stitch export)
- Real, full InnoCooks copy restored (the export had paraphrased it).
- **Studio / team section restored** — the export dropped it entirely.
- Hero kinetic background: a raw-WebGL ember shader + a Three.js wireframe
  sculpture (dynamically imported, reduced-motion & low-power safe).
- Horizontal drag-to-explore **ARCHIVE** with drawn brutalist mocks (no fragile
  external images).
- Contact page + mailto form, and the Christalin Mirrors case study.
- Instrument-panel `Frame`: scroll-progress rail, corner ticks, edge labels.
- Boot-sequence preloader, Lenis smooth scroll, GSAP scroll reveals, magnetic CTAs.

## Tech
Next.js 16 (App Router, static `output: export`) · React 19 · Tailwind v4 ·
GSAP + ScrollTrigger · Lenis · Three.js. Same toolchain as `../frontend`.

## Run
```bash
npm install      # already done
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

## Structure
```
app/            layout, globals.css, page, contact/, work/christalin-mirrors/
components/     Nav, Footer, Frame, Preloader, SmoothScroll, Reveal, Magnetic, HeroCanvas
components/sections/  Hero, Manifesto, Marquee, Work, Process, Studio, FinalCTA
lib/gsap.ts
```
