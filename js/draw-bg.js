'use strict';

/* =========================================================
   Arka plan: gökyüzü, bulutlar, tepeler, ağaç hattı, zemin
   ========================================================= */

function drawSky() {
  const sky = ctx.createLinearGradient(0, 0, 0, view.groundY);
  sky.addColorStop(0, '#a5d7e6');
  sky.addColorStop(0.5, '#cfe8dd');
  sky.addColorStop(1, '#f1eecb');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, view.W, view.groundY);

  const sx = view.W * 0.79;
  const sy = view.H * 0.17;

  const glow = ctx.createRadialGradient(sx, sy, 8, sx, sy, 150);
  glow.addColorStop(0, 'rgba(255, 244, 191, 0.85)');
  glow.addColorStop(0.35, 'rgba(255, 238, 170, 0.32)');
  glow.addColorStop(1, 'rgba(255, 238, 170, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sx - 160, sy - 160, 320, 320);

  fillEllipse(ctx, sx, sy, 46, 46, '#fff3bd');
  fillEllipse(ctx, sx - 10, sy - 10, 32, 32, 'rgba(255, 250, 214, 0.7)');
}

function drawCloud(x, y, s) {
  ctx.fillStyle = 'rgba(255, 253, 244, 0.82)';
  ctx.beginPath();
  ctx.ellipse(x, y, 48 * s, 20 * s, 0, 0, TAU);
  ctx.ellipse(x - 34 * s, y + 5 * s, 26 * s, 14 * s, 0, 0, TAU);
  ctx.ellipse(x + 34 * s, y + 4 * s, 30 * s, 15 * s, 0, 0, TAU);
  ctx.ellipse(x - 8 * s, y - 13 * s, 28 * s, 18 * s, 0, 0, TAU);
  ctx.ellipse(x + 18 * s, y - 10 * s, 22 * s, 15 * s, 0, 0, TAU);
  ctx.fill();

  ctx.fillStyle = 'rgba(214, 232, 228, 0.4)';
  ctx.beginPath();
  ctx.ellipse(x, y + 12 * s, 50 * s, 8 * s, 0, 0, TAU);
  ctx.fill();
}

function drawClouds() {
  for (const c of clouds) drawCloud(c.x, c.y, c.s);
}

function drawBirds() {
  const off = (state.distance * 0.03) % (view.W + 300);
  ctx.strokeStyle = 'rgba(60, 92, 80, 0.4)';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';

  for (let i = 0; i < 3; i++) {
    const x = ((i * 210 + 420 - off + view.W * 3) % (view.W + 260)) - 130;
    const y = view.H * 0.16 + i * 34 + Math.sin(state.time * 0.7 + i) * 4;
    const flap = Math.sin(state.time * 5 + i * 2) * 3;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.quadraticCurveTo(x - 3, y - 5 - flap, x, y);
    ctx.quadraticCurveTo(x + 3, y - 5 - flap, x + 8, y);
    ctx.stroke();
  }
}

