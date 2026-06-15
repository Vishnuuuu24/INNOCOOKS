"use client";

/* InnoCooks — ClosingSpine
 * The Thread that carried the hero and the work becomes a vertical spine
 * running down through Process → Studio → Start. One bead descends it as you
 * scroll: it lights each process station (which lifts), blooms into a
 * hub-and-spoke constellation across the team, then curls into the loop that
 * closes the page around the CTA.
 *
 * Mount ONCE, near the top of the page tree (e.g. in app/page.tsx, as the
 * first child of the wrapper). It injects a single fixed <canvas> and reads
 * the live positions of the sections it connects via data-attributes:
 *
 *   #process  #studio  #start          – the three section roots (by id)
 *   [data-spine-node]                  – the gold ring on each process step
 *   [data-step] > [data-copy]          – the step's copy block (lifts when lit)
 *   [data-hub]  [data-member]          – the studio constellation
 *   [data-constellation]               – wrapper the members fan inside
 *   [data-loop]  [data-cta]            – the CTA loop anchor + magnetic button
 *
 * No new packages — plain <canvas> + your existing React. Pure additive: it
 * draws the connective gold on top of your existing section backgrounds, so
 * your <CanvasSeam> colour transitions keep working untouched.
 *
 * Reduced-motion / touch: renders nothing and cleans up — every section still
 * reads perfectly as static DOM (your <Reveal> handles entrance).
 */

import { useEffect } from "react";

const GOLD = "#c9a55c";
const HI = "#f4e6c2";

type Tweaks = { spineSway: number; glow: number; spread: number; tilt: number };

