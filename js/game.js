'use strict';

/* =========================================================
   Oyun akışı: girdi, koşu fiziği, engeller, skor, döngü
   ========================================================= */

let hintTimer = 0;

/* ---------------- bulutlar ---------------- */

function initClouds() {
  clouds.length = 0;
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: rand(0, view.W),
      y: rand(view.H * 0.08, view.H * 0.36),
      s: rand(0.55, 1.2),
      speed: rand(0.5, 1.1)
    });
  }
}

function updateClouds(dt) {
  for (const c of clouds) {
    c.x -= (8 + state.speed * 0.05) * c.speed * dt;
    if (c.x < -160) {
      c.x = view.W + rand(60, 260);
      c.y = rand(view.H * 0.08, view.H * 0.34);
      c.s = rand(0.55, 1.2);
    }
  }
}

/* ---------------- parçacıklar ---------------- */

function spawnDust(count, power = 1) {
  for (let i = 0; i < count; i++) {
    particles.push({
      kind: 'dust',
      x: player.x - 10 + rand(-8, 10),
      y: view.groundY - 2,
      vx: rand(-60, -15) * power,
      vy: rand(-55, -12) * power,
      gravity: 40,
      drag: 2.4,
      life: rand(0.32, 0.55),
      max: 0.55,
      size: rand(2, 4.4),
      color: '218, 198, 164'
    });
  }
}

