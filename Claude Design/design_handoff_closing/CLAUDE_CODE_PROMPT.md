# Paste this into Claude Code (run it from your repo root)

I have a design handoff bundle for the closing three sections of my Next.js
site (Process, Studio, Start), unified by one vertical "spine" canvas. The
bundle folder is `design_handoff_closing/` (I'll place it at the repo root — if
it's somewhere else, find it first). My app lives in `frontend/`. This builds
on the hero/services/work work already in the repo.

Please install it exactly as specified:

1. Read `design_handoff_closing/README.md` first — follow it precisely.

2. Copy these files into my repo, preserving paths (create folders as needed):
   - `design_handoff_closing/code/components/ClosingSpine.tsx`
       -> `frontend/components/ClosingSpine.tsx` (new)
   - `design_handoff_closing/code/components/sections/Process.tsx`
       -> `frontend/components/sections/Process.tsx` (overwrites)
   - `design_handoff_closing/code/components/sections/Studio.tsx`
       -> `frontend/components/sections/Studio.tsx` (overwrites)
   - `design_handoff_closing/code/components/sections/FinalCTA.tsx`
       -> `frontend/components/sections/FinalCTA.tsx` (overwrites)

3. Append `design_handoff_closing/code/globals-additions.css` to
   `frontend/app/globals.css` (the `.cl-*` classes driven by `--lit` / `--hot`).

4. Edit `frontend/app/page.tsx`:
   - import and mount `<ClosingSpine />` ONCE, immediately before `<Process />`;
   - REMOVE the `<ThreadDivider className="bg-parch" />` that sat between
     `<Process />` and `<Studio />`, and REMOVE the trailing `<ThreadSpine />`
     (the spine replaces both);
   - KEEP every `<CanvasSeam>` exactly as-is (they still own the dusk↔parch
     colour melts).
   The closing block should read:
   `<CanvasSeam direction="dusk-to-parch" /> <ClosingSpine /> <Process />
    <Studio /> <CanvasSeam direction="parch-to-dusk" /> <FinalCTA />`

5. Add NO npm packages. This is plain <canvas> + my existing React. It reuses
   `@/components/Reveal`. Confirm `@/components/*` resolves via my tsconfig
   alias; fix only the imports if my alias differs. The CTA's magnetic pull is
   now handled by ClosingSpine via `[data-cta]`, so the `<Magnetic>` wrapper is
   no longer needed in FinalCTA (the new file already omits it).

6. Do not remove the data-attributes the new components carry
   (`id="process|studio|start"`, `[data-step]`, `[data-copy]`,
   `[data-spine-node]`, `[data-constellation]`, `[data-hub]`, `[data-member]`,
   `[data-loop]`, `[data-cta]`) — ClosingSpine reads them every frame.

7. Run `npm run dev`, open the homepage, scroll to the closing sections, verify:
   - a gold spine runs down through Process/Studio/Start; a bead descends it;
   - each process step's node lights and the step lifts as the bead reaches it;
   - the studio shows gold threads from the hub to all five members, swaying
     under the cursor;
   - the spine curls into a loop around the CTA near the bottom; the button is
     magnetic; the email + all copy are real, selectable text;
   - no TypeScript/build/console errors;
   - `prefers-reduced-motion: reduce` (or a < 860px viewport) shows a plain
     stacked timeline + a 2-col team grid, no canvas.

8. Tuning props on `<ClosingSpine spineSway={1} glow={1} spread={0.96}
   tilt={1} />` match the study's Tweaks. Leave the defaults unless I say so.
   I can preview them live in
   `design_handoff_closing/reference/Innocooks Closing.html` (toggle Tweaks).

Report back any build errors and how you resolved them.
