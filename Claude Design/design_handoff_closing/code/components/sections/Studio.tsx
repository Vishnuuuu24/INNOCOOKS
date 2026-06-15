"use client";

/* InnoCooks — Studio ("The team")
 * "One conversation reaches everyone" made literal: a hub fans live gold
 * threads (drawn by <ClosingSpine>) out to all five members. The strands sway
 * under the cursor and the nearest member warms (via --hot). Drop-in
 * replacement for the old Studio.tsx; degrades to a 2-col card grid with no
 * threads. Needs <ClosingSpine/> mounted once on the page.
 */

import Reveal from "@/components/Reveal";

const team = [
  { name: "Vishnu Vardhan", role: "Frontend & design" },
  { name: "", role: "Backend & infrastructure" },
  { name: "", role: "AI & automation" },
  { name: "", role: "Research & strategy" },
  { name: "", role: "Pitching & client success" },
];

export default function Studio() {
  return (
    <section id="studio" className="relative scroll-mt-24 bg-parch text-ink">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-4xl">
          <Reveal><p className="label-mono">/ 04 — The studio</p></Reveal>
          <Reveal delay={0.06}>
            <h2 className="display mt-4 text-[clamp(2rem,4.4vw,3.4rem)]">
              A small team that treats your business like the product.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              We&apos;re a five-person studio. One conversation with us reaches everyone who
              designs, builds and maintains your system — no account managers, no hand-offs,
              no telephone game. We take on few projects and finish every one properly.
            </p>
          </Reveal>
        </div>

        <div className="cl-constellation" data-constellation>
          <div className="cl-hub" data-hub>
            <span className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.18em] text-gold-deep">
              One<br />conversation
            </span>
          </div>
          {team.map((m) => (
            <div className="cl-member" data-member key={m.role}>
              <div className="cl-surface">
                <span aria-hidden="true" className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink font-mono text-sm text-cream">
                  {(m.name || "InnoCooks").slice(0, 1)}
                </span>
                <p className={`text-[0.92rem] font-medium ${m.name ? "" : "text-muted"}`}>
                  {m.name || "InnoCooks team"}
                </p>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
