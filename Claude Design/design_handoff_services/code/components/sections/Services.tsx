"use client";

/* InnoCooks — Services ("Four things, done properly")
 * The sticky card-stack, elevated into a pinned VERTICAL 3D deck. Scroll
 * drives one progress value p ∈ [0, N-1]; each card's transform is a pure
 * function of (i − p). The focal card sits forward and warms to gold as it
 * crosses the horizontal Thread that runs through the section's centre —
 * the same "woven warming" gesture as the hero. Cursor tilts the scene a
 * few degrees in perspective.
 *
 * Drop-in replacement for the old Services.tsx. No new packages — plain
 * <canvas> + your existing React/Next/GSAP, and `VerletThread` from
 * `@/lib/thread` (already in your repo from the hero handoff).
 *
 * SEO/a11y: every card is real DOM text. Reduced-motion and narrow screens
 * render a clean vertical list (no pin, no canvas).
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { VerletThread } from "@/lib/thread";

const GOLD = "#c9a55c";

type Service = { kicker: string; title: string; outcome: string; diagram: ReactNode };

const SERVICES: Service[] = [
  {
    kicker: "Websites",
    title: "Websites & storefronts",
    outcome:
      "A site that makes your business look as good as it actually is — fast, found on Google, built to turn visitors into enquiries.",
    diagram: (
      <svg viewBox="0 0 120 80" fill="none" className="h-24 w-auto">
        <rect x="4" y="6" width="112" height="68" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4" y1="22" x2="116" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2" fill="currentColor" />
        <circle cx="22" cy="14" r="2" fill="currentColor" />
        <path d="M16 44 h40 M16 54 h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="72" y="38" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    kicker: "Systems",
    title: "Internal management systems",
    outcome:
      "Clients, staff, stock and appointments in one calm dashboard — instead of spreadsheets, notebooks and WhatsApp threads.",
    diagram: (
      <svg viewBox="0 0 120 80" fill="none" className="h-24 w-auto">
        <rect x="6" y="8" width="44" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="70" y="8" width="44" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="38" y="48" width="44" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M28 36 C 28 44, 52 40, 56 48 M92 36 C 92 44, 68 40, 64 48" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    kicker: "Intelligence",
    title: "AI workflows & agents",
    outcome:
      "Assistants that answer customers, qualify leads and handle the repetitive thinking — trained on your business, working around the clock.",
    diagram: (
      <svg viewBox="0 0 120 80" fill="none" className="h-24 w-auto">
        <rect x="8" y="14" width="50" height="24" rx="12" stroke="currentColor" strokeWidth="1.5" />
        <rect x="62" y="44" width="50" height="24" rx="12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 24 h22 M76 54 h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M58 28 C 66 32, 60 40, 66 46" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    kicker: "Automation",
    title: "Automation & operations",
    outcome:
      "Invoices generated, reminders sent, reports compiled — the busywork runs itself, accurately, every single time.",
    diagram: (
      <svg viewBox="0 0 120 80" fill="none" className="h-24 w-auto">
        <rect x="10" y="10" width="40" height="52" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 22 h24 M18 32 h24 M18 42 h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M56 36 h22 m0 0 l-6 -6 m6 6 l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="96" cy="36" r="14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M90 36 l4 4 l8 -9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const N = SERVICES.length;
const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const countRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 860px)").matches;
    if (reduce || !desktop) return; // static vertical list (rendered below)
    setEnable3d(true);

    const stage = stageRef.current!;
    const scene = sceneRef.current!;
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const thread = new VerletThread({ count: 46, sag: 44, wander: 11, mouseForce: 0.9 });
    thread.glow = 0.85;

    let W = 0, H = 0, dpr = 1, fit = 1, raf = 0, last = performance.now();
    const pRef = { v: 0 };
    const mouse = { x: 0, y: 0, active: false };
    let tiltX = 0, tiltY = 0, tTiltX = 0, tTiltY = 0, lastActive = -1;

    function size() {
      const r = stage.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cardW = Math.max(360, Math.min(560, Math.round(W * 0.46)));
      stage.style.setProperty("--cardW", cardW + "px");
      fit = Math.max(0.8, Math.min(1, H / 880));
      thread.restY = 0.5;
      thread.build(W, H);
    }
    size();
    window.addEventListener("resize", size);

    function onMove(e: PointerEvent) {
      const r = stage.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
      tTiltY = (mouse.x / W - 0.5) * 9;
      tTiltX = -(mouse.y / H - 0.5) * 6;
    }
    function onLeave() { mouse.active = false; tTiltX = 0; tTiltY = 0; }
    if (finePointer) {
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
    }

    function layout() {
      const p = pRef.v;
      const vGap = 212 * fit;
      for (let i = 0; i < N; i++) {
        const c = cardRefs.current[i];
        if (!c) continue;
        const d = i - p;
        const ad = Math.min(2.6, Math.abs(d));
        const ty = d * vGap;
        const tz = -ad * 230;
        const rotX = -Math.max(-1.2, Math.min(1.2, d)) * 14;
        const sc = 1 - Math.min(1, ad) * 0.07;
        const op = ad <= 1 ? 1 - ad * 0.5 : Math.max(0, 0.5 - (ad - 1) * 0.42);
        const warm = Math.max(0, 1 - ad * 1.7);
        c.style.transform =
          `translate(-50%, -50%) translateY(${ty.toFixed(1)}px) translateZ(${tz.toFixed(1)}px) ` +
          `rotateX(${rotX.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        c.style.opacity = op.toFixed(3);
        c.style.zIndex = String(Math.round(100 - ad * 10));
        c.style.setProperty("--warm", warm.toFixed(3));
      }
      const active = Math.round(p);
      if (active !== lastActive) {
        lastActive = active;
        dotRefs.current.forEach((b, i) => b?.classList.toggle("is-on", i === active));
        if (countRef.current) countRef.current.textContent = pad(active);
      }
      if (headRef.current) headRef.current.style.transform = `translateY(${(-p * 9).toFixed(1)}px)`;
    }

    function drawBead() {
      const pt = thread.at(0.5);
      const pulse = 0.85 + 0.15 * Math.sin(thread.t * 2.2);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.5 * pulse;
      ctx.fillStyle = "rgba(201,165,92,0.5)";
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 16, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = pulse;
      ctx.shadowColor = GOLD; ctx.shadowBlur = 24;
      ctx.fillStyle = "#f4e6c2";
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function step(dt: number) {
      tiltX += (tTiltX - tiltX) * Math.min(1, dt * 6);
      tiltY += (tTiltY - tiltY) * Math.min(1, dt * 6);
      scene.style.transform = `scale(${fit.toFixed(3)}) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      layout();
      thread.update(dt, mouse);
      ctx.clearRect(0, 0, W, H);
      thread.alpha = 1;
      thread.draw(ctx, GOLD);
      drawBead();
    }
    function frame(now: number) {
      let dt = (now - last) / 1000; last = now;
      if (dt > 0.05) dt = 0.05;
      step(dt);
      raf = requestAnimationFrame(frame);
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 860px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${(N - 1) * window.innerHeight}`,
        pin: stage,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => { pRef.v = self.progress * (N - 1); },
      });
      for (let i = 0; i < 60; i++) thread.update(0.016, { x: 0, y: 0, active: false });
      last = performance.now();
      raf = requestAnimationFrame(frame);
      return () => { st.kill(); };
    });

    return () => {
      mm.revert();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // dot click → scroll to that card's progress position
  const goTo = (i: number) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const top = window.scrollY + rect.top + (i / (N - 1)) * total;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={root} id="services" className="relative scroll-mt-24 bg-parch text-ink">
      <div ref={stageRef} className="sticky top-0 flex h-screen flex-col overflow-hidden [perspective:1700px] [perspective-origin:50%_56%]">
        {/* the horizontal Thread, drawn behind the deck */}
        {enable3d && (
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]" />
        )}

        {/* heading */}
        <div ref={headRef} className="container-x absolute inset-x-0 top-0 z-[5] pt-20 will-change-transform">
          <p className="label-mono">/ 01 — What we build</p>
          <h2 className="display mt-3 max-w-[12ch] text-[clamp(1.7rem,3.4vw,2.7rem)]">Four things, done properly.</h2>
          <p className="mt-3 font-mono text-sm tracking-[0.14em] text-muted">
            <b ref={countRef} className="font-medium text-ink">01</b> / 04
          </p>
        </div>

        {/* the deck */}
        <div
          ref={sceneRef}
          className={enable3d ? "absolute inset-0 z-[4] [transform-style:preserve-3d] will-change-transform" : "container-x py-24"}
        >
          <div className={enable3d ? "absolute left-1/2 top-[53%] [transform-style:preserve-3d]" : "mx-auto grid max-w-3xl gap-6"}>
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={enable3d ? { ["--warm" as string]: 0 } : undefined}
                className={enable3d ? "absolute left-0 top-0 [transform-style:preserve-3d] will-change-transform" : ""}
              >
                <article
                  className="card-surface relative grid grid-cols-[1fr_auto] items-center gap-9 overflow-hidden p-8"
                  style={
                    enable3d
                      ? {
                          width: "var(--cardW,520px)",
                          height: 282,
                          borderColor: "color-mix(in srgb, var(--color-gold) calc(34% + var(--warm,0) * 66%), transparent)",
                        }
                      : undefined
                  }
                >
                  <span
                    aria-hidden="true"
                    className="display pointer-events-none absolute -top-6 right-28 text-[8rem] leading-[0.8] text-ink"
                    style={{ opacity: "calc(0.05 + var(--warm,0) * 0.05)" }}
                  >
                    {pad(i)}
                  </span>
                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[0.66rem] uppercase tracking-[0.26em] text-gold-deep">{s.kicker}</span>
                      <span className="font-mono text-[0.66rem] tracking-[0.16em] text-muted">{pad(i)} / {pad(N - 1)}</span>
                    </div>
                    <h3 className="display mt-4 text-2xl">{s.title}</h3>
                    <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-muted">{s.outcome}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-gold-deep" style={{ opacity: "calc(0.4 + var(--warm,0) * 0.6)" }}>
                      Explore <span aria-hidden="true">→</span>
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-center pr-1"
                    style={{ color: "color-mix(in srgb, var(--color-gold-deep) calc(100% - var(--warm,0) * 100%), var(--color-gold))" }}
                  >
                    {s.diagram}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* vertical position dots (desktop only) */}
        {enable3d && (
          <div className="absolute right-10 top-1/2 z-[6] flex -translate-y-1/2 flex-col gap-[0.7rem]">
            {SERVICES.map((s, i) => (
              <button
                key={s.title}
                ref={(el) => { dotRefs.current[i] = el; }}
                type="button"
                aria-label={`Go to ${s.title}`}
                onClick={() => goTo(i)}
                className="h-[9px] w-[9px] rounded-full border-0 bg-ink/30 p-0 transition-[background,transform] duration-300 ease-[var(--ease-settle)] [&.is-on]:scale-[1.35] [&.is-on]:bg-gold"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
