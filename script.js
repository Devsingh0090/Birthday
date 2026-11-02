/* ===================================================================
   HAPPY BIRTHDAY ANANTA PRIYA — JAVASCRIPT ENGINE
   Sakura Petals, Audio Synthesizer, Gift System, Confetti
   =================================================================== */

// ── 1. Web Audio API ──────────────────────────────────────────────
let audioCtx = null, isMusicPlaying = false, melodyIndex = 0, melodyTimeout = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playChime() {
  try {
    const ctx = getAudioContext();
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.55);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.6);
    });
  } catch(e) {}
}

function playPop() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.13);
  } catch(e) {}
}

function playFanfare() {
  try {
    const ctx = getAudioContext();
    [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
      gain.gain.setValueAtTime(0.01, ctx.currentTime + i * 0.09);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + i * 0.09 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.75);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.09);
      osc.stop(ctx.currentTime + i * 0.09 + 0.8);
    });
  } catch(e) {}
}

// Happy Birthday melody
const MELODY = [
  {f:392,d:.35},{f:392,d:.35},{f:440,d:.7},{f:392,d:.7},{f:523.25,d:.7},{f:493.88,d:1.2},
  {f:392,d:.35},{f:392,d:.35},{f:440,d:.7},{f:392,d:.7},{f:587.33,d:.7},{f:523.25,d:1.2},
  {f:392,d:.35},{f:392,d:.35},{f:783.99,d:.7},{f:659.25,d:.7},{f:523.25,d:.7},{f:493.88,d:.7},{f:440,d:1.0},
  {f:698.46,d:.35},{f:698.46,d:.35},{f:659.25,d:.7},{f:523.25,d:.7},{f:587.33,d:.7},{f:523.25,d:1.5}
];

function playNextNote() {
  if (!isMusicPlaying) return;
  const ctx = getAudioContext(), n = MELODY[melodyIndex];
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = 'sine'; osc.frequency.setValueAtTime(n.f, ctx.currentTime);
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.d * 0.95);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + n.d);
  melodyIndex = (melodyIndex + 1) % MELODY.length;
  melodyTimeout = setTimeout(playNextNote, n.d * 1000 + (melodyIndex === 0 ? 1500 : 80));
}

function toggleMusic() {
  const btn = document.getElementById('music-toggle');
  const lbl = document.getElementById('music-status');
  if (isMusicPlaying) {
    isMusicPlaying = false; clearTimeout(melodyTimeout);
    btn.classList.remove('playing'); lbl.textContent = 'Music 🎵';
  } else {
    getAudioContext(); isMusicPlaying = true;
    btn.classList.add('playing'); lbl.textContent = 'Playing 🎶';
    melodyIndex = 0; playNextNote();
  }
}

// ── 2. Confetti & Petal Canvas ────────────────────────────────────
const canvas = document.getElementById('confetti-canvas');
const ctx2d   = canvas.getContext('2d');
let particles = [], rafId = null;

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 200));
resizeCanvas();

const PETAL_COLORS = ['#ff85a1','#ffccd5','#ff4d6d','#ffd6e0','#ffffff','#ff9ebb','#f9a8d4'];

