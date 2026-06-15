"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Magnetic from "@/components/Magnetic";
import HeroCanvas, { HeroMode } from "@/components/HeroCanvas";

const WORD = "INNOCOOKS";

/* Pick the direction here. "strand" = a single hanging filament of light
 * (material, classic). "woven" = the Thread laces through the wordmark and
 * warms each letter it crosses (signature). "dusk" = atmosphere-led, the
 * lantern follows the cursor and the type drifts in space. */
const HERO_MODE: HeroMode = "strand";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ delay: 0.15 });

      // letters rise out of their masks, one by one (unchanged from before)
      tl.fromTo(
        ".hero-letter",
        { yPercent: 112 },
        { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.045 }
      );

      tl.fromTo(
        ".hero-up",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 },
        "-=0.6"
      );

      // the wordmark recedes as you leave — Apple-style depth
      gsap.to(".hero-stage", {
        yPercent: -12,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 40%",
          scrub: 0.5,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-dusk pt-24 text-cream"
    >
      {/* the living Thread + atmosphere — paints behind (z0/1) and, in woven
          mode, in front (z20) of the wordmark. Content layer is z-10 below. */}
      <HeroCanvas mode={HERO_MODE} />

      <div className="hero-stage container-x relative z-10">
        <p className="hero-up label-mono text-gold">
          Systems studio — Cooking innovation
        </p>

        {/* the wordmark IS the hero */}
        <h1
          id="hero-wordmark"
          className="display mt-6 select-none whitespace-nowrap uppercase leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.2rem, 11.8vw, 11rem)" }}
        >
          {WORD.split("").map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span className="hero-letter inline-block will-change-transform">{ch}</span>
            </span>
          ))}
          <span className="sr-only">
            — we build the websites, internal systems and AI automation growing
            businesses run on
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="hero-up max-w-md text-lg leading-relaxed text-mist">
            We build the websites, internal systems and AI automation growing
            businesses run on — crafted like products, not projects.
          </p>
          <div className="hero-up flex flex-wrap gap-4">
            <Magnetic>
              <Link href="/contact/" className="btn-gold">
                Start a project <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Link href="/#work" className="btn-ghost text-cream">
                See the work
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      <p className="hero-up absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
        Scroll
      </p>
    </section>
  );
}
