"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** First-visit preloader: the Thread draws a noodle wave, the wordmark
 *  settles, the curtain lifts. ≤1.2s, overlays already-rendered content,
 *  skipped on repeat visits via sessionStorage. */
export default function Preloader() {
  const [show, setShow] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("ic-seen")) return;
    sessionStorage.setItem("ic-seen", "1");
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show || !overlayRef.current) return;
    const ctx = gsap.context(() => {
      const path = overlayRef.current!.querySelector("path");
      const length = path ? (path as SVGPathElement).getTotalLength() : 0;
      const tl = gsap.timeline({
        onComplete: () => setShow(false),
      });
      if (path) {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" });
      }
      tl.fromTo(
        ".pre-word",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.25"
      );
      tl.to(overlayRef.current, {
        yPercent: -100,
        duration: 0.55,
        ease: "expo.inOut",
        delay: 0.15,
      });
    }, overlayRef);
    return () => ctx.revert();
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-dusk"
    >
      <svg viewBox="0 0 220 40" fill="none" className="w-[180px]">
        <path
          d="M10 20 C 40 20, 50 8, 75 8 S 110 32, 138 32 S 180 14, 210 20"
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className="pre-word display text-2xl uppercase tracking-[0.18em] text-cream">
        InnoCooks
      </p>
    </div>
  );
}