class Petal {
  constructor(x, y, burst) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? (burst ? y : -16);
    this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    this.size = Math.random() * 9 + 5;
    this.petal = Math.random() > 0.3;
    if (burst) {
      const a = Math.random() * Math.PI * 2, spd = Math.random() * 11 + 3;
      this.vx = Math.cos(a) * spd; this.vy = Math.sin(a) * spd - 4;
    } else {
      this.vx = (Math.random() - 0.5) * 1.8; this.vy = Math.random() * 1.6 + 1.1;
    }
    this.rot = Math.random() * 360; this.rotSpd = (Math.random() - 0.5) * 4;
    this.sway = Math.random() * Math.PI * 2; this.swaySpd = 0.03 + Math.random() * 0.02;
    this.opacity = 0.92;
    this.life = burst ? (100 + Math.random() * 50) : Infinity;
  }
  update() {
    this.sway += this.swaySpd;
    this.x += this.vx + Math.sin(this.sway) * 1.1;
    this.y += this.vy; this.vy += 0.04;
    this.vx *= 0.98; this.rot += this.rotSpd;
    if (this.life !== Infinity) { this.life--; this.opacity = Math.max(0, this.life / 80); }
  }
  draw(c) {
    c.save(); c.translate(this.x, this.y);
    c.rotate(this.rot * Math.PI / 180);
    c.globalAlpha = this.opacity; c.fillStyle = this.color;
    if (this.petal) {
      c.beginPath(); c.moveTo(0, -this.size / 2);
      c.bezierCurveTo(this.size/2,-this.size/2, this.size/2,this.size/2, 0, this.size);
      c.bezierCurveTo(-this.size/2,this.size/2, -this.size/2,-this.size/2, 0,-this.size/2);
      c.fill();
    } else {
      c.beginPath(); c.arc(0,0,this.size/2.5,0,Math.PI*2); c.fill();
    }
    c.restore();
  }
}

function spawnBurst(x, y, n = 55) {
  for (let i = 0; i < n; i++) particles.push(new Petal(x, y, true));
  if (!rafId) renderPetals();
}

function triggerGrandCelebration() {
  playChime();
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  spawnBurst(cx, cy, 120);
  spawnBurst(Math.max(50, cx-180), cy+80, 60);
  spawnBurst(Math.min(window.innerWidth-50, cx+180), cy+80, 60);
}

function renderPetals() {
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.update(); p.draw(ctx2d);
    if (p.y > canvas.height + 30 || p.opacity <= 0) particles.splice(i, 1);
  }
  if (particles.length > 0) rafId = requestAnimationFrame(renderPetals);
  else rafId = null;
}

// Gentle ambient petals
setInterval(() => {
  if (particles.length < 25) {
    particles.push(new Petal(Math.random() * canvas.width, -12, false));
    if (!rafId) renderPetals();
  }
}, 420);

// ── 3. Gift Box System (Pure Wishes & Blessings in English) ───────
const GIFTS = [
  { id:1, title:"Golden Health & Vitality", icon:"🌸", badge:"Divine Health Blessing",
    message:"Dearest Ananta Priya, wishing you a lifetime of vibrant health, boundless energy, and radiant wellness. May you always feel refreshed, youthful, and blessed with strength in every season of life!",
    voucher:"🌸 Blessing: Radiant Health, Wellness & Longevity" },
  { id:2, title:"Endless Joy & Bright Smiles", icon:"💖", badge:"Blessing of Happiness",
    message:"May your heart always be light and your days filled with pure sunshine. May every morning bring you beautiful reasons to smile, and every evening bring you contentment, warmth, and peace, Ananta Priya!",
    voucher:"✨ Blessing: 365 Days of Pure Smiles & Happiness" },
  { id:3, title:"10,000 Heartfelt Blessings", icon:"✨", badge:"Divine Prayers & Wishes",
    message:"May the Almighty shower abundant blessings upon you and fulfill every silent prayer of your heart. May wisdom, positivity, and divine grace guide every single step you take!",
    voucher:"🌟 Blessing: May Every Dream & Wish Come True" },
  { id:4, title:"Abundance & Prosperity", icon:"💎", badge:"Prosperity Blessing",
    message:"May good fortune, success, and prosperity illuminate every chapter of your journey. May your home and life always overflow with happiness, harmony, peace, and lasting fulfillment, dearest Ananta Priya!",
    voucher:"💎 Blessing: Everlasting Success & Prosperity" },
  { id:5, title:"Warmth, Love & Dignity", icon:"👑", badge:"Grace & Love",
    message:"Your graceful smile, gentle kindness, and warm spirit bring so much joy to everyone around you. May you forever be surrounded by people who deeply cherish, respect, and adore you from the heart!",
    voucher:"💖 Blessing: Boundless Love & Deep Respect" },
  { id:6, title:"Sweet Moments & Laughter", icon:"🎂", badge:"Joyful Life Blessing",
    message:"May this upcoming year be packed with sweet celebrations, delightful journeys, unforgettable memories, and joyous laughter with those you hold dearest to your heart!",
    voucher:"🍰 Blessing: Sweetness & Joy in Every Single Moment" },
  { id:7, title:"Tranquility & Peace of Mind", icon:"🕊️", badge:"Inner Peace Blessing",
    message:"May all stress and worries stay miles away from your heart. May you enjoy deep serenity, tranquility of mind, and blissful happiness throughout your wonderful life, Ananta Priya!",
    voucher:"🌸 Blessing: Pure Serenity & Peaceful Mind" },
  { id:8, title:"The Grand Birthday Blessing", icon:"🎁", badge:"Grand Birthday Wish",
    message:"Wishing dearest Ananta Priya the happiest, brightest, and most magical birthday ever! May this special day mark the dawn of your most magnificent, joyful, and blessed chapter yet!",
    voucher:"❤️ Blessing: The Happiest & Most Blessed Year Ahead" }
];

