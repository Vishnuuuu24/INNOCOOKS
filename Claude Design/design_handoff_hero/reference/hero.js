/* ─────────────────────────────────────────────────────────────────────────
   Hero orchestration — wires the Thread + Atmosphere to one rAF loop,
   handles the wordmark (rise-in intro, proximity warming, parallax depth),
   and morphs smoothly between the three directions.
   ───────────────────────────────────────────────────────────────────────── */

(function () {
  const GOLD = "#c9a55c";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const atmoCv = document.getElementById("atmo");
  const backCv = document.getElementById("thread-back");
  const frontCv = document.getElementById("thread-front");
  const ax = atmoCv.getContext("2d");
  const bx = backCv.getContext("2d");
  const fx = frontCv.getContext("2d");

  const thread = new VerletThread();
  const atmo = new Atmosphere();

  const wordmark = document.getElementById("wordmark");
  const letters = Array.from(document.querySelectorAll(".ltr"));
  // give each letter a small parallax depth for the dusk mode
  letters.forEach((l, i) => (l._depth = (Math.sin(i * 1.7) * 0.5 + 0.5) * 0.6 + 0.4));

  /* ── direction presets ────────────────────────────────────────────── */
  const MODES = {
    strand: { restY: 0.60, sag: 185, grav: 840, width: 7.5, glow: 1.05, threadAlpha: 1, mouseForce: 1.25, wander: 32, lanternInt: 0.45, moteAlpha: 0.55, weave: 0, parallax: 0.45, bead: 1 },
    dusk:   { restY: 0.70, sag: 120, grav: 320, width: 3.2, glow: 0.85, threadAlpha: 0.72, mouseForce: 0.7, wander: 18, lanternInt: 1.2, moteAlpha: 1.35, weave: 0, parallax: 1.25, bead: 0 },
    woven:  { restY: 0.485, sag: 30, grav: 80, width: 5, glow: 1, threadAlpha: 1, mouseForce: 0.9, wander: 13, lanternInt: 0.7, moteAlpha: 0.7, weave: 1, parallax: 0.6, bead: 0.4 },
  };
  let mode = "strand";
  // current (lerped) values; restY starts high so the thread drops in on load
  const cur = Object.assign({}, MODES.strand, { restY: 0.16, threadAlpha: 0, grav: 840 });

  const mouse = { x: 0, y: 0, active: false };
  let W = 0, H = 0, dpr = 1;

  function size() {
    W = window.innerWidth; H = window.innerHeight;
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

    // anchor each direction's strand to the wordmark's real position so the
    // woven mode laces through the letters and the others hang below them
    const wm = wordmark.getBoundingClientRect();
    const wf = (wm.top + wm.height / 2) / H;
    MODES.strand.restY = Math.min(0.82, wf + 0.20);
    MODES.woven.restY = wf - 0.005;
    MODES.dusk.restY = Math.min(0.86, wf + 0.32);
  }
  size();
  window.addEventListener("resize", size);

  /* ── pointer ──────────────────────────────────────────────────────── */
  if (finePointer && !reduce) {
    window.addEventListener("pointermove", (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      atmo.setLantern(e.clientX, e.clientY);
    });
    window.addEventListener("pointerleave", () => (mouse.active = false));
  } else {
    // touch / no-pointer: lantern wanders on a slow lissajous so it still breathes
    mouse.active = false;
  }

  /* ── wordmark warming + parallax ──────────────────────────────────── */
  function paintLetters(dt) {
    for (const l of letters) {
      const r = l.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

      // warmth from cursor
      let warm = 0;
      if (mouse.active) {
        const d = Math.hypot(cx - mouse.x, cy - mouse.y);
        warm = Math.max(warm, Math.max(0, 1 - d / 240));
      }
      // warmth from the thread itself (woven mode)
      if (cur.weave > 0.2) {
        let best = 1e9;
        for (let i = 0; i < thread.points.length; i += 2) {
          const p = thread.points[i];
          const d = Math.hypot(cx - p.x, cy - p.y);
          if (d < best) best = d;
        }
        warm = Math.max(warm, Math.max(0, 1 - best / 90) * cur.weave);
      }
      l._warm = (l._warm ?? 0) + (warm - (l._warm ?? 0)) * Math.min(1, dt * (warm > l._warm ? 12 : 3));
      l.style.color = mixHex("#f0ebdc", GOLD, l._warm);

      // parallax depth in dusk mode
      if (cur.parallax > 0.7 && mouse.active) {
        const ox = (mouse.x / W - 0.5) * -22 * l._depth * cur.parallax;
        const oy = (mouse.y / H - 0.5) * -14 * l._depth * cur.parallax;
        l.style.transform = `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`;
      } else {
        l.style.transform = "";
      }
    }
  }

  /* ── weave: draw the "over" runs on the front canvas ──────────────── */
  function drawWeave() {
    fx.clearRect(0, 0, W, H);
    if (cur.weave < 0.05) return;
    const pts = thread.points;
    const period = W / 6.5;
    let run = [];
    const flush = () => {
      if (run.length >= 2) { thread.alpha = cur.threadAlpha * cur.weave; thread.draw(fx, GOLD, run); }
      run = [];
    };
    for (const p of pts) {
      const over = Math.floor((p.x + period * 0.5) / period) % 2 === 0;
      if (over) run.push(p); else flush();
    }
    flush();
  }

  /* ── travelling bead (the end of the noodle being pulled) ─────────── */
  let beadF = 0;
  function drawBead(dt) {
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

  /* ── morph current → target ───────────────────────────────────────── */
  function morph(dt) {
    const tgt = MODES[mode];
    const k = Math.min(1, dt * 2.4);
    for (const key in tgt) cur[key] += (tgt[key] - cur[key]) * k;
    thread.restY = cur.restY; thread.sag = cur.sag; thread.width = cur.width;
    thread.glow = cur.glow; thread.alpha = cur.threadAlpha; thread.gravity = cur.grav;
    thread.mouseForce = cur.mouseForce; thread.wander = cur.wander;
    atmo.intensity = cur.lanternInt; atmo.moteAlpha = cur.moteAlpha;
  }

  /* ── loop ─────────────────────────────────────────────────────────── */
  let last = performance.now();
  let autoT = 0;

  function step(dt) {
    morph(dt);

    // ambient lantern drift when there's no cursor
    if (!mouse.active) {
      autoT += dt;
      atmo.setLantern(W * (0.5 + 0.32 * Math.sin(autoT * 0.25)), H * (0.4 + 0.2 * Math.cos(autoT * 0.19)));
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

  function frame(now) {
    let dt = (now - last) / 1000; last = now;
    if (dt > 0.05) dt = 0.05;
    step(dt);
    requestAnimationFrame(frame);
  }

  /* ── reduced motion: one static, composed frame ──────────────────── */
  function staticFrame() {
    Object.assign(cur, MODES.strand, { threadAlpha: 1 });
    morph(1);
    for (let i = 0; i < 60; i++) thread.update(0.016, { active: false });
    atmo.intensity = 0.6; atmo.moteAlpha = 0.5;
    atmo.update(0.1);
    atmo.draw(ax, GOLD);
    thread.draw(bx, GOLD);
    letters.forEach((l) => (l.style.color = "#f0ebdc"));
  }

  if (reduce) {
    document.body.classList.add("ready");
    staticFrame();
  } else {
    // pre-settle the strand so the first painted frame already reads as a
    // composed image (and is robust to rAF throttling in background tabs)
    for (let i = 0; i < 80; i++) step(0.016);
    step(0.016);
    setTimeout(() => document.body.classList.add("ready"), 60);
    last = performance.now();
    requestAnimationFrame(frame);
  }

  /* ── mode switcher ────────────────────────────────────────────────── */
  const DESC = {
    strand: "A single strand of light, hung under its own weight. Push it.",
    dusk: "Depth and air. The light follows you; the type drifts in space.",
    woven: "The Thread laces through the name — over, under, warming each letter it crosses.",
  };
  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mode;
      document.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("on", b === btn));
      const d = document.getElementById("mode-desc");
      d.style.opacity = 0;
      setTimeout(() => { d.textContent = DESC[mode]; d.style.opacity = 1; }, 180);
    });
  });

  /* ── notes drawer ─────────────────────────────────────────────────── */
  const notesBtn = document.getElementById("notes-btn");
  const notes = document.getElementById("notes");
  notesBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("notes-open");
    notesBtn.textContent = open ? "Close notes" : "Build notes";
  });

  /* ── helpers ──────────────────────────────────────────────────────── */
  function mixHex(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    const ca = hex(a), cb = hex(b);
    const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
    const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
    const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
    return `rgb(${r},${g},${bl})`;
  }
  function hex(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // debug/verification hook — drive frames + modes deterministically
  window.__hero = {
    step: (dt) => step(dt || 0.016),
    setMode: (m) => { if (MODES[m]) mode = m; },
    settle: (n) => { for (let i = 0; i < (n || 120); i++) step(0.016); },
  };
})();