function drawHills() {
  const gy = view.groundY;

  /* uzak tepeler */
  const off1 = state.distance * 0.09;
  ctx.beginPath();
  ctx.moveTo(0, gy);
  for (let x = 0; x <= view.W + 20; x += 22) {
    const y = gy - 150
      - Math.sin((x + off1) * 0.0034) * 46
      - Math.sin((x + off1) * 0.0011 + 1.7) * 34;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(view.W, gy);
  ctx.closePath();
  ctx.fillStyle = '#b9d5a8';
  ctx.fill();

  /* yakın tepeler */
  const off2 = state.distance * 0.16;
  ctx.beginPath();
  ctx.moveTo(0, gy);
  for (let x = 0; x <= view.W + 20; x += 18) {
    const y = gy - 92
      - Math.sin((x + off2) * 0.0047 + 0.8) * 40
      - Math.sin((x + off2) * 0.0017 + 4.2) * 20;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(view.W, gy);
  ctx.closePath();
  ctx.fillStyle = '#a2c68c';
  ctx.fill();
}

/* Arka plandaki ağaç hattı */
function drawTreeLine() {
  const spacing = 190;
  const gy = view.groundY;

  const start = Math.floor((state.distance * 0.42) / spacing) - 1;
  const count = Math.ceil(view.W / spacing) + 3;

  for (let i = start; i < start + count; i++) {
    const x = i * spacing - (state.distance * 0.42);
    const seed = hash(i);
    const s = 0.75 + seed * 0.6;
    const h = 70 + seed * 55;
    const trunkColor = '#648f50';
    const leafDark = '#79a85f';
    const leafLight = '#8fbb72';

    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = 6 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, gy + 2);
    ctx.lineTo(x, gy - h * 0.5);
    ctx.stroke();

    fillEllipse(ctx, x, gy - h * 0.75, 34 * s, 30 * s, leafDark);
    fillEllipse(ctx, x - 20 * s, gy - h * 0.62, 22 * s, 20 * s, leafDark);
    fillEllipse(ctx, x + 18 * s, gy - h * 0.6, 21 * s, 19 * s, leafDark);
    fillEllipse(ctx, x - 6 * s, gy - h * 0.86, 22 * s, 17 * s, leafLight);
    fillEllipse(ctx, x + 14 * s, gy - h * 0.78, 14 * s, 12 * s, leafLight);
  }
}

function drawGround() {
  const gy = view.groundY;
  const W = view.W;

  /* toprak */
  const dirt = ctx.createLinearGradient(0, gy, 0, view.H);
  dirt.addColorStop(0, '#b18a5e');
  dirt.addColorStop(1, '#8a6846');
  ctx.fillStyle = dirt;
  ctx.fillRect(0, gy, W, view.H - gy);

  /* çim şeridi */
  ctx.fillStyle = '#6f9e4d';
  ctx.fillRect(0, gy, W, 18);
  ctx.fillStyle = '#7fae58';
  ctx.fillRect(0, gy, W, 10);
  ctx.fillStyle = '#96c46b';
  ctx.fillRect(0, gy, W, 4);
  ctx.fillStyle = 'rgba(50, 82, 38, 0.35)';
  ctx.fillRect(0, gy + 18, W, 3);

  /* toprak katmanları */
  ctx.fillStyle = 'rgba(92, 66, 42, 0.15)';
  for (let i = 0; i < 3; i++) {
    const y = gy + 48 + i * 34;
    ctx.fillRect(0, y, W, 2);
  }

  /* çakıllar */
  const pebbleSpacing = 83;
  const pStart = Math.floor(state.distance / pebbleSpacing) - 1;
  const pCount = Math.ceil(W / pebbleSpacing) + 3;
  for (let i = pStart; i < pStart + pCount; i++) {
    const x = i * pebbleSpacing - state.distance + hash(i) * 40;
    const y = gy + 30 + hash(i + 7) * (view.H - gy - 44);
    const r = 1.6 + hash(i + 13) * 2.8;
    fillEllipse(ctx, x, y, r * 1.4, r, hash(i + 3) < 0.5 ? 'rgba(120, 90, 60, 0.45)' : 'rgba(222, 194, 152, 0.35)');
  }

  /* çim tutamları ve çiçekler (zeminle aynı hızda) */
  const spacing = 54;
  const start = Math.floor(state.distance / spacing) - 1;
  const count = Math.ceil(W / spacing) + 3;

  for (let i = start; i < start + count; i++) {
    const worldX = i * spacing;
    const x = worldX - state.distance + hash(i) * 28;
    const r = hash(i + 1);

    if (r < 0.2) {
      /* çiçek */
      const color = ['#f4efe2', '#f3b8c6', '#f4dc7a', '#c9b3e6'][Math.floor(hash(i + 9) * 4)];
      const h = 8 + hash(i + 5) * 7;
      ctx.strokeStyle = '#4f7a3d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, gy + 2);
      ctx.quadraticCurveTo(x + 1.5, gy - h * 0.6, x, gy - h);
      ctx.stroke();
      fillEllipse(ctx, x, gy - h, 2.6, 2.6, color);
      fillEllipse(ctx, x, gy - h, 1.1, 1.1, '#eec95d');
    } else if (r < 0.8) {
      /* çim tutamı */
      ctx.strokeStyle = hash(i + 2) < 0.5 ? 'rgba(68, 105, 47, 0.8)' : 'rgba(133, 174, 86, 0.8)';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let b = 0; b < 3; b++) {
        const dx = (b - 1) * 3;
        ctx.moveTo(x + dx * 0.6, gy + 1);
        ctx.quadraticCurveTo(x + dx * 1.4, gy - 5, x + dx * 1.9, gy - 8 - hash(i + b) * 5);
      }
      ctx.stroke();
    }
  }

  /* alt zemin gölgesi */
  ctx.fillStyle = 'rgba(42, 70, 33, 0.45)';
  ctx.fillRect(0, view.H - 10, W, 10);
}
