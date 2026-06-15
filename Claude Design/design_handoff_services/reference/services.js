/* ─────────────────────────────────────────────────────────────────────────
   "What we build" — The Rail.
   The hero's vertical Thread lies down and becomes one *persistent* gold rail
   that lives on a fixed, full-page canvas — it floats through the dusk
   lead-in, the four service cards rise onto it in the pinned stage, and it
   carries on down into the next section. Scroll drives one progress value
   p ∈ [0, N-1]; every card's transform is a pure function of (i − p).
   One full-viewport backdrop is colour-lerped in OKLab by scroll
   (dusk → parchment → dusk), so the melt has no bands and no visible seam.
   ───────────────────────────────────────────────────────────────────────── */

(function () {
  const GOLD = "#c9a55c";
  const DUSK = [0x1e, 0x1b, 0x45];
  const PARCH = [0xec, 0xe5, 0xd6];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const desktop = window.matchMedia("(min-width: 860px)").matches;

  /* tweakable values (persisted via the host) */
  const T = Object.assign(
    { neighbourOpacity: 1, cardSpacing: 212, cardDepth: 230, sceneTilt: 1 },
    window.SERVICES_TWEAKS || {}
  );

  /* ── content ──────────────────────────────────────────────────────── */
  const SERVICES = [
    {
      kicker: "Websites",
      title: "Websites & storefronts",
      outcome:
        "A site that makes your business look as good as it actually is — fast, found on Google, built to turn visitors into enquiries.",
      svg: `<svg viewBox="0 0 120 80" fill="none"><rect x="4" y="6" width="112" height="68" rx="6" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="22" x2="116" y2="22" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="14" r="2" fill="currentColor"/><circle cx="22" cy="14" r="2" fill="currentColor"/><path d="M16 44 h40 M16 54 h28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="72" y="38" width="32" height="22" rx="3" stroke="currentColor" stroke-width="1.5"/></svg>`,
    },
    {
      kicker: "Systems",
      title: "Internal management systems",
      outcome:
        "Clients, staff, stock and appointments in one calm dashboard — instead of spreadsheets, notebooks and WhatsApp threads.",
      svg: `<svg viewBox="0 0 120 80" fill="none"><rect x="6" y="8" width="44" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/><rect x="70" y="8" width="44" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/><rect x="38" y="48" width="44" height="26" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M28 36 C 28 44, 52 40, 56 48 M92 36 C 92 44, 68 40, 64 48" stroke="currentColor" stroke-width="1.5"/></svg>`,
    },
    {
      kicker: "Intelligence",
      title: "AI workflows & agents",
      outcome:
        "Assistants that answer customers, qualify leads and handle the repetitive thinking — trained on your business, working around the clock.",
      svg: `<svg viewBox="0 0 120 80" fill="none"><rect x="8" y="14" width="50" height="24" rx="12" stroke="currentColor" stroke-width="1.5"/><rect x="62" y="44" width="50" height="24" rx="12" stroke="currentColor" stroke-width="1.5"/><path d="M22 24 h22 M76 54 h22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M58 28 C 66 32, 60 40, 66 46" stroke="currentColor" stroke-width="1.5"/></svg>`,
    },
    {
      kicker: "Automation",
      title: "Automation & operations",
      outcome:
        "Invoices generated, reminders sent, reports compiled — the busywork runs itself, accurately, every single time.",
      svg: `<svg viewBox="0 0 120 80" fill="none"><rect x="10" y="10" width="40" height="52" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M18 22 h24 M18 32 h24 M18 42 h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M56 36 h22 m0 0 l-6 -6 m6 6 l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="96" cy="36" r="14" stroke="currentColor" stroke-width="1.5"/><path d="M90 36 l4 4 l8 -9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    },
  ];
  const N = SERVICES.length;

  /* ── build cards ──────────────────────────────────────────────────── */
  const rail3d = document.getElementById("rail3d");
  const dotsWrap = document.getElementById("dots");
  const countCur = document.getElementById("count-cur");
  const backdrop = document.getElementById("backdrop");
  const pad = (n) => String(n + 1).padStart(2, "0");

  const cards = SERVICES.map((s, i) => {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.innerHTML = `
      <div class="card3d" data-i="${i}">
        <article class="card" style="--warm:0">
          <span class="num" aria-hidden="true">${pad(i)}</span>
          <div class="body">
            <div class="topline">
              <span class="kicker">${s.kicker}</span>
              <span class="idx">${pad(i)} / ${pad(N - 1)}</span>
            </div>
            <h3 class="display">${s.title}</h3>
            <p class="outcome">${s.outcome}</p>
            <span class="read">Explore <span class="arr" aria-hidden="true">→</span></span>
          </div>
          <div class="figure">${s.svg}</div>
        </article>`;
    rail3d.appendChild(slot);
    return slot.querySelector(".card3d");
  });

  const dots = SERVICES.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Go to ${SERVICES[i].title}`);
    b.addEventListener("click", () => scrollToIndex(i));
    dotsWrap.appendChild(b);
    return b;
  });

  /* ── colour helpers — proper OKLab lerp (matches their seam system) ── */
  function s2l(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function l2s(c) { c = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.round(Math.max(0, Math.min(1, c)) * 255); }
  function rgb2oklab([r, g, b]) {
    r = s2l(r); g = s2l(g); b = s2l(b);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
      0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    ];
  }
  function oklab2rgb([L, a, bb]) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * bb;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * bb;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * bb;
    const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    return [
      l2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      l2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      l2s(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
    ];
  }
  const DUSK_OK = rgb2oklab(DUSK), PARCH_OK = rgb2oklab(PARCH);
  const smooth = (t) => t * t * (3 - 2 * t);
  function backdropFor(t) {
    const k = smooth(Math.max(0, Math.min(1, t)));
    const c = oklab2rgb([
      DUSK_OK[0] + (PARCH_OK[0] - DUSK_OK[0]) * k,
      DUSK_OK[1] + (PARCH_OK[1] - DUSK_OK[1]) * k,
      DUSK_OK[2] + (PARCH_OK[2] - DUSK_OK[2]) * k,
    ]);
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  /* ── static fallback (mobile / reduced motion) ──────────────────── */
  if (reduce || !desktop) {
    document.body.classList.add("static", "ready", "on-parch");
    wireNotes();
    return;
  }

  /* ── canvas + thread (fixed, full viewport, persistent) ──────────── */
  const cv = document.getElementById("rail");
  const ctx = cv.getContext("2d");
  const thread = new VerletThread({ count: 46, sag: 44, wander: 11, mouseForce: 0.9 });
  thread.glow = 0.85;

  let W = 0, H = 0, dpr = 1, cardW = 520, fit = 1;
  const stage = document.getElementById("stage");
  const scene = document.getElementById("scene");
  const scroller = document.getElementById("scroller");
  const head = document.querySelector(".head");
  const parEls = Array.from(document.querySelectorAll("[data-par]"));

  function size() {
    W = window.innerWidth; H = window.innerHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cardW = Math.max(360, Math.min(560, Math.round(W * 0.46)));
    document.documentElement.style.setProperty("--cardW", cardW + "px");
    fit = Math.max(0.8, Math.min(1, H / 880));

    thread.restY = 0.5;          // horizontal Thread through the centre
    thread.build(W, H);
  }

  /* ── pointer → scene tilt + thread recoil (whole window) ─────────── */
  const mouse = { x: 0, y: 0, active: false };
  let tiltX = 0, tiltY = 0, tTiltX = 0, tTiltY = 0;
  if (finePointer) {
    window.addEventListener("pointermove", (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      tTiltY = (mouse.x / W - 0.5) * 9;
      tTiltX = -(mouse.y / H - 0.5) * 6;
    });
    window.addEventListener("pointerleave", () => { mouse.active = false; tTiltX = 0; tTiltY = 0; });
  }

  /* ── scroll → progress p + global melt t ─────────────────────────── */
  let p = 0, pTarget = 0, t = 0;
  function readScroll() {
    const r = scroller.getBoundingClientRect();
    const total = r.height - H;
    const passed = Math.min(Math.max(-r.top, 0), total);
    pTarget = total > 0 ? (passed / total) * (N - 1) : 0;

    // melt: dusk(0) before, parch(1) while pinned, dusk(0) after.
    // ramps happen over R px of approach / exit — i.e. inside the empty gaps.
    const R = H * 0.8;
    if (r.top >= R) t = 0;
    else if (r.top > 0) t = 1 - r.top / R;
    else if (r.bottom > H) t = 1;
    else if (r.bottom > H - R) t = (r.bottom - (H - R)) / R;
    else t = 0;
  }
  function scrollToIndex(i) {
    const r = scroller.getBoundingClientRect();
    const total = r.height - H;
    const top = window.scrollY + r.top + (i / (N - 1)) * total;
    window.scrollTo({ top, behavior: "smooth" });
  }
  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", () => { size(); readScroll(); });
  size(); readScroll(); p = pTarget;

  /* ── per-card 3D transform — cards advance VERTICALLY (d = i − p) ── */
  let lastActive = -1;
  function layout() {
    const vGap = T.cardSpacing * fit;
    for (let i = 0; i < N; i++) {
      const d = i - p;
      const ad = Math.min(2.6, Math.abs(d));
      const ty = d * vGap;                                 // stack down the page
      const tz = -ad * T.cardDepth;                        // focal at front, others recede
      const rotX = -Math.max(-1.2, Math.min(1.2, d)) * 14; // tilt like a turning page
      const sc = 1 - Math.min(1, ad) * 0.07;
      // near cards stay opaque so the top one cleanly covers the overlap
      // (no text bleed-through); only distant cards fade out
      const op = ad <= 1
        ? 1 - ad * (1 - T.neighbourOpacity)
        : Math.max(0, T.neighbourOpacity * (1 - (ad - 1) / 1.1));
      const warm = Math.max(0, 1 - ad * 1.7);
      const c = cards[i];
      c.style.transform =
        `translate(-50%, -50%) translateY(${ty.toFixed(1)}px) ` +
        `translateZ(${tz.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      c.style.opacity = op.toFixed(3);
      c.style.zIndex = String(Math.round(100 - ad * 10));
      c.firstElementChild.style.setProperty("--warm", warm.toFixed(3));
    }
    const active = Math.round(p);
    if (active !== lastActive) {
      lastActive = active;
      dots.forEach((dt, i) => dt.classList.toggle("on", i === active));
      countCur.textContent = pad(active);
    }
    if (head) head.style.transform = `translateY(${(-p * 9).toFixed(1)}px)`;
    document.body.classList.toggle("on-parch", t > 0.5);
  }

  /* ── parallax layers ─────────────────────────────────────────────── */
  function parallax() {
    for (const el of parEls) {
      const f = parseFloat(el.dataset.par) || 0;
      const r = el.getBoundingClientRect();
      const off = (r.top + r.height / 2) - H / 2;
      el.style.transform = `translateY(${(-off * f).toFixed(1)}px)`;
    }
  }

  /* ── focal bead — the warm point the cards cross ─────────────────── */
  function drawBead(strength) {
    if (strength < 0.05) return;
    const pt = thread.at(0.5);
    const pulse = (0.85 + 0.15 * Math.sin(thread.t * 2.2)) * strength;
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

  /* ── loop ─────────────────────────────────────────────────────────── */
  let last = performance.now();
  function step(dt) {
    p += (pTarget - p) * Math.min(1, dt * 9);
    tiltX += (tTiltX - tiltX) * Math.min(1, dt * 6);
    tiltY += (tTiltY - tiltY) * Math.min(1, dt * 6);
    const trx = (tiltX * T.sceneTilt).toFixed(2), trY = (tiltY * T.sceneTilt).toFixed(2);
    scene.style.transform = `scale(${fit.toFixed(3)}) rotateX(${trx}deg) rotateY(${trY}deg)`;

    // backdrop melt + parallax
    backdrop.style.backgroundColor = backdropFor(t);
    layout();
    parallax();

    // the Thread: subtle in dusk, full on the parchment stage
    thread.update(dt, mouse);
    ctx.clearRect(0, 0, W, H);
    thread.alpha = 0.34 + 0.66 * t;
    thread.glow = 0.6 + 0.35 * t;
    thread.width = 5 + 2.5 * t;
    thread.draw(ctx, GOLD);
    drawBead(smooth(Math.max(0, (t - 0.5) / 0.5)));
  }
  function frame(now) {
    let dt = (now - last) / 1000; last = now;
    if (dt > 0.05) dt = 0.05;
    step(dt);
    requestAnimationFrame(frame);
  }

  for (let i = 0; i < 70; i++) { thread.update(0.016, { active: false }); }
  backdrop.style.backgroundColor = backdropFor(t);
  layout(); parallax();
  setTimeout(() => document.body.classList.add("ready"), 60);
  last = performance.now();
  requestAnimationFrame(frame);

  wireNotes();
  wireTweaks();

  // verification / screenshot hook
  window.__rail = {
    setProgress: (v) => { pTarget = Math.max(0, Math.min(N - 1, v)); p = pTarget; layout(); },
    setMelt: (v) => { t = Math.max(0, Math.min(1, v)); backdrop.style.backgroundColor = backdropFor(t); },
    settle: (n) => { for (let i = 0; i < (n || 80); i++) step(0.016); },
  };

  /* ── notes drawer ─────────────────────────────────────────────────── */
  function wireNotes() {
    const btn = document.getElementById("notes-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = document.body.classList.toggle("notes-open");
      btn.textContent = open ? "Close notes" : "Build notes";
    });
  }

  /* ── tweaks panel + host protocol ───────────────────────────── */
  function wireTweaks() {
    const controls = document.getElementById("tw-controls");
    if (!controls) return;
    const defs = [
      { key: "neighbourOpacity", label: "Card solidity", min: 0.4, max: 1, step: 0.05, fmt: (v) => v.toFixed(2) },
      { key: "cardSpacing", label: "Card spacing", min: 150, max: 320, step: 2, fmt: (v) => Math.round(v) + "px" },
      { key: "cardDepth", label: "Stack depth", min: 120, max: 340, step: 5, fmt: (v) => Math.round(v) },
      { key: "sceneTilt", label: "Cursor tilt", min: 0, max: 1.8, step: 0.05, fmt: (v) => v.toFixed(2) },
    ];
    defs.forEach((d) => {
      const wrap = document.createElement("div"); wrap.className = "tw";
      const lab = document.createElement("label");
      const val = document.createElement("b"); val.textContent = d.fmt(T[d.key]);
      lab.appendChild(document.createTextNode(d.label)); lab.appendChild(val);
      const inp = document.createElement("input");
      inp.type = "range"; inp.min = d.min; inp.max = d.max; inp.step = d.step; inp.value = T[d.key];
      inp.addEventListener("input", () => {
        const v = parseFloat(inp.value);
        T[d.key] = v; val.textContent = d.fmt(v);
        layout();
        window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [d.key]: v } }, "*");
      });
      wrap.appendChild(lab); wrap.appendChild(inp); controls.appendChild(wrap);
    });
    // protocol: register listener BEFORE announcing availability
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