const openedSet = new Set();

function initGifts() {
  const grid = document.getElementById('gifts-grid');
  if (!grid) return;
  GIFTS.forEach((g, i) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.id = `gift-card-${g.id}`;
    card.onclick = () => openGift(g.id);
    card.innerHTML = `
      <div class="gift-box-visual" id="gift-icon-${g.id}">🎁</div>
      <div class="gift-number">Mystery #${i+1}</div>
      <h3 class="gift-title">${g.title}</h3>
      <div class="gift-status-badge" id="gift-badge-${g.id}">
        <i class="fa-solid fa-lock"></i> Unwrap
      </div>`;
    grid.appendChild(card);
  });
}

function openGift(id) {
  const g = GIFTS.find(x => x.id === id); if (!g) return;
  openedSet.add(id);
  // Update card
  const card = document.getElementById(`gift-card-${id}`);
  const icon = document.getElementById(`gift-icon-${id}`);
  const badge = document.getElementById(`gift-badge-${id}`);
  if (card) card.classList.add('opened');
  if (icon) icon.innerHTML = g.icon;
  if (badge) badge.innerHTML = `<i class="fa-solid fa-check"></i> Opened!`;
  // Counter
  const counter = document.getElementById('opened-counter');
  if (counter) counter.textContent = `${openedSet.size} / ${GIFTS.length}`;
  // FX
  playChime();
  if (card) {
    const r = card.getBoundingClientRect();
    spawnBurst(r.left + r.width/2, r.top + r.height/2, 40);
  }
  // All opened?
  if (openedSet.size === GIFTS.length) setTimeout(triggerGrandCelebration, 500);
  // Modal
  const modal = document.getElementById('gift-modal');
  document.getElementById('modal-icon').innerHTML = g.icon;
  document.getElementById('modal-tag').textContent = g.badge;
  document.getElementById('modal-title').textContent = g.title;
  document.getElementById('modal-message').textContent = g.message;
  document.getElementById('modal-voucher').innerHTML = g.voucher
    ? `<div class="voucher-pill"><i class="fa-solid fa-ticket"></i> ${g.voucher}</div>` : '';
  modal.classList.add('active');
}

function closeModal() { document.getElementById('gift-modal')?.classList.remove('active'); }

// ── 4. Candle Interaction ─────────────────────────────────────────
let candleBlown = false;

function initCandle() {
  const candle = document.getElementById('birthday-candle');
  const flame  = document.getElementById('candle-flame');
  const smoke  = document.getElementById('candle-smoke');
  const msg    = document.getElementById('candle-message');
  if (!candle) return;

  candle.addEventListener('click', () => {
    if (candleBlown) {
      candleBlown = false;
      flame.classList.remove('blown-out');
      smoke.classList.remove('active');
      msg.innerHTML = '<i class="fa-regular fa-hand-pointer"></i> Tap flame to blow again!';
      playChime();
      return;
    }
    candleBlown = true;
    flame.classList.add('blown-out');
    smoke.classList.add('active');
    playFanfare();
    const r = candle.getBoundingClientRect();
    spawnBurst(r.left + r.width/2, r.top, 70);
    msg.innerHTML = '🎉 <strong>Dear Ananta Priya, your birthday wish is sent to the stars! May every single wish come true!</strong> ✨';
    msg.style.color = '#c4184f';
  });
}

