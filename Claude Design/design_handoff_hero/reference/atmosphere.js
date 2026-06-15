/* ─────────────────────────────────────────────────────────────────────────
   Atmosphere — the dusk the Thread hangs in.
   A lantern of gold light that lags behind the cursor, slow-drifting dust
   motes at three depths (parallax), and a couple of ambient glow fields.
   All on one canvas, additive, cheap. Intensity is morphed per mode.
   ───────────────────────────────────────────────────────────────────────── */

class Atmosphere {
  constructor() {
    this.W = 0; this.H = 0;
    this.motes = [];
    this.lantern = { x: 0, y: 0, tx: 0, ty: 0 };
    this.intensity = 1;     // lantern strength (morphed)
    this.moteAlpha = 1;     // dust visibility (morphed)
    this.t = 0;
  }

  build(W, H) {
    this.W = W; this.H = H;
    if (!this.lantern.x) { this.lantern.x = W * 0.7; this.lantern.y = H * 0.4; }
    const target = Math.round((W * H) / 26000);
    this.motes = [];
    for (let i = 0; i < target; i++) this.motes.push(this._mote(true));
  }

  _mote(scatter) {
    const depth = Math.random();             // 0 far → 1 near
    return {
      x: Math.random() * this.W,
      y: scatter ? Math.random() * this.H : this.H + 20,
      r: 0.5 + depth * 1.8,
      depth,
      drift: (Math.random() - 0.5) * 8,
      rise: 6 + depth * 22,
      tw: Math.random() * Math.PI * 2,        // twinkle phase
      tws: 0.6 + Math.random() * 1.2,
    };
  }

  setLantern(x, y) { this.lantern.tx = x; this.lantern.ty = y; }

  update(dt) {
    this.t += dt;
    // lantern eases toward cursor — light has inertia
    this.lantern.x += (this.lantern.tx - this.lantern.x) * Math.min(1, dt * 3.2);
    this.lantern.y += (this.lantern.ty - this.lantern.y) * Math.min(1, dt * 3.2);

    for (const m of this.motes) {
      m.y -= m.rise * dt;
      m.x += Math.sin(this.t * 0.4 + m.tw) * m.drift * dt;
      m.tw += dt * m.tws;
      if (m.y < -20) Object.assign(m, this._mote(false));
    }
  }

  draw(ctx, gold = "#c9a55c") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // ambient fields — fixed, slow breathing
    const breath = 0.85 + Math.sin(this.t * 0.5) * 0.15;
    this._radial(ctx, this.W * 0.78, this.H * 0.12, this.W * 0.5,
      `rgba(201,165,92,${0.10 * this.intensity * breath})`);
    this._radial(ctx, this.W * 0.12, this.H * 0.82, this.W * 0.45,
      `rgba(74,68,160,${0.16 * breath})`);

    // the lantern — follows the cursor
    if (this.intensity > 0.01) {
      this._radial(ctx, this.lantern.x, this.lantern.y, this.W * 0.36 + Math.sin(this.t) * 8,
        `rgba(201,165,92,${0.13 * this.intensity})`);
      this._radial(ctx, this.lantern.x, this.lantern.y, this.W * 0.14,
        `rgba(244,230,194,${0.10 * this.intensity})`);
    }

    // dust
    if (this.moteAlpha > 0.01) {
      for (const m of this.motes) {
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(m.tw));
        const a = tw * (0.12 + m.depth * 0.5) * this.moteAlpha;
        // parallax nudge toward lantern depth
        const px = m.x + (this.lantern.x - this.W / 2) * m.depth * 0.02;
        ctx.beginPath();
        ctx.fillStyle = `rgba(220,205,160,${a})`;
        ctx.shadowColor = gold;
        ctx.shadowBlur = 6 * m.depth;
        ctx.arc(px, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  _radial(ctx, x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.W, this.H);
  }
}

window.Atmosphere = Atmosphere;
