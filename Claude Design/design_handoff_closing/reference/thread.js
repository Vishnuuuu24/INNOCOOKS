/* ─────────────────────────────────────────────────────────────────────────
   The Thread — a real verlet-integrated strand.
   Gravity + distance constraints give it body and weight; it hangs in a
   catenary, sways, and recoils from the cursor like an actual noodle of
   light. Rendered in stacked passes (wide bloom → core → highlight) so it
   reads as a glowing material strand, not a 1px line.
   ───────────────────────────────────────────────────────────────────────── */

class VerletThread {
  constructor(opts = {}) {
    this.count = opts.count || 48;
    this.gravity = opts.gravity ?? 760;
    this.stiffness = opts.stiffness ?? 1;
    this.damping = opts.damping ?? 0.992;
    this.iterations = opts.iterations ?? 14;

    // tunable look + behaviour — morphed between modes
    this.restY = opts.restY ?? 0.56;      // fraction of height the anchors sit at
    this.sag = opts.sag ?? 150;           // how far the centre dips below anchors
    this.width = opts.width ?? 6;         // core stroke px
    this.glow = opts.glow ?? 1;           // bloom multiplier
    this.alpha = opts.alpha ?? 1;
    this.mouseRadius = opts.mouseRadius ?? 170;
    this.mouseForce = opts.mouseForce ?? 1;
    this.wander = opts.wander ?? 26;      // ambient breeze amplitude

    this.points = [];
    this.segLen = 0;
    this.t = 0;
    this.W = 0; this.H = 0;
    this.settle = 0; // 0→1 intro: line drops into a hang
  }

  build(W, H) {
    this.W = W; this.H = H;
    const ay = H * this.restY;
    this.segLen = (W * 1.06) / (this.count - 1);
    this.points = [];
    for (let i = 0; i < this.count; i++) {
      const f = i / (this.count - 1);
      const x = -W * 0.03 + f * W * 1.06;
      // a gentle parabola so it starts already shaped, then physics takes over
      const y = ay + Math.sin(f * Math.PI) * this.sag * 0.4;
      this.points.push({ x, y, px: x, py: y, pinned: i === 0 || i === this.count - 1 });
    }
  }

  resize(W, H) {
    const prev = this.points.map(p => ({ fx: (p.x) / (this.W || W) }));
    this.build(W, H);
  }

  // route the rest shape through the wordmark for the woven mode
  setWeave(on) { this.weave = on; }

  update(dt, mouse) {
    this.t += dt;
    const g = this.gravity * dt * dt;
    const breeze = Math.sin(this.t * 0.6) * this.wander + Math.sin(this.t * 1.7 + 1.3) * this.wander * 0.4;

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if (p.pinned) continue;
      const vx = (p.x - p.px) * this.damping;
      const vy = (p.y - p.py) * this.damping;
      p.px = p.x; p.py = p.y;
      p.x += vx + breeze * dt;
      p.y += vy + g;

      // cursor recoil
      if (mouse && mouse.active) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const r = this.mouseRadius;
        if (d2 < r * r) {
          const d = Math.sqrt(d2) || 1;
          const fall = (1 - d / r);
          const push = fall * fall * 34 * this.mouseForce;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
      }
    }

    // satisfy distance constraints
    const target = this.segLen;
    for (let k = 0; k < this.iterations; k++) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const a = this.points[i], b = this.points[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const diff = ((d - target) / d) * 0.5 * this.stiffness;
        const ox = dx * diff, oy = dy * diff;
        if (!a.pinned) { a.x += ox; a.y += oy; }
        if (!b.pinned) { b.x -= ox; b.y -= oy; }
      }
      // re-pin anchors to current rest height (morphs smoothly between modes)
      const ay = this.H * this.restY;
      const first = this.points[0], last = this.points[this.points.length - 1];
      first.x = -this.W * 0.03; first.y = ay;
      last.x = this.W * 1.03; last.y = ay;
    }
  }

  _path(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
    }
    const n = pts.length;
    ctx.quadraticCurveTo(pts[n - 2].x, pts[n - 2].y, pts[n - 1].x, pts[n - 1].y);
  }

  // pts optional → draw a sub-range (used for the woven front pass)
  draw(ctx, gold = "#c9a55c", pts = this.points) {
    if (pts.length < 2 || this.alpha <= 0.001) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = this.alpha;

    // wide soft bloom
    ctx.strokeStyle = gold;
    ctx.shadowColor = gold;
    ctx.shadowBlur = 26 * this.glow;
    ctx.globalAlpha = 0.18 * this.alpha * this.glow;
    ctx.lineWidth = this.width * 3.4;
    this._path(ctx, pts); ctx.stroke();

    // mid halo
    ctx.globalAlpha = 0.4 * this.alpha;
    ctx.shadowBlur = 14 * this.glow;
    ctx.lineWidth = this.width * 1.7;
    this._path(ctx, pts); ctx.stroke();

    // body
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 6 * this.glow;
    ctx.lineWidth = this.width;
    this._path(ctx, pts); ctx.stroke();

    // top highlight — gives the strand a lit, rounded surface
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.55 * this.alpha;
    ctx.strokeStyle = "#f4e6c2";
    ctx.lineWidth = Math.max(1, this.width * 0.32);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y - this.width * 0.22);
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2 - this.width * 0.22;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y - this.width * 0.22, xc, yc);
    }
    ctx.stroke();
    ctx.restore();
  }

  // return point at fractional position (for the travelling bead)
  at(f) {
    const i = Math.min(this.points.length - 2, Math.floor(f * (this.points.length - 1)));
    const a = this.points[i], b = this.points[i + 1];
    const local = f * (this.points.length - 1) - i;
    return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
  }
}

window.VerletThread = VerletThread;
