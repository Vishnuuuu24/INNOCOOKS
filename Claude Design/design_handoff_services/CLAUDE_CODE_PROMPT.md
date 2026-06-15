# Paste this into Claude Code (run it from your repo root)

I have a design handoff bundle for the Services section of my Next.js site.
The bundle folder is `design_handoff_services/` (I'll place it at the repo root —
if it's somewhere else, find it first). My app lives in `frontend/`.

This builds on the hero handoff I already installed (the one that added
`frontend/lib/thread.ts`). Please install it exactly as specified:

1. Read `design_handoff_services/README.md` first — follow it precisely.

2. Confirm the prerequisite exists: `frontend/lib/thread.ts` exporting
   `VerletThread`. If it's missing, copy it from
   `design_handoff_hero/code/lib/thread.ts` -> `frontend/lib/thread.ts`.

3. Copy this file into my repo, preserving the path:
   - `design_handoff_services/code/components/sections/Services.tsx`
       -> `frontend/components/sections/Services.tsx`
     (this overwrites my current Services — that's intended)

4. Make NO CSS changes and add NO npm packages. This is plain <canvas> + my
   existing React/Next/GSAP, and it reuses `VerletThread` from `@/lib/thread`
   and `gsap`/`ScrollTrigger` from `@/lib/gsap`. All design tokens it uses
   (`bg-parch`, `text-ink`, `text-gold-deep`, `text-muted`, `.card-surface`,
   `.display`, `.container-x`, `.label-mono`, `--ease-settle`) already exist in
   my `globals.css`. Confirm `@/lib/*` and `@/components/*` resolve via my
   tsconfig alias; fix only the imports if my alias differs.

5. Leave my `<CanvasSeam>` / `.seam-to-parch` / `.seam-to-dusk` usage untouched —
   the new Services is a `bg-parch` block that pins between those seams; they
   keep handling the dusk↔parchment transitions.

6. Run `npm run dev`, open the homepage, scroll to Services, and verify:
   - the section pins and the four cards advance vertically in 3D as I scroll;
   - the gold Thread runs across the centre and the focal card warms to gold;
   - cards never bleed text through each other during a transition
     (near cards stay opaque — that's intended);
   - the dot rail on the right jumps to a card when clicked;
   - every card's heading/copy is real, selectable, indexable text;
   - no TypeScript/build/console errors;
   - `prefers-reduced-motion: reduce` (or a < 860px viewport) shows a plain
     vertical list of the same cards — no pin, no canvas.

7. Tuning knobs (vertical spacing, stack depth, page-turn angle, cursor tilt,
   card solidity) live inside `layout()` in `Services.tsx`. I can preview them
   live as sliders in `design_handoff_services/reference/Innocooks Services.html`
   (toggle Tweaks). Leave the shipped defaults unless I say otherwise.

Report back any build errors and how you resolved them.
