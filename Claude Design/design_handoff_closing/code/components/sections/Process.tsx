"use client";

/* InnoCooks — Process ("How we work")
 * The four steps become stations on the vertical Spine: they alternate across
 * it, and as <ClosingSpine>'s descending bead reaches each [data-spine-node]
 * the node lights gold (via --lit) and that step's [data-copy] lifts + reveals.
 * Drop-in replacement for the old Process.tsx. Needs <ClosingSpine/> mounted
 * once on the page; degrades to a clean vertical list with no spine.
 */

import Reveal from "@/components/Reveal";

const steps = [
  { name: "Understand", copy: "We sit with you and map how your business actually works — before any talk of technology." },
  { name: "Design", copy: "You see exactly what we'll build — pages, screens and flows — before a line of code is written." },
  { name: "Build", copy: "Production-grade work in focused sprints, with progress you can click — not promises." },
  { name: "Serve & maintain", copy: "Launch is the beginning. We stay on for updates, fixes and improvements, year-round." },
];

export default function Process() {
  return (
    <section id="process" className="relative scroll-mt-24 bg-parch text-ink">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-3xl">
          <Reveal><p className="label-mono">/ 03 — How we work</p></Reveal>
          <Reveal delay={0.06}>
            <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3.4rem)]">
              The recipe is simple. The discipline is the point.
            </h2>
          </Reveal>
        </div>

        <ol className="cl-timeline">
          {steps.map((s, i) => {
            const idx = String(i + 1).padStart(2, "0");
            return (
              <li className="cl-step" data-step key={s.name}>
                <div className="cl-copy" data-copy>
                  <Reveal delay={0.04}>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-gold-deep">Step {idx}</p>
                    <h3 className="display mt-2 text-[clamp(1.5rem,2.6vw,2.1rem)]">{s.name}</h3>
                    <p className="cl-body mt-3 max-w-[30rem] text-base leading-relaxed text-muted">{s.copy}</p>
                  </Reveal>
                </div>
                <span className="cl-node" data-spine-node aria-hidden="true"><b>{idx}</b></span>
                <div className="cl-blank" aria-hidden="true" />
              </li>
            );
          })}
        </ol>

        <Reveal delay={0.1}>
          <p className="mt-16 max-w-lg border-l-2 border-gold-deep pl-6 leading-relaxed text-muted">
            Every build includes a year of care. We don&apos;t hand over a project and
            disappear — we maintain the systems we serve.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
