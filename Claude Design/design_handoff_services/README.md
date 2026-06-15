# Handoff: InnoCooks Services — "Four things, done properly" (the deck, made physical)

## Overview
This replaces the static/sticky Services card-stack with a **pinned, vertical
3D deck**. As you scroll the section, the four service cards advance *down*
through a horizontal **Thread** (the same verlet strand as the hero, laid on
its side). The focal card sits forward; each card **warms to gold** as it
crosses the Thread — the hero's "woven warming", reused as the section's
through-line. Cursor tilts the whole scene a few degrees in perspective.

It reuses the hero's `VerletThread` (`frontend/lib/thread.ts`) — **no new files
in `lib/`, no new npm packages.** Just one component swap.

> Prereq: the **hero handoff** must already be installed (it's the one that
> added `frontend/lib/thread.ts`). It is — that's running in Claude Code now.
> If for some reason `lib/thread.ts` isn't present, copy it from
> `design_handoff_hero/code/lib/thread.ts` first.

---

## Install (the short version)

Copy one file into your repo, preserving the path:

| From | To |
|---|---|
| `code/components/sections/Services.tsx` | `frontend/components/sections/Services.tsx` **(overwrites your current Services)** |

No CSS changes. No new packages. `@/lib/thread`, `@/lib/gsap`, the design
tokens (`bg-parch`, `text-ink`, `text-gold-deep`, `text-muted`, `.card-surface`,
`.display`, `.container-x`, `.label-mono`, `--ease-settle`) all already exist in
your repo.

Run:
```bash
npm run dev
```
Open the homepage and scroll to Services. The cards should advance vertically in
3D, the Thread should run across the centre, and the focal card should warm to
gold.

---

## How the section is laid out (and why it doesn't fight your seams)

Your `<CanvasSeam>` components already melt dusk↔parchment between sections in
OKLab — **leave them exactly as they are.** This Services component is just a
`bg-parch` block that pins for four viewport-heights; the seams above and below
it keep doing their job. (The standalone HTML prototype additionally fakes one
full-page colour-lerp + a persistent Thread so it can show Services *in
context* on its own — your real site doesn't need that, because the hero canvas
and the seams already provide continuity.)

```
<section bg-parch>                 ← pins for (N-1)×100vh
  <div sticky h-screen perspective>
    <canvas/>                      ← the horizontal Thread + focal bead
    <div head/>                    ← "Four things, done properly." + 0X/04 counter
    <div scene preserve-3d>        ← cursor-tilted
      <div deck>
        <div card3d/> × 4          ← real DOM cards, transformed each frame
    <div dots/>                    ← vertical position rail (click to jump)
```

## How it works
- **One progress value.** A pinned GSAP `ScrollTrigger` (`scrub: 0.6`) maps
  scroll to `p ∈ [0, N-1]`. Every card's transform is a pure function of
  `d = i − p`: vertical offset `d·spacing`, depth `−|d|·230`, an `±14°` rotateX
  page-turn, and a warm factor `max(0, 1 − |d|·1.7)` written to a `--warm` CSS
  var the card reads for its border, shadow, diagram colour and watermark.
- **The Thread is the hero's `VerletThread`.** Built horizontally
  (`restY: 0.5`), pre-settled 60 steps so the first frame is composed, drawn on
  one canvas with a bright focal **bead** at its centre — the point cards warm
  as they pass.
- **Cursor tilt.** Pointer position eases `rotateX/rotateY` on the scene
  (a few degrees); the Thread also recoils from the cursor, exactly as in the
  hero.
- **One rAF loop**, cancelled on unmount; all listeners cleaned up.

## Readability — the one thing to keep
Near cards are kept **fully opaque** so the front card cleanly covers the one
behind it during a transition (semi-transparent cards bleeding text through each
other was the bug we fixed). Only *distant* cards (|d| > 1) fade out. If you ever
want the softer overlapping look back, that's the `neighbourOpacity` knob in the
prototype — but 1.0 is the readable default and what's shipped here.

## Tuning (in `Services.tsx`, inside `layout()`)
- `vGap` (`212 * fit`) — vertical distance between cards.
- `tz` (`-ad * 230`) — how far back the stack recedes.
- `rotX` (`* 14`) — page-turn angle.
- `op` — the opacity ramp (keep near cards at/near 1 for readability).
- Cursor tilt strength — the `* 9` / `* 6` in the `pointermove` handler.

(These four are exposed as live sliders in the prototype —
`reference/Innocooks Services.html` → toggle **Tweaks** — so you can dial them
by eye before hard-coding.)

## Performance & SEO guardrails (please keep)
- **No content lives in canvas.** All four cards are real DOM text —
  headings, copy and the "Explore →" affordance are fully indexable.
- **`prefers-reduced-motion: reduce`** *and* **< 860px** → the effect never
  initialises; the same four cards render as a plain vertical list
  (`enable3d === false`). No pin, no canvas, no rAF.
- **DPR capped at 2.**
- **rAF stops on unmount** (cleanup returns `cancelAnimationFrame` and reverts
  the GSAP `matchMedia`).
- The canvas is `pointer-events: none`, so the dot controls and any links stay
  clickable.

## Design tokens (already in your globals.css — used verbatim)
Parchment `#ece5d6` / parch-soft `#f5f0e4`, ink `#211e4b`, gold `#c9a55c`,
gold-deep `#7a5f22`, muted `#5e5a7d`. Thread highlight `#f4e6c2`. Fraunces
(`.display`), Geist Mono (labels). Cards use your existing `.card-surface`.

## Troubleshooting
- **Cards don't move / no pin** → confirm GSAP `ScrollTrigger` is registered
  (your `@/lib/gsap` already does this) and that the section is tall enough to
  pin against; the trigger ends at `+=${(N-1)*innerHeight}`.
- **`VerletThread` undefined** → the hero handoff didn't land; ensure
  `frontend/lib/thread.ts` exists and exports `VerletThread`.
- **Thread sits off-centre** → it builds to the *stage* box; make sure the
  canvas is a child of the `sticky h-screen` stage, not the section.
- **Cards bleed text through each other mid-transition** → a near-card opacity
  dropped below 1; keep the `ad <= 1` branch of `op` at/near 1.
- **TypeScript path errors** → these use your `@/…` alias; adjust the imports
  at the top of `Services.tsx` if your alias differs.

## Files
- `code/components/sections/Services.tsx`
- `reference/Innocooks Services.html` + `reference/services.js` / `reference/thread.js` (interactive prototype — open it, scroll, toggle **Tweaks**)
- `CLAUDE_CODE_PROMPT.md` (paste into Claude Code to do the install for you)
