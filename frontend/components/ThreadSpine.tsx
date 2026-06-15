"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** The Spine — one continuous noodle pulled down the entire page by scroll.
 *  It hugs the gutters beside content, crosses the page only inside the
 *  text-free seam bands, curls through a single loop on the way, and
 *  arrives at the final CTA just as the circle completes. A glowing tip
 *  travels the path like the end of the noodle being drawn.
 *
 *  The viewBox is proportional (1000 × 10000 ≈ full page height) and
 *  stretched with preserveAspectRatio="none"; vector-effect keeps the
 *  stroke crisp at any stretch. Hidden until JS draws it, and stays
 *  hidden for prefers-reduced-motion — it is pure decoration. */
export default function ThreadSpine() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = root.current?.querySelector<SVGPathElement>(".spine-path");
    const tip = root.current?.querySelector<SVGGElement>(".spine-tip");
    if (!path || !tip) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        autoAlpha: 1,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            const pt = path.getPointAtLength(st.progress * length);
            gsap.set(tip, {
              x: pt.x,
              y: pt.y,
              autoAlpha: st.progress > 0.004 && st.progress < 0.996 ? 1 : 0,
            });
          },
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1000 10000"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          className="spine-path invisible"
          d="M 955 -20
             C 950 300 965 620 945 960
             C 932 1180 620 1270 460 1335
             C 290 1405 92 1470 82 1740
             C 74 2040 96 2290 80 2590
             C 66 2890 94 3090 84 3340
             C 78 3480 340 3515 548 3578
             C 758 3642 936 3705 944 3955
             C 950 4290 930 4690 946 5090
             C 952 5290 944 5400 918 5505
             C 884 5645 705 5698 602 5660
             C 482 5615 518 5462 640 5502
             C 762 5542 598 5758 420 5800
             C 252 5840 96 5905 86 6150
             C 76 6500 98 6900 82 7300
             C 68 7690 102 8000 88 8345
             C 80 8550 300 8602 520 8678
             C 758 8760 898 8852 904 9098
             C 908 9345 758 9520 560 9602
             C 432 9655 382 9758 470 9828
             C 532 9872 562 9930 542 9992"
          stroke="var(--color-gold)"
          strokeWidth="1.75"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* the glowing tip — the end of the noodle being pulled */}
        <g className="spine-tip max-md:hidden" opacity="0">
          <circle r="9" fill="var(--color-gold)" opacity="0.22" />
          <circle r="3" fill="var(--color-gold)" />
        </g>
      </svg>
    </div>
  );
}
