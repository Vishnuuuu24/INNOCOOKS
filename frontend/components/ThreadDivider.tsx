"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** The Thread — a gold noodle-wave line (echoing the logo's noodle strands)
 *  that draws itself as it scrolls into view, stitching sections together. */
export default function ThreadDivider({ className = "" }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: path,
          start: "top 95%",
          end: "top 45%",
          scrub: 0.6,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div aria-hidden="true" className={className}>
      <div className="container-x">
        <svg
          viewBox="0 0 1200 60"
          fill="none"
          className="h-[40px] w-full md:h-[60px]"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d="M0 30 C 100 30, 140 12, 220 12 S 340 48, 430 48 S 560 12, 660 12 S 790 48, 890 48 S 1040 30, 1200 30"
            stroke="var(--color-gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
