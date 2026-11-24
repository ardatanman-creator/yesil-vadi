'use strict';

/* =========================================================
   Engeller, altınlar ve parçacıklar
   ========================================================= */

function drawObstacle(o) {
  const gy = view.groundY;
  const x = o.x;
  const w = o.w;
  const h = o.h;

  fillEllipse(ctx, x + 4, gy + 3, w * 0.56, 7, 'rgba(48, 72, 38, 0.22)');

  switch (o.kind) {
    case 'rock': {
      fillEllipse(ctx, x, gy - h * 0.42, w * 0.52, h * 0.52, '#8f948a');
      fillEllipse(ctx, x - w * 0.13, gy - h * 0.62, w * 0.34, h * 0.3, '#a8ac9f');
      fillEllipse(ctx, x + w * 0.2, gy - h * 0.28, w * 0.22, h * 0.14, '#6f9b56');
      fillEllipse(ctx, x - w * 0.3, gy - h * 0.2, w * 0.16, h * 0.12, '#7ba85f');
      fillEllipse(ctx, x + w * 0.05, gy - h * 0.75, w * 0.14, h * 0.08, 'rgba(255, 255, 245, 0.35)');
      break;
    }
    case 'stump': {
      fillRoundRect(ctx, x - w * 0.34, gy - h, w * 0.68, h, 6, '#7a5636');
      fillRoundRect(ctx, x - w * 0.44, gy - 10, w * 0.22, 10, 4, '#6c4b2e');
      fillRoundRect(ctx, x + w * 0.24, gy - 9, w * 0.2, 9, 4, '#6c4b2e');
      fillEllipse(ctx, x, gy - h, w * 0.36, h * 0.12, '#c69c68');
      ctx.strokeStyle = 'rgba(132, 94, 58, 0.7)';
      ctx.lineWidth = 1.6;
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(x, gy - h, w * (0.36 - i * 0.09), h * (0.12 - i * 0.03), 0, 0, TAU);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 235, 200, 0.16)';
      ctx.fillRect(x - w * 0.28, gy - h + 6, 4, h - 12);
      fillEllipse(ctx, x + w * 0.12, gy - h * 0.2, w * 0.14, h * 0.08, '#5f8f4b');
      break;
    }
    case 'fence': {
      const x0 = x - w / 2;
      const posts = 3;
      for (let i = 0; i < posts; i++) {
        const px = x0 + (w / (posts - 1)) * i;
        fillRoundRect(ctx, px - 5, gy - h, 10, h, 2, '#9a6b41');
        fillRoundRect(ctx, px - 5, gy - h - 6, 10, 9, 2, '#b07d4f');
        ctx.fillStyle = 'rgba(255, 235, 200, 0.18)';
        ctx.fillRect(px - 3, gy - h + 3, 2, h - 8);
      }
      ctx.fillStyle = '#b0824f';
      ctx.fillRect(x0, gy - h * 0.72, w, 6);
      ctx.fillRect(x0, gy - h * 0.42, w, 6);
      ctx.fillStyle = 'rgba(255, 235, 200, 0.22)';
      ctx.fillRect(x0, gy - h * 0.72, w, 2);
      fillEllipse(ctx, x - w * 0.34, gy - 2, 12, 4, '#5f8f4b');
      fillEllipse(ctx, x + w * 0.3, gy - 2, 10, 3.5, '#5f8f4b');
      break;
    }
    case 'log': {
      fillRoundRect(ctx, x - w / 2, gy - h, w, h, h / 2, '#7d5737');
      fillRoundRect(ctx, x - w / 2, gy - h, w, h * 0.42, h * 0.21, '#966b41');
      ctx.strokeStyle = 'rgba(88, 58, 32, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const lx = x - w * 0.3 + i * (w * 0.2);
        ctx.beginPath();
        ctx.moveTo(lx, gy - h + 6);
        ctx.quadraticCurveTo(lx + 6, gy - h * 0.55, lx + 2, gy - 4);
        ctx.stroke();
      }
      fillEllipse(ctx, x + w / 2 - 8, gy - h * 0.5, h * 0.3, h * 0.5, '#c69c68');
      ctx.strokeStyle = 'rgba(140, 100, 62, 0.75)';
      ctx.lineWidth = 1.4;
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(x + w / 2 - 8, gy - h * 0.5, h * (0.3 - i * 0.07), h * (0.5 - i * 0.11), 0, 0, TAU);
        ctx.stroke();
      }
      fillEllipse(ctx, x - w * 0.04, gy - h, w * 0.18, 5, '#6f9b56');
      fillEllipse(ctx, x - w * 0.24, gy - h + 2, w * 0.09, 4, '#7ba85f');
      break;
    }
    case 'bush': {
      fillEllipse(ctx, x, gy - h * 0.34, w * 0.5, h * 0.34, '#3f7c42');
      fillEllipse(ctx, x - w * 0.24, gy - h * 0.5, w * 0.3, h * 0.28, '#4c8f4c');
      fillEllipse(ctx, x + w * 0.24, gy - h * 0.48, w * 0.28, h * 0.26, '#478749');
      fillEllipse(ctx, x, gy - h * 0.72, w * 0.28, h * 0.18, '#62a55a');
      fillEllipse(ctx, x - w * 0.18, gy - h * 0.58, w * 0.08, h * 0.05, '#d9645a');
      fillEllipse(ctx, x + w * 0.2, gy - h * 0.4, w * 0.07, h * 0.045, '#d9645a');
      fillEllipse(ctx, x + w * 0.02, gy - h * 0.3, w * 0.07, h * 0.045, '#d9645a');
      break;
    }
  }
}

function drawCoin(p) {
  const bob = Math.sin(state.time * 3.2 + p.phase) * 4;
  const spin = Math.abs(Math.cos(state.time * 2.7 + p.phase));
  const rx = 3 + spin * 8;

  const x = p.x;
  const y = p.y + bob;

  ctx.save();
  ctx.translate(x, y);

  fillEllipse(ctx, 0, 0, 15, 15, 'rgba(255, 226, 130, 0.14)');
  fillEllipse(ctx, 1.5, 2, rx, 11, 'rgba(160, 110, 20, 0.35)');
  fillEllipse(ctx, 0, 0, rx, 11.5, PAL.goldDark);
  fillEllipse(ctx, 0, -0.5, Math.max(1.2, rx - 2.4), 9.5, PAL.gold);
  fillEllipse(ctx, 0, -1, Math.max(0.8, rx - 4.6), 6.5, PAL.goldLight);

  if (spin > 0.35) {
    ctx.strokeStyle = 'rgba(180, 124, 26, 0.65)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(1, rx - 4.6), 6.2, 0, 0, TAU);
    ctx.stroke();
  }

  if (spin > 0.7) {
    fillEllipse(ctx, -2, -4, 2.2, 3, 'rgba(255, 255, 235, 0.75)');
  }

  ctx.restore();
}

function drawParticles() {
  for (const p of particles) {
    const a = clamp(p.life / p.max, 0, 1);
    if (p.kind === 'gold') {
      fillEllipse(ctx, p.x, p.y, p.size * a, p.size * a, `rgba(255, 215, 100, ${(a * 0.85).toFixed(3)})`);
    } else {
      fillEllipse(ctx, p.x, p.y, p.size * (1.4 - a * 0.4), p.size * 0.6, `rgba(${p.color}, ${(a * 0.45).toFixed(3)})`);
    }
  }
}