// ── 5. Magic Wish Generator ───────────────────────────────────────
const WISHES = [
  "Wishing Ananta Priya a year as glowing, sweet, and graceful as her radiant smile!",
  "May your heart always be light, your days be bright, and your home be filled with laughter and love!",
  "May every path you walk lead to happiness, peace, and great health. Happy Birthday Ananta Priya!",
  "Your kindness and elegance make the world a much sweeter place. Cheers to another fabulous year!",
  "May this birthday bring you double the joy, triple the fun, and infinite reasons to smile!",
  "May your life always overflow with happiness, peace, and boundless joy. Happy Birthday to you, Ananta Priya!",
  "May all your plans prosper, your health remain peak, and your joys multiply every single day!",
  "May this day shower you with golden blessings, warm embraces, and delightful surprises at every turn!",
  "You inspire everyone around you with your patience, grace, and caring heart. Have the most wonderful birthday ever!",
  "May you always shine like the finest star and celebrate every beautiful moment of life, Ananta Priya!"
];
let lastWish = -1;

function generateRandomWish() {
  playChime();
  let idx;
  do { idx = Math.floor(Math.random() * WISHES.length); } while (idx === lastWish && WISHES.length > 1);
  lastWish = idx;
  const el = document.getElementById('wish-text');
  const ball = document.getElementById('crystal-ball');
  if (ball) { ball.style.transform = 'scale(1.14) rotate(8deg)'; setTimeout(() => ball.style.transform='', 250); }
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = `"${WISHES[idx]}"`; el.style.opacity = '1'; spawnBurst(window.innerWidth/2, window.innerHeight*0.6, 22); }, 180);
  }
}

// ── 6. Floating Balloons ──────────────────────────────────────────
const BALLOON_COLORS = ['#ff4d6d','#ff758f','#ff85a1','#ffa6c1','#ffb3c6','#ffc8d5'];

function spawnBalloon() {
  const container = document.getElementById('balloon-container');
  if (!container) return;
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  balloon.style.backgroundColor = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  balloon.style.left = `${Math.random() * 80 + 8}%`;
  const dur = Math.random() * 6 + 10;
  balloon.style.animationDuration = `${dur}s`;
  balloon.style.transform = `scale(${Math.random() * 0.35 + 0.8})`;
  balloon.innerHTML = Math.random() > 0.5 ? '💖' : '🌸';
  function pop(e) {
    e.stopPropagation(); playPop();
    const r = balloon.getBoundingClientRect();
    spawnBurst(r.left + r.width/2, r.top + r.height/2, 20);
    balloon.remove();
  }
  balloon.addEventListener('click', pop);
  balloon.addEventListener('touchstart', pop, { passive:true });
  container.appendChild(balloon);
  setTimeout(() => balloon.parentNode && balloon.remove(), dur * 1000);
}

setInterval(spawnBalloon, 2400);

// ── 7. Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initGifts();
  initCandle();

  const startBtn      = document.getElementById('start-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const topNav        = document.getElementById('top-nav');
  const musicToggle   = document.getElementById('music-toggle');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      getAudioContext();
      welcomeScreen?.classList.add('hidden');
      document.body.classList.add('scroll-unlocked');
      if (topNav) topNav.style.display = 'flex';
      setTimeout(() => { toggleMusic(); triggerGrandCelebration(); }, 350);
    });
  }

  if (musicToggle) musicToggle.addEventListener('click', toggleMusic);

  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('modal-next-btn')?.addEventListener('click', closeModal);
  document.getElementById('gift-modal')?.addEventListener('click', e => {
    if (e.target.id === 'gift-modal') closeModal();
  });

  // Seed initial balloons
  for (let i = 0; i < 3; i++) setTimeout(spawnBalloon, i * 800);
});
