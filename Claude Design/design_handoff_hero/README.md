# Handoff: InnoCooks living hero (the Thread, made physical)

## Overview
This replaces the static hero wordmark + SVG noodle with a **living hero**: the
gold Thread becomes a real, physics-simulated strand of light that hangs under
its own weight, sways, and recoils from the cursor, set in an atmospheric dusk
of drifting light. It ships with **three directions** (`strand`, `dusk`,
`woven`) selectable by one prop — pick one for production.

It is built to match your existing studio site exactly: same tokens
(`--color-dusk`, `--color-gold`, `--color-cream`…), same Fraunces wordmark,
same GSAP intro, same `prefers-reduced-motion` discipline. **No new
dependencies** — it's plain `<canvas>` + your existing React/Next/GSAP stack.

## About the design files
- `reference/` contains the **standalone HTML prototype** the design was
  explored in (open `Innocooks Hero.html` in a browser to see/feel all three
  directions with a live switcher). These are **design references**, not the
  files to ship.
- `code/` contains the **actual production files**, already converted to your
  Next.js + TypeScript architecture. These ARE meant to be dropped into your
  repo (see *Install*).

## Fidelity
**High-fidelity.** Colors, type, motion, and behavior are final. The `code/`
files reproduce the prototype faithfully, adapted from a full-viewport page to
an embedded, scroll-friendly section (canvas sized to the hero `<section>`, all
pointer/letter coordinates converted to section-local space).

---

## Install (no new packages)

Copy these files into your repo, preserving paths:

| From (this bundle) | To (your repo) |
|---|---|
| `code/lib/thread.ts` | `frontend/lib/thread.ts` |
| `code/lib/atmosphere.ts` | `frontend/lib/atmosphere.ts` |
| `code/components/HeroCanvas.tsx` | `frontend/components/HeroCanvas.tsx` |
| `code/components/sections/Hero.tsx` | `frontend/components/sections/Hero.tsx` **(overwrites your current Hero)** |

Then make the **one** CSS change in `code/globals-additions.css` — replace your
`.hero-letter` color-transition + `:hover` rules (the canvas drives letter
color now).

Run:
```bash
npm run dev
```
Open the homepage. The hero should compose immediately and animate on cursor
move. That's it — `@/lib/*` and `@/components/*` already resolve via your
existing `tsconfig` path alias.

### Pick the direction
In `Hero.tsx`, line near the top:
```ts
const HERO_MODE: HeroMode = "strand"; // "strand" | "dusk" | "woven"
```
- **strand** — a single heavy filament of light hanging below the name, with a
  travelling bead. Calmest, most classic. *Recommended default.*
- **woven** — the Thread laces over/under the letters and warms each one to
  gold as it crosses. The signature, brand-forward option.
- **dusk** — atmosphere-led: the lantern of light follows the cursor, dust
  drifts, and the wordmark parallaxes in space. Most "deep".

(You can also keep exploring all three live in `reference/Innocooks Hero.html`.)

---

## What changed vs. your current Hero.tsx
- **Removed:** the `.hero-bg` SVG noodle-wave layer and the `.hero-thread` SVG
  + its draw-on settle animation (the canvas Thread supersedes both).
- **Removed:** the mousemove parallax on `.hero-bg` (HeroCanvas owns pointer).
- **Kept exactly:** the GSAP letter rise-in, the `.hero-up` fade, and the
  scroll-recede on `.hero-stage`.
- **Added:** `<HeroCanvas mode={HERO_MODE} />` as the first child, `id="hero-wordmark"`
  on the `<h1>`, and `relative z-10` on `.hero-stage` so the woven front-layer
  (z20) can paint over the text while the strand/atmosphere (z0/1) paint behind.

## How it works
- **`lib/thread.ts`** — `VerletThread`: verlet integration (gravity + distance
  constraints + damping), pinned endpoints, cursor recoil, ambient breeze.
  `draw()` renders stacked passes (bloom → halo → body → highlight) for a lit,
  rounded strand. Pure logic, no DOM.
- **`lib/atmosphere.ts`** — `Atmosphere`: a cursor-lagging lantern, two ambient
  glow fields, and dust motes at 3 parallax depths. Additive compositing.
- **`components/HeroCanvas.tsx`** — `"use client"`. Sizes 3 canvases to the
  hero section, runs one rAF loop, reads `.hero-letter` to warm letters, anchors
  the strand to the real wordmark position, and morphs all params toward the
  chosen `mode`. Cleans up rAF + listeners on unmount.

## Interactions & behavior
- **Cursor (fine pointer only):** strand recoils within ~170px; lantern eases
  toward the pointer; nearby letters warm to gold. In `woven`, letters warm
  where the Thread crosses them.
- **No cursor / touch:** the lantern drifts on a slow lissajous so the scene
  still breathes; no strand recoil.
- **Load:** strand is pre-settled (80 steps) so the first painted frame is
  already composed — no "snap into place" flash. Letters still rise via your
  GSAP intro.
- **Scroll:** your existing `.hero-stage` recede is untouched.

## Performance & SEO guardrails (please keep)
- **No essential content lives in canvas.** The wordmark + copy are real DOM
  text (the `<h1>` even keeps the `sr-only` full description). Fully indexable.
- **`prefers-reduced-motion: reduce`** → one static composed frame, no rAF, no
  pointer; letters render plain cream.
- **DPR capped at 2** so retina phones don't over-draw.
- **rAF loop stops on unmount** (cleanup returns `cancelAnimationFrame`).
- Mote count scales with area (`W*H/26000`) — stays light on small screens.
- The canvases are `pointer-events: none`, so buttons/links stay clickable.

## Design tokens (already in your globals.css — used verbatim)
- Dusk `#1e1b45`, dusk-deep `#14122e`, gold `#c9a55c`, gold-deep `#7a5f22`,
  cream `#f0ebdc`, mist `#a9a5c8`. Highlight on the strand: `#f4e6c2`.
- Fraunces (wordmark), Geist / Geist Mono (UI/labels) — unchanged.

## Troubleshooting
- **Strand sits in the wrong place** → the wordmark anchor reads
  `#hero-wordmark`'s box. Make sure the `id` is on the `<h1>`.
- **Letters never warm / never recolor** → confirm the `.hero-letter` CSS
  `transition` was set to `none` (a 0.9s color transition makes it look dead).
- **Woven strand hidden behind the text** → `.hero-stage` needs `relative z-10`
  and `<HeroCanvas/>` must be a *direct child* of the section (so its front
  canvas z20 outranks z10).
- **TypeScript path errors** → these files use your `@/…` alias; if your alias
  differs, adjust the imports at the top of `HeroCanvas.tsx` / `Hero.tsx`.

## Files
- `code/lib/thread.ts`
- `code/lib/atmosphere.ts`
- `code/components/HeroCanvas.tsx`
- `code/components/sections/Hero.tsx`
- `code/globals-additions.css`
- `reference/Innocooks Hero.html` + `reference/thread.js` / `atmosphere.js` / `hero.js` (prototype)
- `CLAUDE_CODE_PROMPT.md` (paste into Claude Code to do the install for you)