export default function ClosingSpine({
  spineSway = 1,
  glow = 1,
  spread = 0.96,
  tilt = 1,
}: Partial<Tweaks>) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 860px)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !wide) return;

    const T: Tweaks = { spineSway, glow, spread, tilt };

    const processEl = document.getElementById("process");
    const startEl = document.getElementById("start");
    if (!processEl || !startEl) return; // closing region not on this page

    // inject the fixed canvas (above section bg, below content)
    const cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    Object.assign(cv.style, {
      position: "fixed", inset: "0", zIndex: "1", pointerEvents: "none",
    } as CSSStyleDeclaration);
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d")!;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-spine-node]"));
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    // resolve each step's copy block once, not every frame
    const copies = steps.map((s) => s.querySelector<HTMLElement>("[data-copy]"));
    const hub = document.querySelector<HTMLElement>("[data-hub]");
    const members = Array.from(document.querySelectorAll<HTMLElement>("[data-member]"));
    const loopWrap = document.querySelector<HTMLElement>("[data-loop]");
    const cta = document.querySelector<HTMLElement>("[data-cta]");

    let W = 0, H = 0, dpr = 1, centerX = 0, raf = 0, running = false;

    function placeMembers() {
      const wrap = document.querySelector<HTMLElement>("[data-constellation]");
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const cx = r.width / 2, cy = r.height / 2;
      const radX = Math.min(r.width * 0.4, 460) * T.spread;
      const radY = Math.min(r.height * 0.4, 230) * T.spread;
      const a0 = -Math.PI / 2;
      members.forEach((m, i) => {
        const a = a0 + (i / members.length) * Math.PI * 2;
        m.style.left = cx + Math.cos(a) * radX + "px";
        m.style.top = cy + Math.sin(a) * radY + "px";
      });
    }
    function size() {
      W = window.innerWidth; H = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = W / 2;
      placeMembers();
    }

    // spine chain
    const SEG = 60;
    const spine = Array.from({ length: SEG + 1 }, () => ({ x: 0, y: 0 }));
    let topY = 0, botY = 0, prog = 0;
    function bounds() {
      const pr = processEl!.getBoundingClientRect();
      const sr = startEl!.getBoundingClientRect();
      topY = window.scrollY + pr.top - H * 0.3;
      botY = window.scrollY + sr.top + sr.height * 0.62;
      prog = Math.max(0, Math.min(1, (window.scrollY + H * 0.5 - topY) / (botY - topY)));
    }

    // pointer + magnetic
    const mouse = { x: -1, y: -1, active: false };
    let tiltX = 0, tiltY = 0, tTiltX = 0, tTiltY = 0;
    let magX = 0, magY = 0, tMagX = 0, tMagY = 0;
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      tTiltY = e.clientX / W - 0.5; tTiltX = e.clientY / H - 0.5;
    };
    const onLeave = () => { mouse.active = false; tTiltX = 0; tTiltY = 0; };
    const onMag = (e: PointerEvent) => {
      if (!cta) return;
      const r = cta.getBoundingClientRect();
      tMagX = (e.clientX - (r.left + r.width / 2)) * 0.3;
      tMagY = (e.clientY - (r.top + r.height / 2)) * 0.3;
    };
    const offMag = () => { tMagX = 0; tMagY = 0; };
    if (finePointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      loopWrap?.addEventListener("pointermove", onMag, { passive: true });
      loopWrap?.addEventListener("pointerleave", offMag);
    }
    const onResize = () => { size(); bounds(); };
    window.addEventListener("resize", onResize);

    const smooth = (t: number) => t * t * (3 - 2 * t);
    type Pt = { x: number; y: number };
    function strand(pts: Pt[], width: number, alpha: number, color: string) {
      if (pts.length < 2) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      const passes = [
        { w: width * 3.4, a: 0.05 * alpha * T.glow, c: color },
        { w: width * 2.0, a: 0.1 * alpha * T.glow, c: color },
        { w: width, a: 0.85 * alpha, c: color },
        { w: width * 0.42, a: 0.95 * alpha, c: HI },
      ];
      for (const ps of passes) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.strokeStyle = ps.c; ctx.globalAlpha = ps.a; ctx.lineWidth = ps.w;
        ctx.stroke();
      }
      ctx.restore();
    }
    function bead(x: number, y: number, s: number, str: number) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.5 * str;
      ctx.fillStyle = "rgba(201,165,92,0.5)";
      ctx.beginPath(); ctx.arc(x, y, 16 * s, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = str;
      ctx.shadowColor = GOLD; ctx.shadowBlur = 24; ctx.fillStyle = HI;
      ctx.beginPath(); ctx.arc(x, y, 4 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    let tsec = 0, last = performance.now();
    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; tsec += dt;
      bounds();

      // READ PHASE — collect every rect up front so the browser lays out once
      // per frame instead of once per element (interleaved read/write thrash).
      const nodeRects = nodes.map((n) => n.getBoundingClientRect());
      const hubRect = hub ? hub.getBoundingClientRect() : null;
      const memberRects = members.map((m) => m.getBoundingClientRect());
      const loopRect = loopWrap ? loopWrap.getBoundingClientRect() : null;

      // WRITE / DRAW PHASE — no layout reads beyond this point.
      tiltX += (tTiltX - tiltX) * Math.min(1, dt * 5);
      tiltY += (tTiltY - tiltY) * Math.min(1, dt * 5);
      magX += (tMagX - magX) * Math.min(1, dt * 8);
      magY += (tMagY - magY) * Math.min(1, dt * 8);
      if (cta) cta.style.transform = `translate(${magX.toFixed(1)}px, ${magY.toFixed(1)}px)`;

      ctx.clearRect(0, 0, W, H);

      const sway = 26 * T.spineSway, scrollY = window.scrollY;
      const vTop = topY - scrollY, vBot = botY - scrollY;
      for (let i = 0; i <= SEG; i++) {
        const f = i / SEG;
        const y = vTop + (vBot - vTop) * f;
        let x = centerX + Math.sin(f * Math.PI * 3 + tsec * 0.5) * sway * (0.5 + 0.5 * Math.sin(f * Math.PI)) + tiltY * 30 * T.tilt;
        if (mouse.active) {
          const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 26000) { const d = Math.sqrt(d2) || 1; x += (dx / d) * (1 - d / 161) * 26; }
        }
        spine[i].x += (x - spine[i].x) * Math.min(1, dt * 12);
        spine[i].y = y;
      }
      strand(spine, 3.2, 0.7, GOLD);

      const bi = Math.max(0, Math.min(SEG, Math.round(prog * SEG)));
      const bp = spine[bi];

      // PROCESS — light nearest node + lift its copy
      nodes.forEach((n, i) => {
        const r = nodeRects[i];
        const ny = r.top + r.height / 2;
        const lit = Math.max(0, 1 - Math.abs(ny - bp.y) / (H * 0.26));
        n.style.setProperty("--lit", lit.toFixed(3));
        const copy = copies[i];
        if (copy) {
          copy.style.transform = `translateY(${(-lit * 8).toFixed(1)}px)`;
          copy.style.opacity = (0.5 + lit * 0.5).toFixed(3);
        }
        if (lit > 0.02) {
          strand([{ x: centerX + tiltY * 30 * T.tilt, y: ny }, { x: r.left + r.width / 2, y: ny }], 1.6, lit * 0.7, GOLD);
        }
      });

      // STUDIO — constellation
      if (hub && hubRect) {
        const hr = hubRect;
        if (hr.bottom > 0 && hr.top < H) {
          const hx = hr.left + hr.width / 2, hy = hr.top + hr.height / 2;
          const vis = Math.max(0, 1 - Math.abs(hy - H / 2) / (H * 0.8));
          members.forEach((m, idx) => {
            const r = memberRects[idx];
            const mx = r.left + r.width / 2, my = r.top + r.height / 2;
            const near = mouse.active ? Math.max(0, 1 - Math.hypot(mx - mouse.x, my - mouse.y) / 240) : 0;
            m.style.setProperty("--hot", near.toFixed(3));
            const midx = (hx + mx) / 2 + Math.sin(tsec * 0.8 + mx) * 10 + (mouse.active ? (mouse.x - (hx + mx) / 2) * 0.05 : 0);
            const midy = (hy + my) / 2 + Math.cos(tsec * 0.7 + my) * 8;
            strand([{ x: hx, y: hy }, { x: midx, y: midy }, { x: mx, y: my }], 1.5, (0.4 + near * 0.6) * vis, GOLD);
          });
          bead(hx, hy, 1, 0.5 * vis);
        }
      }

      // START — the loop closes around the CTA
      if (loopWrap && loopRect) {
        const r = loopRect;
        const cx = r.left + r.width / 2 + magX * 0.4, cy = r.top + r.height / 2 + magY * 0.4;
        const rx = r.width / 2 + 26, ry = r.height / 2 + 18;
        const vis = Math.max(0, 1 - Math.abs(cy - H / 2) / (H * 0.7));
        if (vis > 0.02) {
          const close = smooth(Math.max(0, Math.min(1, (prog - 0.82) / 0.16)));
          const a0 = -Math.PI / 2, span = Math.PI * 2 * close, segs = 60;
          const loopPts: Pt[] = [];
          for (let i = 0; i <= segs; i++) {
            const a = a0 + span * (i / segs);
            loopPts.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
          }
          strand(loopPts, 2.4, vis, GOLD);
          if (close > 0.01) {
            const a = a0 + span;
            bead(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 1, vis * (0.6 + 0.4 * close));
          }
        }
      }

      if (prog < 0.86) bead(bp.x, bp.y, 1, 1);

      if (running) raf = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stopLoop() {
      running = false;
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, W, H);
    }

    size(); bounds();
    for (let i = 0; i <= SEG; i++) spine[i].x = centerX;
    startLoop();

    // only run while some part of the closing region is on screen and the tab
    // is visible — the spine does nothing useful from the hero/work area.
    const studioEl = document.getElementById("studio");
    const watch = [processEl, studioEl, startEl].filter(Boolean) as HTMLElement[];
    const visible = new Map<Element, boolean>();
    watch.forEach((el) => visible.set(el, false));
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible.set(e.target, e.isIntersecting);
          const any = [...visible.values()].some(Boolean);
          if (any && !document.hidden) startLoop();
          else stopLoop();
        },
        { rootMargin: "300px" }
      );
      watch.forEach((el) => obs.observe(el));
      io = obs;
    }
    const onVis = () => {
      if (document.hidden) stopLoop();
      else if ([...visible.values()].some(Boolean)) startLoop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stopLoop();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      loopWrap?.removeEventListener("pointermove", onMag);
      loopWrap?.removeEventListener("pointerleave", offMag);
      cv.remove();
      // clear any inline styles we wrote
      nodes.forEach((n) => n.style.removeProperty("--lit"));
      members.forEach((m) => m.style.removeProperty("--hot"));
      if (cta) cta.style.transform = "";
    };
  }, [spineSway, glow, spread, tilt]);

  return null;
}