function spawnGoldBurst(x, y) {
  for (let i = 0; i < 7; i++) {
    const a = rand(0, TAU);
    const sp = rand(40, 150);
    particles.push({
      kind: 'gold',
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 40,
      gravity: 380,
      drag: 1.2,
      life: rand(0.3, 0.55),
      max: 0.55,
      size: rand(2, 4)
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += p.gravity * dt;
    p.vx *= 1 - p.drag * dt;
  }
}

/* ---------------- engel ve altın üretimi ---------------- */

function pickObstacleType() {
  let total = 0;
  for (const t of OBSTACLE_TYPES) total += t.weight;
  let r = Math.random() * total;
  for (const t of OBSTACLE_TYPES) {
    r -= t.weight;
    if (r <= 0) return t;
  }
  return OBSTACLE_TYPES[0];
}

function spawnPattern() {
  const spawnX = view.W + 110;
  const type = pickObstacleType();
  obstacles.push({ kind: type.kind, x: spawnX, w: type.w, h: type.h });

  let patternEnd = spawnX + type.w / 2;

  /* ilerleyen mesafede yakın ikili engel */
  if (state.distance > 3500 && Math.random() < 0.26) {
    const t2 = Math.random() < 0.6 ? OBSTACLE_TYPES[0] : OBSTACLE_TYPES[3];
    const gap = rand(34, 70);
    const x2 = patternEnd + gap + t2.w / 2;
    obstacles.push({ kind: t2.kind, x: x2, w: t2.w, h: t2.h });
    patternEnd = x2 + t2.w / 2;
  }

  /* engelden sonra altın yayı */
  if (Math.random() < 0.72) {
    const count = randInt(3, 6);
    const startX = patternEnd + rand(100, 170);
    const baseY = view.groundY - rand(100, 155);
    const arc = rand(18, 42);
    for (let i = 0; i < count; i++) {
      const t = count > 1 ? i / (count - 1) : 0.5;
      pickups.push({
        x: startX + i * 38,
        y: baseY - Math.sin(t * Math.PI) * arc,
        phase: rand(0, TAU)
      });
    }
  }

  const gap = state.speed * rand(0.74, 1.28) + 120 + (patternEnd - spawnX);
  state.nextSpawn = state.distance + gap;
}

/* ---------------- koşucu ---------------- */

function updateRunner(dt) {
  player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);

  if (player.jumpBuffer > 0 && player.grounded) {
    player.vy = -JUMP_V;
    player.grounded = false;
    player.jumpBuffer = 0;
    spawnDust(5, 0.7);
  }

  if (!player.grounded) {
    player.vy += GRAVITY * dt;
    player.y += player.vy * dt;

    if (player.y >= view.groundY) {
      player.y = view.groundY;
      player.vy = 0;
      player.grounded = true;
      player.squash = 0.2;
      spawnDust(9, 1.1);
    }
  }

  player.squash = Math.max(0, player.squash - dt * 1.6);

  if (player.grounded) {
    player.runPhase += dt * (7 + state.speed / 60);
    player.dustTimer -= dt;
    if (player.dustTimer <= 0) {
      player.dustTimer = rand(0.08, 0.14);
      spawnDust(1, 0.55);
    }
  }
}

/* ---------------- çarpışmalar ---------------- */

function checkCollisions() {
  const pb = {
    x: player.x - 15,
    y: player.y - 52,
    w: 30,
    h: 52
  };

  for (const o of obstacles) {
    const box = {
      x: o.x - o.w / 2 + 5,
      y: view.groundY - o.h + 4,
      w: o.w - 10,
      h: o.h - 4
    };
    if (
      pb.x < box.x + box.w &&
      pb.x + pb.w > box.x &&
      pb.y < box.y + box.h &&
      pb.y + pb.h > box.y
    ) {
      gameOver();
      return;
    }
  }

  for (let i = pickups.length - 1; i >= 0; i--) {
    const c = pickups[i];
    const cx = clamp(c.x, pb.x, pb.x + pb.w);
    const cy = clamp(c.y, pb.y, pb.y + pb.h);
    if (Math.hypot(c.x - cx, c.y - cy) < 30) {
      pickups.splice(i, 1);
      state.coins++;
      state.score += 25;
      spawnGoldBurst(c.x, c.y);
    }
  }
}

/* ---------------- arayüz ---------------- */

function updateHud(force) {
  if (!force && state.score === state.lastHudScore) return;
  state.lastHudScore = state.score;
  els.score.textContent = state.score;
  els.coins.textContent = state.coins;
  els.best.textContent = state.best;
}

function saveBest(score) {
  state.best = score;
  try {
    localStorage.setItem('yesil-vadi-best', String(score));
  } catch (err) {
    /* depolama kapalıysa sorun değil */
  }
  els.best.textContent = state.best;
}

function showReadyOverlay() {
  els.ovEyebrow.textContent = 'sonsuz koşu';
  els.ovTitle.textContent = 'Yeşil Vadi';
  els.ovDesc.textContent =
    'Şapkalı çiftçimiz vadiyi koşarak geçiyor. Engellere çarpmadan mümkün olduğunca uzağa git, altınları topla.';
  els.ovResult.hidden = true;
  els.ovBtn.textContent = 'Koşmaya başla';
  els.overlay.classList.remove('hidden');
  els.hint.classList.add('hidden');
}

function showGameOverOverlay(isBest) {
  els.ovEyebrow.textContent = isBest ? 'yeni rekor' : 'koşu bitti';
  els.ovTitle.textContent = isBest ? 'Harika koşu!' : 'Eyvaah!';
  els.ovDesc.textContent = isBest
    ? 'Vadinin yeni rekorunu kırdın. Bakalım daha ne kadar uzağa gidebilirsin?'
    : 'Bir engele takıldın. Nefes al ve tekrar dene; altınlar seni bekliyor.';
  els.finalScore.textContent = state.score;
  els.finalDist.textContent = Math.floor(state.distance / 30) + ' m';
  els.finalBest.textContent = state.best;
  els.ovResult.hidden = false;
  els.ovBtn.textContent = 'Tekrar koş';
  els.overlay.classList.remove('hidden');
  els.hint.classList.add('hidden');
}

/* ---------------- durum geçişleri ---------------- */

function resetGame() {
  obstacles.length = 0;
  pickups.length = 0;
  particles.length = 0;

  state.elapsed = 0;
  state.distance = 0;
  state.speed = BASE_SPEED;
  state.coins = 0;
  state.score = 0;
  state.nextSpawn = 380;
  state.lastHudScore = -1;
  state.shake = 0;
  state.overCooldown = 0;

  player.y = view.groundY;
  player.vy = 0;
  player.grounded = true;
  player.jumpBuffer = 0;
  player.runPhase = 0;
  player.squash = 0;
  player.dustTimer = 0;

  updateHud(true);
}

function startGame() {
  resetGame();
  state.mode = 'running';
  state.runId++;
  els.overlay.classList.add('hidden');
  els.hint.classList.remove('hidden');
  hintTimer = 5;
}

function gameOver() {
  if (state.mode !== 'running') return;

  state.mode = 'over';
  state.overCooldown = 0.55;
  state.shake = 0.55;
  spawnDust(12, 1.3);

  const isBest = state.score > state.best;
  if (isBest) saveBest(state.score);

  updateHud(true);

  const runId = state.runId;
  setTimeout(() => {
    if (state.mode === 'over' && state.runId === runId) {
      showGameOverOverlay(isBest);
    }
  }, 360);
}

/* ---------------- girdi ---------------- */

function onJumpPress() {
  if (state.mode === 'ready') {
    startGame();
    return;
  }
  if (state.mode === 'over') {
    if (state.overCooldown <= 0) startGame();
    return;
  }
  player.jumpBuffer = 0.14;
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Enter') {
    e.preventDefault();
    if (!e.repeat) onJumpPress();
  }
});

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  onJumpPress();
});

