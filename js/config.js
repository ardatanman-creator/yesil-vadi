'use strict';

/* =========================================================
   Sabitler ve paylaşılan oyun durumu
   ========================================================= */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* Mantıksal görünüm: yükseklik ~720 birim, genişlik ekrana göre */
const view = {
  w: 0,
  h: 0,
  dpr: 1,
  scale: 1,
  W: 1280,
  H: 720,
  groundY: 576
};

/* Fizik ve hız */
const GRAVITY = 3000;
const JUMP_V = 1100;
const BASE_SPEED = 360;
const MAX_SPEED = 800;
const SPEED_RAMP = 7;

const state = {
  mode: 'ready',       // ready | running | over
  time: 0,
  elapsed: 0,
  distance: 0,
  speed: BASE_SPEED,
  coins: 0,
  score: 0,
  best: 0,
  shake: 0,
  overCooldown: 0,
  nextSpawn: 0,
  lastHudScore: -1,
  runId: 0
};

const player = {
  x: 0,
  y: 0,
  vy: 0,
  grounded: true,
  jumpBuffer: 0,
  runPhase: 0,
  dustTimer: 0,
  squash: 0
};

const obstacles = [];
const pickups = [];
const particles = [];
const clouds = [];

const OBSTACLE_TYPES = [
  { kind: 'rock', w: 50, h: 40, weight: 3 },
  { kind: 'stump', w: 46, h: 44, weight: 2 },
  { kind: 'fence', w: 84, h: 56, weight: 2 },
  { kind: 'log', w: 112, h: 32, weight: 2 },
  { kind: 'bush', w: 62, h: 48, weight: 2 }
];

const PAL = {
  skin: '#f0c39a',
  skinShade: '#e0ae83',
  shirt: '#f0e3c6',
  denim: '#4a6fb5',
  denimDark: '#3b5b93',
  shoe: '#4b3a2d',
  hair: '#5b3a29',
  straw: '#e9c765',
  strawDark: '#c9a24b',
  band: '#c25b4a',
  scarf: '#d0644f',
  scarfDark: '#b34f3e',
  gold: '#e9b949',
  goldLight: '#f8dc86',
  goldDark: '#c9932f'
};

/* Arayüz elemanları */
const els = {
  score: document.getElementById('score'),
  coins: document.getElementById('coins'),
  best: document.getElementById('best'),
  hint: document.getElementById('hint'),
  overlay: document.getElementById('overlay'),
  ovEyebrow: document.getElementById('ovEyebrow'),
  ovTitle: document.getElementById('ovTitle'),
  ovDesc: document.getElementById('ovDesc'),
  ovResult: document.getElementById('ovResult'),
  ovBtn: document.getElementById('ovBtn'),
  finalScore: document.getElementById('finalScore'),
  finalDist: document.getElementById('finalDist'),
  finalBest: document.getElementById('finalBest')
};

/* Rekoru yükle */
try {
  state.best = parseInt(localStorage.getItem('yesil-vadi-best') || '0', 10) || 0;
} catch (err) {
  state.best = 0;
}
els.best.textContent = state.best;
