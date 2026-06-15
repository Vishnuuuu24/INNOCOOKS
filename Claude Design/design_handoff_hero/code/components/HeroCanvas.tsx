"use client";

/* InnoCooks — HeroCanvas
 * Drives the Thread + Atmosphere on one rAF loop inside the hero <section>.
 * Sized to its wrapper (NOT the viewport) so it behaves inside a scrolling
 * page, with all pointer/letter coordinates converted to wrapper-local space.
 *
 * It reads the wordmark's letters from the DOM (default ".hero-letter") to
 * warm them toward gold near the cursor / where the woven thread crosses,
 * and anchors the strand to the wordmark's real position.
 *
 * Render it as the FIRST child of the hero section. Give the section
 * `position: relative; overflow: hidden`, the content layer `z-10`, and this
 * component paints behind (atmosphere/back strand, z0/1) and in front (woven
 * over-strokes, z20) of the text.
 */

import { useEffect, useRef } from "react";
import { VerletThread } from "@/lib/thread";
import { Atmosphere } from "@/lib/atmosphere";

export type HeroMode = "strand" | "dusk" | "woven";

const GOLD = "#c9a55c";
const CREAM = "#f0ebdc";

type Preset = {
  restY: number; sag: number; grav: number; width: number; glow: number;
  threadAlpha: number; mouseForce: number; wander: number; lanternInt: number;
  moteAlpha: number; weave: number; parallax: number; bead: number;
};

const MODES: Record<HeroMode, Preset> = {
  strand: { restY: 0.60, sag: 185, grav: 840, width: 7.5, glow: 1.05, threadAlpha: 1, mouseForce: 1.25, wander: 32, lanternInt: 0.45, moteAlpha: 0.55, weave: 0, parallax: 0.45, bead: 1 },
  dusk:   { restY: 0.70, sag: 120, grav: 320, width: 3.2, glow: 0.85, threadAlpha: 0.72, mouseForce: 0.7, wander: 18, lanternInt: 1.2, moteAlpha: 1.35, weave: 0, parallax: 1.25, bead: 0 },
  woven:  { restY: 0.485, sag: 30, grav: 80, width: 5, glow: 1, threadAlpha: 1, mouseForce: 0.9, wander: 13, lanternInt: 0.7, moteAlpha: 0.7, weave: 1, parallax: 0.6, bead: 0.4 },
};

