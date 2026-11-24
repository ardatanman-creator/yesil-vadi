'use strict';

/* =========================================================
   Yandan koşan karakter
   ========================================================= */

function drawRunner() {
  const p = player;
  const running = state.mode === 'running';
  const air = !p.grounded && state.mode !== 'ready';
  const groundedRun = running && p.grounded;
  const phase = p.runPhase;

  const aboveGround = view.groundY - p.y;
  const shadowK = clamp(1 - aboveGround / 420, 0.35, 1);
  fillEllipse(ctx, p.x, view.groundY + 4, 23 * shadowK, 6.5 * shadowK, `rgba(35, 55, 30, ${(0.25 * shadowK).toFixed(3)})`);

  const bob = groundedRun ? Math.abs(Math.sin(phase)) * 2 : !running ? Math.sin(state.time * 2.2) * 0.8 : 0;

  /* ------- bacak ------- */
  const drawLeg = (legPhase, front) => {
    const hipX = front ? 4 : 0;
    const hipY = -25;
    let kneeX, kneeY, footX, footY;

    if (groundedRun) {
      const swing = Math.sin(legPhase);
      const lift = Math.max(0, Math.cos(legPhase));
      kneeX = hipX + swing * 7;
      kneeY = -14 - lift * 3;
      footX = hipX + swing * 12 + 3;
      footY = -3 - lift * 7;
    } else if (air) {
      if (p.vy < 0) {
        kneeX = hipX + 8;
        kneeY = -17;
        footX = hipX + 5;
        footY = -10;
      } else {
        kneeX = hipX + 10;
        kneeY = -15;
        footX = hipX + 16;
        footY = -4;
      }
    } else {
      kneeX = hipX + 1;
      kneeY = -13;
      footX = hipX + 2;
      footY = -3;
    }

    strokeLimb(ctx, hipX, hipY, kneeX, kneeY, footX, footY, 7, front ? PAL.denim : PAL.denimDark);
    fillEllipse(ctx, footX + 2.5, footY, 5.5, 3.2, PAL.shoe);
  };

  /* ------- kol ------- */
  const drawArm = (armPhase, front) => {
    const shoulderX = front ? 7 : 2;
    const shoulderY = -51;
    let elbowX, elbowY, handX, handY;

    if (groundedRun) {
      const swing = Math.sin(armPhase + Math.PI);
      elbowX = shoulderX + swing * 2;
      elbowY = shoulderY + 10;
      handX = shoulderX + swing * 9 - 1;
      handY = shoulderY + 16 + Math.max(0, swing) * 2;
    } else if (air) {
      if (p.vy < 0) {
        elbowX = shoulderX + 7;
        elbowY = shoulderY + 6;
        handX = shoulderX + 13;
        handY = shoulderY + 1;
      } else {
        elbowX = shoulderX + 8;
        elbowY = shoulderY + 11;
        handX = shoulderX + 15;
        handY = shoulderY + 15;
      }
    } else {
      elbowX = shoulderX + 1;
      elbowY = shoulderY + 11;
      handX = shoulderX + 1;
      handY = shoulderY + 20;
    }

    fillEllipse(ctx, shoulderX + 1, shoulderY + 3, 5, 6, PAL.shirt);
    strokeLimb(ctx, shoulderX, shoulderY, elbowX, elbowY, handX, handY, 4.8, front ? PAL.skin : PAL.skinShade);
    fillEllipse(ctx, handX, handY, 3.1, 3.1, front ? PAL.skin : PAL.skinShade);
  };

  ctx.save();
  ctx.translate(p.x, p.y - bob);
  if (p.squash > 0) {
    ctx.scale(1 + p.squash * 0.45, 1 - p.squash * 0.38);
  }

  /* atkı kuyruğu (gövdenin arkasında, iki şerit) */
  const wave = Math.sin(state.time * 11 + phase) * 3 + (air ? -7 : 0);
  ctx.lineCap = 'round';

  ctx.strokeStyle = PAL.scarf;
  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.moveTo(1, -55);
  ctx.bezierCurveTo(-9, -59 + wave, -18, -49 - wave * 0.5, -30, -50 + wave);
  ctx.stroke();

  ctx.strokeStyle = PAL.scarfDark;
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(0, -51.5);
  ctx.bezierCurveTo(-10, -52 + wave * 0.7, -16, -46 - wave * 0.4, -25, -44 + wave * 1.2);
  ctx.stroke();

  /* arka kol ve bacak */
  drawArm(phase + Math.PI, false);
  drawLeg(phase + Math.PI, false);

  /* gövde */
  fillRoundRect(ctx, -9, -54, 23, 31, 9, PAL.shirt);

  /* tulum */
  fillRoundRect(ctx, -8, -39, 21, 18, 5, PAL.denim);
  ctx.fillStyle = PAL.denimDark;
  ctx.fillRect(-4.5, -53, 3.6, 15);
  ctx.fillRect(6.5, -53, 3.6, 15);
  ctx.fillStyle = 'rgba(28, 48, 95, 0.22)';
  fillRoundRect(ctx, 1, -32, 8.5, 6.5, 2, 'rgba(28, 48, 95, 0.22)');
  fillEllipse(ctx, -4.5, -38.5, 1.7, 1.7, '#e8c95c');
  fillEllipse(ctx, 8.5, -38.5, 1.7, 1.7, '#e8c95c');

  /* ön bacak */
  drawLeg(phase, true);

  /* atkı düğümü */
  fillRoundRect(ctx, -2, -58, 12, 6.5, 3.2, PAL.scarf);
  fillRoundRect(ctx, 4, -57, 5, 4, 2, '#e08a70');

  /* boyun ve kafa */
  fillEllipse(ctx, 3, -55, 4, 4, PAL.skinShade);
  fillEllipse(ctx, 6, -64, 10.8, 11.2, PAL.skin);
  fillEllipse(ctx, -2.8, -63, 2.3, 2.8, PAL.skinShade);
  fillEllipse(ctx, 15.8, -62.5, 2.6, 2.4, PAL.skin);

  /* saç */
  fillEllipse(ctx, 0.5, -67.5, 9.6, 8.6, PAL.hair);
  fillRoundRect(ctx, -2.5, -63, 3.6, 5.5, 1.6, PAL.hair);

  /* yüz */
  fillEllipse(ctx, 10.5, -65, 1.35, 1.6, '#3a2a22');
  ctx.strokeStyle = '#5d4033';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(8.2, -68.4);
  ctx.lineTo(12.3, -68);
  ctx.stroke();

  ctx.strokeStyle = '#8a5a45';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(12, -60.2, 2.6, 0.12 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  fillEllipse(ctx, 9.4, -60.6, 2.4, 1.3, 'rgba(226, 138, 120, 0.35)');

  /* hasır şapka */
  fillEllipse(ctx, 5.5, -77.5, 9.6, 8, PAL.straw);
  ctx.fillStyle = PAL.band;
  ctx.fillRect(-4, -76, 19, 4.2);
  fillEllipse(ctx, 6.5, -71.8, 20, 4.6, PAL.straw);
  ctx.strokeStyle = 'rgba(150, 112, 40, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(6.5, -71.8, 20, 4.6, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(150, 112, 40, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-3, -72.8);
  ctx.quadraticCurveTo(6, -74.2, 16, -72.4);
  ctx.stroke();

  /* ön kol */
  drawArm(phase, true);

  ctx.restore();
}
