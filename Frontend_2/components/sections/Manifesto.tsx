"use client";

/* What we build — a scroll-scrubbed manifesto. Each word lifts from dim→lit as
 * it crosses the viewport; the four capability words burn kinetic-orange, the
 * rest resolve to stark white. Reduced-motion / no-JS render it fully lit. */

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Reveal from "@/components/Reveal";

const SENTENCE =
  "We build the websites that turn visitors into customers, the systems that end your spreadsheet chaos, the AI that handles the repetitive thinking, and the automation that runs the busywork itself.";

const KEYS = new Set(["websites", "systems", "ai", "automation"]);
const WORDS = SENTENCE.split(" ").map((w) => ({
  w,
  key: KEYS.has(w.replace(/[^A-Za-z]/g, "").toLowerCase()),
}));

const INDEX = ["Websites", "Systems", "AI", "Automation"];

export default function Manifesto() {
  const stmt = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = gsap.utils.toArray<HTMLElement>(".mf-word", stmt.current);
      gsap.fromTo(
        words,
        { opacity: 0.14, yPercent: 18 },
        {
          opacity: 1,
          yPercent: 0,
          ease: "power2.out",
          stagger: 0.5,
          duration: 0.6,
          scrollTrigger: {
            trigger: stmt.current,
            start: "top 80%",
            end: "bottom 74%",
            scrub: 0.6,
          },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="build"
      className="relative scroll-mt-24 border-b border-iron bg-onyx"
    >
      <div className="container-x py-24 md:py-40">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label-mono">[ 01 / WHAT_WE_BUILD ]</p>
          </div>

          <div className="md:col-span-8">
            <p
              ref={stmt}
              className="display max-w-[24ch] text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.08] tracking-tight text-white"
              style={{ textTransform: "none" }}
            >
              {WORDS.map(({ w, key }, i) => (
                <Fragment key={i}>
                  <span className={`mf-word inline-block ${key ? "text-kinetic" : "text-white"}`}>
                    {w}
                  </span>
                  {i < WORDS.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>
          </div>
        </div>

        {/* the four capabilities — a full-width, evenly-split index row */}
        <Reveal delay={0.05}>
          <ul className="mt-14 grid grid-cols-2 gap-px border border-iron bg-iron sm:grid-cols-4 md:mt-20">
            {INDEX.map((label, i) => (
              <li
                key={label}
                className="flex items-baseline gap-3 bg-onyx px-5 py-7 transition-none hover:bg-onyx-raise"
              >
                <span className="label-mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="display h-md text-white">{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
