/* InnoCooks — Atmosphere. The dusk the Thread hangs in.
 * A lantern of gold light that lags behind the cursor, slow-drifting dust
 * motes at three parallax depths, and two ambient glow fields.
 * One canvas, additive, cheap. Framework-agnostic. */

interface Mote {
  x: number; y: number; r: number; depth: number;
  drift: number; rise: number; tw: number; tws: number;
}

export class Atmosphere {
  W = 0;
  H = 0;
  motes: Mote[] = [];
  lantern = { x: 0, y: 0, tx: 0, ty: 0 };
  intensity = 1;
  moteAlpha = 1;
  t = 0;

  build(W: number, H: number) {
    this.W = W;
    this.H = H;
    if (!this.lantern.x) { this.lantern.x = W * 0.7; this.lantern.y = H * 0.4; }
    const target = Math.round((W * H) / 26000);
    this.motes = [];
    for (let i = 0; i < target; i++) this.motes.push(this.makeMote(true));
  }

  private makeMote(scatter: boolean): Mote {
    const depth = Math.random();
    return {
      x: Math.random() * this.W,
      y: scatter ? Math.random() * this.H : this.H + 20,
      r: 0.5 + depth * 1.8,
      depth,
      drift: (Math.random() - 0.5) * 8,
      rise: 6 + depth * 22,
      tw: Math.random() * Math.PI * 2,
      tws: 0.6 + Math.random() * 1.2,
    };
  }

  setLantern(x: number, y: number) { this.lantern.tx = x; this.lantern.ty = y; }

  update(dt: number) {
    this.t += dt;
    this.lantern.x += (this.lantern.tx - this.lantern.x) * Math.min(1, dt * 3.2);
    this.lantern.y += (this.lantern.ty - this.lantern.y) * Math.min(1, dt * 3.2);

    for (const m of this.motes) {
      m.y -= m.rise * dt;
      m.x += Math.sin(this.t * 0.4 + m.tw) * m.drift * dt;
      m.tw += dt * m.tws;
      if (m.y < -20) Object.assign(m, this.makeMote(false));
    }
  }

  draw(ctx: CanvasRenderingContext2D, gold = "#c9a55c") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const breath = 0.85 + Math.sin(this.t * 0.5) * 0.15;
    this.radial(ctx, this.W * 0.78, this.H * 0.12, this.W * 0.5,
      `rgba(201,165,92,${0.1 * this.intensity * breath})`);
    this.radial(ctx, this.W * 0.12, this.H * 0.82, this.W * 0.45,
      `rgba(74,68,160,${0.16 * breath})`);

    if (this.intensity > 0.01) {
      this.radial(ctx, this.lantern.x, this.lantern.y, this.W * 0.36 + Math.sin(this.t) * 8,
        `rgba(201,165,92,${0.13 * this.intensity})`);
      this.radial(ctx, this.lantern.x, this.lantern.y, this.W * 0.14,
        `rgba(244,230,194,${0.1 * this.intensity})`);
    }

    if (this.moteAlpha > 0.01) {
      for (const m of this.motes) {
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(m.tw));
        const a = tw * (0.12 + m.depth * 0.5) * this.moteAlpha;
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

  private radial(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.W, this.H);
  }
}
