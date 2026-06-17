"use client";

import { useEffect, useRef } from "react";

/** A fixed structural frame over the whole site: a kinetic scroll-progress
 *  rail and corner registration ticks, the "instrument panel" that makes the
 *  page feel like a precise machine. Purely decorative, pointer-events: none,
 *  and invisible to assistive tech. */
export default function Frame() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const tick = "pointer-events-none fixed z-40 h-4 w-4 border-white/15";

  return (
    <div aria-hidden="true">
      {/* scroll-progress rail */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 bg-kinetic will-change-transform"
        />
      </div>

      {/* corner registration ticks */}
      <span className={`${tick} left-2 top-2 border-l border-t`} />
      <span className={`${tick} right-2 top-2 border-r border-t`} />
      <span className={`${tick} bottom-2 left-2 border-b border-l`} />
      <span className={`${tick} bottom-2 right-2 border-b border-r`} />
    </div>
  );
}