els.ovBtn.addEventListener('click', () => {
  els.ovBtn.blur();
  onJumpPress();
});

els.overlay.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button')) return;
  onJumpPress();
});

/* ---------------- boyutlandırma ---------------- */

function resize() {
  const oldGround = view.groundY;
  const above = oldGround ? oldGround - player.y : 0;

  view.w = window.innerWidth;
  view.h = window.innerHeight;
  view.dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(view.w * view.dpr);
  canvas.height = Math.round(view.h * view.dpr);
  canvas.style.width = view.w + 'px';
  canvas.style.height = view.h + 'px';

  view.scale = clamp(view.h / 720, 0.8, 2.2);
  view.W = view.w / view.scale;
  view.H = view.h / view.scale;
  view.groundY = view.H * 0.8;

  player.x = clamp(view.W * 0.24, 130, 430);

  if (state.mode === 'running' && !player.grounded) {
    player.y = view.groundY - above;
  } else {
    player.y = view.groundY;
  }

  if (clouds.length === 0) {
    initClouds();
  } else {
    for (const c of clouds) {
      c.x = Math.min(c.x, view.W - 80);
      c.y = clamp(c.y, view.H * 0.06, view.H * 0.38);
    }
  }
}

/* ---------------- ana döngü ---------------- */

function update(dt) {
  state.time += dt;
  updateClouds(dt);
  state.shake = Math.max(0, state.shake - dt * 2.4);

  if (state.mode === 'over') {
    state.overCooldown = Math.max(0, state.overCooldown - dt);
  }

  if (state.mode === 'running') {
    state.elapsed += dt;
    state.speed = Math.min(MAX_SPEED, BASE_SPEED + state.elapsed * SPEED_RAMP);

    const ds = state.speed * dt;
    state.distance += ds;
    state.score = Math.floor(state.distance / 20) + state.coins * 25;

    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= ds;
      if (obstacles[i].x < -220) obstacles.splice(i, 1);
    }
    for (let i = pickups.length - 1; i >= 0; i--) {
      pickups[i].x -= ds;
      if (pickups[i].x < -120) pickups.splice(i, 1);
    }

    updateRunner(dt);

    if (state.distance >= state.nextSpawn) spawnPattern();

    checkCollisions();
    updateHud(false);

    if (hintTimer > 0) {
      hintTimer -= dt;
      if (hintTimer <= 0) els.hint.classList.add('hidden');
    }
  }

  updateParticles(dt);
}

function render() {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.w, view.h);

  ctx.save();
  ctx.scale(view.scale, view.scale);

  if (state.shake > 0) {
    const s = state.shake * 12;
    ctx.translate(rand(-s, s), rand(-s, s));
  }

  drawSky();
  drawClouds();
  drawBirds();
  drawHills();
  drawTreeLine();
  drawGround();

  for (const c of pickups) drawCoin(c);
  for (const o of obstacles) drawObstacle(o);
  drawParticles();
  drawRunner();

  ctx.restore();
}

let last = 0;

function frame(now) {
  const dt = clamp((now - last) / 1000, 0, 0.05);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

function init() {
  resize();
  window.addEventListener('resize', resize);
  resetGame();
  state.mode = 'ready';
  showReadyOverlay();
  updateHud(true);
  last = performance.now();
  requestAnimationFrame(frame);
}

init();
