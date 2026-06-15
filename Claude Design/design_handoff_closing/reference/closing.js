/* ─────────────────────────────────────────────────────────────────────────
   Closing act — "The Spine".
   The Thread that carried the hero and the work becomes a vertical spine
   running down through Process → Studio → Start. One bead descends it as you
   scroll: it lights each process station (which lifts forward), blooms into a
   hub-and-spoke constellation across the team, then curls into the loop that
   closes the page around the CTA. One fixed canvas; backdrop melts
   dusk→parch→dusk in OKLab with no seam.
   ───────────────────────────────────────────────────────────────────────── */

(function () {
  const GOLD = "#c9a55c";
  const HI = "#f4e6c2";
  const DUSK = [0x1e, 0x1b, 0x45];
  const PARCH = [0xec, 0xe5, 0xd6];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wide = window.matchMedia("(min-width: 860px)").matches;

  const T = Object.assign({ spineSway: 1, glow: 1, spread: 1, tilt: 1 }, window.CLOSING_TWEAKS || {});

  /* ── reveals (work in every mode) ─────────────────────────────────── */
  const revs = Array.from(document.querySelectorAll(".rv"));
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  revs.forEach((r) => io.observe(r));

  /* ── OKLab backdrop helpers ───────────────────────────────────────── */
  function s2l(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
  function l2s(c){c=c<=0.0031308?c*12.92:1.055*Math.pow(c,1/2.4)-0.055;return Math.round(Math.max(0,Math.min(1,c))*255);}
  function rgb2oklab([r,g,b]){r=s2l(r);g=s2l(g);b=s2l(b);
    const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
    const m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
    const s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
    return [0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s];}
  function oklab2rgb([L,a,bb]){const l_=L+0.3963377774*a+0.2158037573*bb,m_=L-0.1055613458*a-0.0638541728*bb,s_=L-0.0894841775*a-1.2914855480*bb;
    const l=l_*l_*l_,m=m_*m_*m_,s=s_*s_*s_;
    return [l2s(4.0767416621*l-3.3077115913*m+0.2309699292*s),l2s(-1.2684380046*l+2.6097574011*m-0.3413193965*s),l2s(-0.0041960863*l-0.7034186147*m+1.7076147010*s)];}
  const DUSK_OK=rgb2oklab(DUSK), PARCH_OK=rgb2oklab(PARCH);
  const smooth=(t)=>t*t*(3-2*t);
  function mix(t){ // t: 0=dusk, 1=parch
    const k=smooth(Math.max(0,Math.min(1,t)));
    const c=oklab2rgb([DUSK_OK[0]+(PARCH_OK[0]-DUSK_OK[0])*k,DUSK_OK[1]+(PARCH_OK[1]-DUSK_OK[1])*k,DUSK_OK[2]+(PARCH_OK[2]-DUSK_OK[2])*k]);
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  /* ── static fallback ──────────────────────────────────────────────── */
  if (reduce || !wide) {
    document.body.classList.add("static", "on-parch");
    wireNotes(); wireTweaks(true);
    return;
  }

  const backdrop = document.getElementById("backdrop");
  const cv = document.getElementById("spine");
  const ctx = cv.getContext("2d");

  const processEl = document.getElementById("process");
  const studioEl = document.getElementById("studio");
  const startEl = document.getElementById("start");
  const nodes = Array.from(document.querySelectorAll(".node"));
  const steps = Array.from(document.querySelectorAll(".step"));
  const hub = document.querySelector("[data-hub]");
  const members = Array.from(document.querySelectorAll("[data-member]"));
  const loopWrap = document.getElementById("loop-wrap");
  const cta = document.getElementById("cta");
  const parEls = Array.from(document.querySelectorAll("[data-par]"));

  let W = 0, H = 0, dpr = 1, centerX = 0;
  function size() {
    W = window.innerWidth; H = window.innerHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(document.querySelector(".container-x"));
    centerX = W / 2;
    placeMembers();
  }

  /* members fan around the hub (radial) */
  function placeMembers() {
    const wrap = document.getElementById("constellation");
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const cx = r.width / 2, cy = r.height / 2;
    const radX = Math.min(r.width * 0.40, 460) * T.spread;
    const radY = Math.min(r.height * 0.40, 230) * T.spread;
    const start = -Math.PI / 2; // top
    members.forEach((m, i) => {
      const a = start + (i / members.length) * Math.PI * 2;
      const x = cx + Math.cos(a) * radX;
      const y = cy + Math.sin(a) * radY;
      m.style.left = x + "px";
      m.style.top = y + "px";
    });
  }

  /* ── spine: a vertical chain of points, gentle sway + cursor push ─── */
  const SEG = 60;
  const spine = [];
  for (let i = 0; i <= SEG; i++) spine.push({ x: 0, y: 0, vx: 0 });
  let topY = 0, botY = 0;
  function rebuildSpineBounds() {
    // spine spans from just above the process head to the CTA loop centre
    const pr = processEl.getBoundingClientRect();
    const sr = startEl.getBoundingClientRect();
    topY = window.scrollY + pr.top - H * 0.3;
    botY = window.scrollY + sr.top + sr.height * 0.62;
  }

  /* pointer */
  const mouse = { x: -1, y: -1, active: false };
  let tiltX = 0, tiltY = 0, tTiltX = 0, tTiltY = 0;
  if (finePointer) {
    window.addEventListener("pointermove", (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      tTiltY = (e.clientX / W - 0.5);
      tTiltX = (e.clientY / H - 0.5);
    });
    window.addEventListener("pointerleave", () => { mouse.active = false; tTiltX = 0; tTiltY = 0; });
  }

  /* magnetic CTA */
  let magX = 0, magY = 0, tMagX = 0, tMagY = 0;
  if (finePointer && cta) {
    loopWrap.addEventListener("pointermove", (e) => {
      const r = cta.getBoundingClientRect();
      tMagX = (e.clientX - (r.left + r.width / 2)) * 0.3;
      tMagY = (e.clientY - (r.top + r.height / 2)) * 0.3;
    });
    loopWrap.addEventListener("pointerleave", () => { tMagX = 0; tMagY = 0; });
  }

  /* scroll progress over the whole closing region */
  let prog = 0;
  function readScroll() {
    rebuildSpineBounds();
    const total = botY - topY;
    prog = Math.max(0, Math.min(1, (window.scrollY + H * 0.5 - topY) / total));
    // backdrop: dusk(lead) -> parch(process/studio) -> dusk(start)
    const pr = processEl.getBoundingClientRect();
    const sr = startEl.getBoundingClientRect();
    // ramp up to parch as Process rises into view
    const parchIn = Math.max(0, Math.min(1, (H * 0.92 - pr.top) / (H * 0.62)));
    // ramp back to dusk as Start rises into view
    const duskOut = Math.max(0, Math.min(1, sr.top / (H * 0.7)));
    const parch = Math.min(parchIn, duskOut);
    backdrop.style.backgroundColor = mix(parch);
    document.body.classList.toggle("on-parch", parch > 0.5);
  }
  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", () => { size(); readScroll(); });

  /* ── draw helpers ─────────────────────────────────────────────────── */
  function strand(pts, width, alpha, color) {
    if (pts.length < 2) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const passes = [
      { w: width * 3.4, a: 0.05 * alpha * T.glow },
      { w: width * 2.0, a: 0.10 * alpha * T.glow },
      { w: width, a: 0.85 * alpha },
      { w: width * 0.42, a: 0.95 * alpha, c: HI },
    ];
    for (const ps of passes) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = ps.c || color; ctx.globalAlpha = ps.a; ctx.lineWidth = ps.w;
      ctx.stroke();
    }
    ctx.restore();
  }
  function bead(x, y, s, str) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5 * str;
    ctx.fillStyle = "rgba(201,165,92,0.5)";
    ctx.beginPath(); ctx.arc(x, y, 16 * s, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = str;
    ctx.shadowColor = GOLD; ctx.shadowBlur = 24;
    ctx.fillStyle = HI;
    ctx.beginPath(); ctx.arc(x, y, 4 * s, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* ── per-frame ────────────────────────────────────────────────────── */
  let tsec = 0;
  function frame(now) {
    const dt = Math.min(0.05, (frame._l ? (now - frame._l) / 1000 : 0.016));
    frame._l = now; tsec += dt;

    readScroll(); // recompute bounds, progress & backdrop every frame (robust to missing scroll events)

    tiltX += (tTiltX - tiltX) * Math.min(1, dt * 5);
    tiltY += (tTiltY - tiltY) * Math.min(1, dt * 5);
    magX += (tMagX - magX) * Math.min(1, dt * 8);
    magY += (tMagY - magY) * Math.min(1, dt * 8);
    if (cta) cta.style.transform = `translate(${magX.toFixed(1)}px, ${magY.toFixed(1)}px)`;

    ctx.clearRect(0, 0, W, H);

    // spine sample points in viewport space
    const sway = 26 * T.spineSway, scrollY = window.scrollY;
    const vTop = topY - scrollY, vBot = botY - scrollY;
    for (let i = 0; i <= SEG; i++) {
      const f = i / SEG;
      const y = vTop + (vBot - vTop) * f;
      let x = centerX
        + Math.sin(f * Math.PI * 3 + tsec * 0.5) * sway * (0.5 + 0.5 * Math.sin(f * Math.PI))
        + tiltY * 30 * T.tilt;
      // cursor push
      if (mouse.active) {
        const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 26000) { const d = Math.sqrt(d2) || 1; const force = (1 - d / 161) * 26; x += (dx / d) * force; }
      }
      const p = spine[i];
      p.tx = x; p.ty = y;
      p.x += ((x) - p.x) * Math.min(1, dt * 12);
      p.y = y;
    }
    const litStart = 0.6; // where the spine starts fading into the loop region
    strand(spine, 3.2, 0.34 + 0.66 * inParchView(), GOLD);

    // descending bead position along spine
    const bi = Math.round(prog * SEG);
    const bp = spine[Math.max(0, Math.min(SEG, bi))];

    // PROCESS — light nearest node
    let activeNode = -1, bestD = 1e9;
    nodes.forEach((n, i) => {
      const r = n.getBoundingClientRect();
      const ny = r.top + r.height / 2;
      const d = Math.abs(ny - (bp ? bp.y : -1));
      const lit = Math.max(0, 1 - Math.abs(ny - beadViewportY()) / (H * 0.26));
      n.style.setProperty("--lit", lit.toFixed(3));
      const step = steps[i];
      if (step) {
        const copy = step.querySelector(".copy");
        if (copy) copy.style.transform = `translateZ(0) translateY(${(-lit * 8).toFixed(1)}px)`;
        copy && copy.style.setProperty("opacity", (0.5 + lit * 0.5).toFixed(3));
      }
      // branch stub from spine to node
      if (lit > 0.02) {
        const nx = r.left + r.width / 2;
        strand([{ x: centerX + tiltY * 30 * T.tilt, y: ny }, { x: nx, y: ny }], 1.6, lit * 0.7, GOLD);
      }
      if (d < bestD) { bestD = d; activeNode = i; }
    });

    // STUDIO — constellation threads hub → members
    const hubR = hub ? hub.getBoundingClientRect() : null;
    if (hubR && hubR.bottom > 0 && hubR.top < H) {
      const hx = hubR.left + hubR.width / 2, hy = hubR.top + hubR.height / 2;
      const studioVis = Math.max(0, 1 - Math.abs((hubR.top + hubR.height / 2) - H / 2) / (H * 0.8));
      members.forEach((m) => {
        const r = m.getBoundingClientRect();
        const mx = r.left + r.width / 2, my = r.top + r.height / 2;
        const near = mouse.active ? Math.max(0, 1 - Math.hypot(mx - mouse.x, my - mouse.y) / 240) : 0;
        m.style.setProperty("--hot", near.toFixed(3));
        // a gently bowed thread, swaying
        const midx = (hx + mx) / 2 + Math.sin(tsec * 0.8 + mx) * 10 + (mouse.active ? (mouse.x - (hx + mx) / 2) * 0.05 : 0);
        const midy = (hy + my) / 2 + Math.cos(tsec * 0.7 + my) * 8;
        strand([{ x: hx, y: hy }, { x: midx, y: midy }, { x: mx, y: my }], 1.5, (0.4 + near * 0.6) * studioVis, GOLD);
      });
      bead(hx, hy, 1, 0.5 * studioVis);
    }

    // START — the loop around the CTA
    if (loopWrap) {
      const r = loopWrap.getBoundingClientRect();
      const cx = r.left + r.width / 2 + magX * 0.4, cy = r.top + r.height / 2 + magY * 0.4;
      const rx = r.width / 2 + 26, ry = r.height / 2 + 18;
      const vis = Math.max(0, 1 - Math.abs(cy - H / 2) / (H * 0.7));
      if (vis > 0.02) {
        const close = smooth(Math.max(0, Math.min(1, (prog - 0.82) / 0.16))); // draws shut near the end
        const loopPts = [];
        const segs = 60;
        const span = Math.PI * 2 * close;
        const a0 = -Math.PI / 2;
        for (let i = 0; i <= segs; i++) {
          const a = a0 + span * (i / segs);
          loopPts.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
        }
        strand(loopPts, 2.4, vis, GOLD);
        // bead rides the loop head
        if (close > 0.01) {
          const a = a0 + span;
          bead(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 1, vis * (0.6 + 0.4 * close));
        }
      }
    }

    // the descending bead (visible across process/studio, before the loop closes)
    if (bp && prog < 0.86) bead(bp.x, bp.y, 1, 0.4 + 0.6 * inParchView());

    // parallax lead/tail
    for (const el of parEls) {
      const f = parseFloat(el.dataset.par) || 0;
      const rr = el.getBoundingClientRect();
      const off = (rr.top + rr.height / 2) - H / 2;
      el.style.transform = `translateY(${(-off * f).toFixed(1)}px)`;
    }

    requestAnimationFrame(frame);
  }
  function beadViewportY() { const bi = Math.round(prog * SEG); const bp = spine[Math.max(0, Math.min(SEG, bi))]; return bp ? bp.y : -1; }
  function inParchView() { return document.body.classList.contains("on-parch") ? 1 : 0.5; }

  size();
  rebuildSpineBounds();
  for (let i = 0; i <= SEG; i++) { spine[i].x = centerX; }
  readScroll();
  requestAnimationFrame(frame);

  wireNotes(); wireTweaks(false);

  window.__closing = {
    scrollFrac: (f) => { const total = document.body.scrollHeight - H; window.scrollTo(0, total * f); },
  };

  /* ── chrome ───────────────────────────────────────────────────────── */
  function wireNotes() {
    const btn = document.getElementById("notes-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = document.body.classList.toggle("notes-open");
      btn.textContent = open ? "Close notes" : "Build notes";
    });
  }
  function wireTweaks(staticMode) {
    const controls = document.getElementById("tw-controls");
    if (!controls) return;
    const defs = [
      { key: "spineSway", label: "Spine sway", min: 0, max: 2, step: 0.05, fmt: (v) => v.toFixed(2) },
      { key: "glow", label: "Glow", min: 0.3, max: 1.8, step: 0.05, fmt: (v) => v.toFixed(2) },
      { key: "spread", label: "Constellation spread", min: 0.7, max: 1.3, step: 0.02, fmt: (v) => v.toFixed(2) },
      { key: "tilt", label: "Cursor tilt", min: 0, max: 2, step: 0.05, fmt: (v) => v.toFixed(2) },
    ];
    defs.forEach((d) => {
      const wrap = document.createElement("div"); wrap.className = "tw";
      const lab = document.createElement("label");
      const val = document.createElement("b"); val.textContent = d.fmt(T[d.key]);
      lab.appendChild(document.createTextNode(d.label)); lab.appendChild(val);
      const inp = document.createElement("input");
      inp.type = "range"; inp.min = d.min; inp.max = d.max; inp.step = d.step; inp.value = T[d.key];
      inp.addEventListener("input", () => {
        const v = parseFloat(inp.value); T[d.key] = v; val.textContent = d.fmt(v);
        if (d.key === "spread" && !staticMode) placeMembers();
        window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [d.key]: v } }, "*");
      });
      wrap.appendChild(lab); wrap.appendChild(inp); controls.appendChild(wrap);
    });
    window.addEventListener("message", (e) => {
      const ty = e.data && e.data.type;
      if (ty === "__activate_edit_mode") document.body.classList.add("tweaks-open");
      else if (ty === "__deactivate_edit_mode") document.body.classList.remove("tweaks-open");
    });
    const close = document.getElementById("tw-close");
    if (close) close.addEventListener("click", () => {
      document.body.classList.remove("tweaks-open");
      window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
    });
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  }
})();