function mix(a: string, b: string, t: number) {
  t = Math.max(0, Math.min(1, t));
  const ca = hex(a), cb = hex(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function HeroCanvas({
  mode = "strand",
  letterSelector = ".hero-letter",
  wordmarkSelector = "#hero-wordmark",
}: {
  mode?: HeroMode;
  letterSelector?: string;
  wordmarkSelector?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const atmoRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<HeroMode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    const wrap = wrapRef.current!;
    const atmoCv = atmoRef.current!;
    const backCv = backRef.current!;
    const frontCv = frontRef.current!;
    const ax = atmoCv.getContext("2d")!;
    const bx = backCv.getContext("2d")!;
    const fx = frontCv.getContext("2d")!;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const thread = new VerletThread();
    const atmo = new Atmosphere();
    const letters = Array.from(document.querySelectorAll<HTMLElement>(letterSelector));
    const wordmark = document.querySelector<HTMLElement>(wordmarkSelector);
    const warm = new Map<HTMLElement, number>();

    const cur: Preset = { ...MODES.strand, restY: 0.16, threadAlpha: 0, grav: 840 };
    const mouse = { x: 0, y: 0, active: false };
    let W = 0, H = 0, dpr = 1, raf = 0, last = performance.now(), autoT = 0, beadF = 0;

    function size() {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      for (const cv of [atmoCv, backCv, frontCv]) {
        cv.width = W * dpr; cv.height = H * dpr;
        cv.style.width = W + "px"; cv.style.height = H + "px";
      }
      ax.setTransform(dpr, 0, 0, dpr, 0, 0);
      bx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fx.setTransform(dpr, 0, 0, dpr, 0, 0);
      thread.build(W, H);
      atmo.build(W, H);

      if (wordmark) {
        const wm = wordmark.getBoundingClientRect();
        const wr = wrap.getBoundingClientRect();
        const wf = (wm.top - wr.top + wm.height / 2) / H;
        MODES.strand.restY = Math.min(0.82, wf + 0.2);
        MODES.woven.restY = wf - 0.005;
        MODES.dusk.restY = Math.min(0.86, wf + 0.32);
      }
    }
    size();
    window.addEventListener("resize", size);

    function onMove(e: PointerEvent) {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
        mouse.x = x; mouse.y = y; mouse.active = true;
        atmo.setLantern(x, y);
      } else {
        mouse.active = false;
      }
    }
    if (finePointer && !reduce) window.addEventListener("pointermove", onMove);

    function paintLetters(dt: number) {
      let px = 0, py = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const wr = wrap.getBoundingClientRect();
        const cx = r.left - wr.left + r.width / 2;
        const cy = r.top - wr.top + r.height / 2;

        let w = 0;
        if (mouse.active) {
          const d = Math.hypot(cx - mouse.x, cy - mouse.y);
          w = Math.max(w, Math.max(0, 1 - d / 240));
        }
        if (cur.weave > 0.2) {
          let best = 1e9;
          for (let i = 0; i < thread.points.length; i += 2) {
            const p = thread.points[i];
            const d = Math.hypot(cx - p.x, cy - p.y);
            if (d < best) best = d;
          }
          w = Math.max(w, Math.max(0, 1 - best / 90) * cur.weave);
        }
        const prev = warm.get(l) ?? 0;
        const next = prev + (w - prev) * Math.min(1, dt * (w > prev ? 12 : 3));
        warm.set(l, next);
        l.style.color = mix(CREAM, GOLD, next);
      }

      // dusk parallax — applied to the wordmark as a whole so it never
      // fights a per-letter intro animation running on the same elements
      if (wordmark) {
        if (cur.parallax > 0.7 && mouse.active) {
          px = (mouse.x / W - 0.5) * -18 * cur.parallax;
          py = (mouse.y / H - 0.5) * -11 * cur.parallax;
          wordmark.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
        } else {
          wordmark.style.transform = "";
        }
      }
    }

    function drawWeave() {
      fx.clearRect(0, 0, W, H);
      if (cur.weave < 0.05) return;
      const pts = thread.points;
      const period = W / 6.5;
      let run: typeof pts = [];
      const flush = () => {
        if (run.length >= 2) {
          thread.alpha = cur.threadAlpha * cur.weave;
          thread.draw(fx, GOLD, run);
        }
        run = [];
      };
      for (const p of pts) {
        const over = Math.floor((p.x + period * 0.5) / period) % 2 === 0;
        if (over) run.push(p); else flush();
      }
      flush();
    }

    function drawBead(dt: number) {
      if (cur.bead < 0.05) return;
      beadF = (beadF + dt * 0.05) % 1;
      const p = thread.at(beadF);
      bx.save();
      bx.globalCompositeOperation = "lighter";
      bx.globalAlpha = cur.bead;
      bx.shadowColor = GOLD; bx.shadowBlur = 22;
      bx.fillStyle = "#f4e6c2";
      bx.beginPath(); bx.arc(p.x, p.y, 3.4, 0, Math.PI * 2); bx.fill();
      bx.shadowBlur = 0; bx.fillStyle = "rgba(201,165,92,0.25)";
      bx.beginPath(); bx.arc(p.x, p.y, 9, 0, Math.PI * 2); bx.fill();
      bx.restore();
    }

    function morph(dt: number) {
      const tgt = MODES[modeRef.current];
      const k = Math.min(1, dt * 2.4);
      (Object.keys(tgt) as (keyof Preset)[]).forEach((key) => {
        cur[key] += (tgt[key] - cur[key]) * k;
      });
      thread.restY = cur.restY; thread.sag = cur.sag; thread.width = cur.width;
      thread.glow = cur.glow; thread.alpha = cur.threadAlpha; thread.gravity = cur.grav;
      thread.mouseForce = cur.mouseForce; thread.wander = cur.wander;
      atmo.intensity = cur.lanternInt; atmo.moteAlpha = cur.moteAlpha;
    }

    function step(dt: number) {
      morph(dt);
      if (!mouse.active) {
        autoT += dt;
        atmo.setLantern(
          W * (0.5 + 0.32 * Math.sin(autoT * 0.25)),
          H * (0.4 + 0.2 * Math.cos(autoT * 0.19))
        );
      }
      atmo.update(dt);
      thread.update(dt, mouse);

      ax.clearRect(0, 0, W, H);
      atmo.draw(ax, GOLD);

      bx.clearRect(0, 0, W, H);
      thread.alpha = cur.threadAlpha;
      thread.draw(bx, GOLD);
      drawBead(dt);

      drawWeave();
      paintLetters(dt);
    }

    function frame(now: number) {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      step(dt);
      raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      Object.assign(cur, MODES[modeRef.current], { threadAlpha: MODES[modeRef.current].threadAlpha });
      morph(1);
      for (let i = 0; i < 60; i++) thread.update(0.016, { x: 0, y: 0, active: false });
      atmo.update(0.1);
      atmo.draw(ax, GOLD);
      thread.draw(bx, GOLD);
      drawWeave();
      letters.forEach((l) => (l.style.color = CREAM));
    } else {
      // pre-settle so the first painted frame is already composed
      for (let i = 0; i < 80; i++) step(0.016);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      letters.forEach((l) => { l.style.color = ""; });
      if (wordmark) wordmark.style.transform = "";
    };
  }, [letterSelector, wordmarkSelector]);

  return (
    <>
      {/* back: atmosphere + the strand, behind the wordmark (z0/z1) */}
      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      >
        <canvas ref={atmoRef} style={{ position: "absolute", inset: 0 }} />
        <canvas ref={backRef} style={{ position: "absolute", inset: 0 }} />
      </div>
      {/* front: the woven "over" strokes, above the wordmark text (z20).
          Must be a sibling of the back layer, NOT nested, so it outranks the
          content layer (give the hero content `position: relative; z-10`). */}
      <canvas
        ref={frontRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}
      />
    </>
  );
}
