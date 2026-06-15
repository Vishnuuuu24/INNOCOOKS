"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Selected work — vertical scroll turns horizontal (pinned, desktop),
 *  a native snap carousel on touch. Mockups are drawn in each project's
 *  own art direction: zero raster weight, always crisp. */

function ChristalinMock() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-parch-soft px-8 text-ink">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-deep">
        Refined unisex salon
      </p>
      <p className="display text-3xl md:text-4xl">Christalin Mirrors</p>
      <span className="h-px w-24 bg-gold" />
      <div className="mt-3 grid w-full max-w-sm grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-parch" />
        ))}
      </div>
      <div className="mt-1 h-8 w-32 rounded-full bg-ink" />
    </div>
  );
}

function EditsClubMock() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#15100c] px-8 text-[#e8d9c4]">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a47b5a]">
        Visual storytelling
      </p>
      <p className="display text-3xl uppercase tracking-[0.12em] md:text-4xl">
        The Edits Club
      </p>
      <span className="h-px w-24 bg-[#a47b5a]" />
      <div className="mt-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#a47b5a]">
        <svg viewBox="0 0 14 16" className="ml-0.5 h-4 w-4 fill-[#e8d9c4]" aria-hidden="true">
          <path d="M0 0 L14 8 L0 16 Z" />
        </svg>
      </div>
    </div>
  );
}

function HackstersMock() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 bg-dusk-soft px-10 font-mono text-xs text-mist md:px-14">
      <p className="text-gold">~ hacksters.tech</p>
      <p>
        <span className="text-cream">$</span> build --production
      </p>
      <p className="text-cream/80">→ shipped. innovators of tomorrow.</p>
      <div className="mt-4 flex flex-col gap-2">
        {[80, 60, 70].map((w, i) => (
          <span key={i} className="h-1.5 rounded-full bg-cream/15" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

const projects = [
  {
    title: "Christalin Mirrors",
    tag: "Website · live in production · systems for 7 branches next",
    href: "/work/christalin-mirrors/",
    external: false,
    Mock: ChristalinMock,
  },
  {
    title: "The Edits Club",
    tag: "Brand & portfolio · video editing studio",
    href: "https://theeditsclub.in",
    external: true,
    Mock: EditsClubMock,
  },
  {
    title: "Hacksters",
    tag: "Studio platform · interactive portfolio",
    href: "https://hacksters.tech",
    external: true,
    Mock: HackstersMock,
  },
];

export default function WorkCarousel() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current!;
      const getX = () => -(track.scrollWidth - window.innerWidth);

      // the vertical spine dives behind this section; the thread re-appears
      // here as a horizontal noodle drawn in lockstep with the track,
      // weaving behind the cards as they slide
      const thread = track.querySelector<SVGPathElement>(".work-thread");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${-getX()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track, { x: getX, ease: "none" }, 0);
      if (thread) {
        const len = thread.getTotalLength();
        gsap.set(thread, {
          strokeDasharray: len,
          strokeDashoffset: len,
          autoAlpha: 1,
        });
        tl.to(thread, { strokeDashoffset: 0, ease: "none" }, 0);
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="work"
      className="relative z-[1] overflow-hidden bg-dusk text-cream"
    >
      <div className="glow-field" aria-hidden="true" />
      <div className="relative flex min-h-screen flex-col justify-center py-14">
        <div className="container-x mb-10 flex items-end justify-between">
          <div>
            <p className="label-mono text-gold">/ 02 — Selected work</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.6rem)] text-cream">
              Built by us. Used for real.
            </h2>
          </div>
          <p className="hidden font-mono text-xs uppercase tracking-[0.2em] text-mist md:block">
            Scroll →
          </p>
        </div>

        <div className="no-scrollbar max-md:overflow-x-auto max-md:px-6 max-md:snap-x max-md:snap-mandatory">
          <div
            ref={trackRef}
            className="relative flex w-max gap-6 md:gap-10 md:pl-[max(1.5rem,calc((100vw-80rem)/2+3.5rem))] md:pr-24"
          >
            {/* the Thread, gone horizontal — rides the track, behind the cards */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 hidden h-full w-full md:block"
              viewBox="0 0 2400 600"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                className="work-thread invisible"
                d="M -10 300 C 200 300 260 150 430 150 S 720 460 920 460 S 1200 130 1400 130 S 1690 470 1890 470 S 2180 300 2410 300"
                stroke="var(--color-gold)"
                strokeWidth="1.75"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {projects.map(({ title, tag, href, external, Mock }, i) => {
              const card = (
                <article className="group relative w-[82vw] shrink-0 snap-center md:w-[56vw] lg:w-[46vw]">
                  <div className="h-[46vh] overflow-hidden rounded-[24px] border border-cream/10 transition-transform duration-500 ease-[var(--ease-settle)] group-hover:scale-[1.015] md:h-[52vh]">
                    <Mock />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="display text-xl text-cream md:text-2xl">
                        <span className="mr-3 font-mono text-xs tracking-[0.2em] text-gold">
                          0{i + 1}
                        </span>
                        {title}
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
                        {tag}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 text-gold transition-transform duration-500 group-hover:translate-x-1"
                    >
                      {external ? "↗" : "→"}
                    </span>
                  </div>
                </article>
              );
              return external ? (
                <a key={title} href={href} target="_blank" rel="noopener noreferrer">
                  {card}
                </a>
              ) : (
                <Link key={title} href={href}>
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
