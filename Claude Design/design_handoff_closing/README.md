# Handoff: InnoCooks closing act — Process · Studio · Start (the Thread, tied off)

## Overview
This replaces the last three sections with one connected scroll, unified by
**"The Spine."** The Thread that carried the hero and the work stands up as a
vertical gold spine running down through **Process → Studio → Start**. A single
bead descends it as you scroll:

- **Process** — the four steps become **stations on the spine**, alternating
  sides; each node lights gold and its step lifts as the bead reaches it.
- **Studio** — the spine blooms into a **constellation**: a hub fans live gold
  threads out to all five team members ("one conversation reaches everyone"),
  swaying under the cursor.
- **Start** — the spine reaches bottom and **curls into a loop** around the
  magnetic CTA — the only closure on the page.

It's **purely additive canvas** — plain `<canvas>`, no new packages. It draws
the connective gold *on top of* your existing section backgrounds, so your
`<CanvasSeam>` colour transitions keep working untouched.

---

## Install

Copy these into your repo, preserving paths:

| From | To |
|---|---|
| `code/components/ClosingSpine.tsx` | `frontend/components/ClosingSpine.tsx` *(new)* |
| `code/components/sections/Process.tsx` | `frontend/components/sections/Process.tsx` **(overwrites)** |
| `code/components/sections/Studio.tsx` | `frontend/components/sections/Studio.tsx` **(overwrites)** |
| `code/components/sections/FinalCTA.tsx` | `frontend/components/sections/FinalCTA.tsx` **(overwrites)** |

Append `code/globals-additions.css` to `frontend/app/globals.css` (the
`--lit` / `--hot` driven `.cl-*` classes — everything else is Tailwind).

Then wire it in `frontend/app/page.tsx`:

```tsx
import ClosingSpine from "@/components/ClosingSpine";
// ...
<div className="relative">
  <Hero />
  <Marquee />
  <CanvasSeam direction="dusk-to-parch" />
  <Services />
  <CanvasSeam direction="parch-to-dusk" compact />
  <WorkCarousel />
  <CanvasSeam direction="dusk-to-parch" />

  {/* ── the closing act, stitched by one spine ── */}
  <ClosingSpine />
  <Process />
  <Studio />
  <CanvasSeam direction="parch-to-dusk" />
  <FinalCTA />
</div>
```

**Remove** the old `<ThreadDivider className="bg-parch" />` between Process and
Studio and the trailing `<ThreadSpine />` — the spine now connects these
sections and provides the closure those did. Keep the `<CanvasSeam>`s (they
still own the dusk↔parch colour melts; the spine just draws gold over them).

No new npm packages. `@/components/Reveal` is reused as-is. The CTA's magnetic
pull is now driven by `ClosingSpine` (via `[data-cta]`), so you can drop the
`<Magnetic>` wrapper here — but leaving it does no harm.

---

## The DOM contract (why the data-attributes matter)
`ClosingSpine` is mounted once and reads live positions every frame. The
section components already carry everything it needs — keep these hooks if you
edit them:

| Hook | On | Used for |
|---|---|---|
| `id="process"` / `id="studio"` / `id="start"` | section roots | spine bounds + region detection |
| `[data-step]` → `[data-copy]` | each process step / its copy block | lift the active step |
| `[data-spine-node]` | the gold ring on each step | light it (`--lit`) + branch stub |
| `[data-constellation]` | wrapper the members fan inside | radial placement |
| `[data-hub]` / `[data-member]` | studio hub + member cards | constellation threads, `--hot` |
| `[data-loop]` / `[data-cta]` | CTA wrapper + button | the closing loop + magnetic pull |

## How it works
- **One progress value** `p ∈ [0,1]` from scroll over the whole region drives
  the descending bead. Each process node's `--lit` is a function of its
  distance to the bead; the studio threads fade in by hub-to-centre distance;
  the loop `close`s as `p` passes ~0.82.
- **The spine** is a 60-point vertical chain with a gentle sway, cursor recoil
  and a cursor-tilt lean — same lit, stacked-pass gold as the hero Thread.
- **One rAF loop**, one injected `<canvas>`; both removed on unmount, along
  with every inline style it wrote.

## Performance & SEO guardrails (please keep)
- **No content lives in canvas.** All copy, names, roles, the CTA and the email
  are real DOM text — fully indexable.
- **`prefers-reduced-motion: reduce` *and* `< 860px`** → `ClosingSpine` no-ops
  (draws nothing, adds no listeners). The CSS fallback turns the timeline into
  a plain vertical list and the constellation into a 2-col card grid; `<Reveal>`
  still handles entrance.
- **DPR capped at 2.** rAF + listeners cleaned up on unmount.
- Canvas is `pointer-events: none`, so links/buttons stay clickable.

## Tuning
`<ClosingSpine spineSway={1} glow={1} spread={0.96} tilt={1} />` — the four
props match the study's Tweaks panel (spine sway, glow, constellation spread,
cursor tilt). The shipped defaults are the values approved in the study.

## Design tokens (already in your globals.css — used verbatim)
Parch `#ece5d6` / parch-soft `#f5f0e4`, ink `#211e4b`, dusk `#1e1b45`, cream
`#f0ebdc`, gold `#c9a55c`, gold-deep `#7a5f22`, mist `#a9a5c8`, muted `#5e5a7d`.
Thread highlight `#f4e6c2`. Fraunces (`.display`), Geist Mono (labels).

## Troubleshooting
- **No spine / threads** → confirm `<ClosingSpine/>` is mounted once and the
  three sections have `id="process"`, `id="studio"`, `id="start"`.
- **Loop never closes** → it shuts as scroll progress passes ~0.82; make sure
  `#start` is `min-h-screen` so there's room to reach the end.
- **Members stacked in the centre** → `[data-constellation]` needs its
  `.cl-constellation` height (560px desktop) so they can fan out.
- **TypeScript path errors** → these use your `@/…` alias; adjust imports if
  your alias differs.

## Files
- `code/components/ClosingSpine.tsx`
- `code/components/sections/Process.tsx` · `Studio.tsx` · `FinalCTA.tsx`
- `code/globals-additions.css`
- `reference/Innocooks Closing.html` + `reference/closing.js` / `reference/thread.js` (interactive prototype — open it, scroll, toggle **Tweaks**)
- `CLAUDE_CODE_PROMPT.md` (paste into Claude Code to do the install for you)
