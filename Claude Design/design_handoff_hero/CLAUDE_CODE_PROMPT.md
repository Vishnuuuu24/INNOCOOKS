# Paste this into Claude Code (run it from your repo root)

I have a design handoff bundle for a new animated hero on my Next.js site.
The bundle folder is `design_handoff_hero/` (I'll place it at the repo root —
if it's somewhere else, find it first). My app lives in `frontend/`.

Please install it exactly as specified:

1. Read `design_handoff_hero/README.md` first — follow it precisely.

2. Copy these files into my repo, preserving paths (create folders as needed):
   - `design_handoff_hero/code/lib/thread.ts`            -> `frontend/lib/thread.ts`
   - `design_handoff_hero/code/lib/atmosphere.ts`        -> `frontend/lib/atmosphere.ts`
   - `design_handoff_hero/code/components/HeroCanvas.tsx` -> `frontend/components/HeroCanvas.tsx`
   - `design_handoff_hero/code/components/sections/Hero.tsx` -> `frontend/components/sections/Hero.tsx`
     (this overwrites my current Hero — that's intended)

3. In `frontend/app/globals.css`, make the single change described in
   `design_handoff_hero/code/globals-additions.css`: replace my existing
   `.hero-letter { transition: color 0.9s … }` rule and delete the
   `.hero-letter:hover { … }` rule, so the rule becomes
   `.hero-letter { transition: none; }` (the canvas drives letter color now).

4. Do NOT add any npm packages — this is plain canvas + my existing
   React/Next/GSAP. Confirm `@/lib/*` and `@/components/*` resolve via my
   existing tsconfig path alias; fix the imports only if my alias differs.

5. Run `npm run dev`, open the homepage, and verify:
   - the hero composes immediately (no blank flash) and the strand of light
     reacts when I move the cursor;
   - the INNOCOOKS wordmark is still real, selectable text;
   - no TypeScript/build/console errors;
   - `prefers-reduced-motion` shows a static composed frame (test by toggling
     reduce-motion in dev tools).

6. The direction is set by `const HERO_MODE` near the top of `Hero.tsx`
   ("strand" | "dusk" | "woven"). Leave it on "strand" unless I say otherwise.

Report back any build errors and how you resolved them.
