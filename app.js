/**
 * SORRY SISTER - INTERACTIVE EXPERIENCE JAVASCRIPT
 * Responsive 4-Page Apology Web App with Runaway 'No' Button Engine,
 * Web Audio Synthesizer, Confetti & Particle Systems, and Personalization.
 */

// ==========================================================
// 1. STATE & CONFIGURATION
// ==========================================================
const state = {
  currentPage: 1,
  sisterName: "Anu",
  senderName: "Sourav",
  customNote: "",
  escapeCount: 0,
  yesScale: 1.0,
  soundEnabled: false,
  musicPlaying: false,
  claimedCoupons: new Set()
};

const teasingQuotes = [
  "Oops, too slow! 🏃💨",
  "Error 404: 'No' button not found! 😜",
  "Hey! You can't click me! 🙈",
  "You love me too much to press No! 💕",
  "Nice try! But only YES is allowed! ✨",
  "Resistance is futile, Sister! 🥰",
  "Can't catch me! 🚀",
  "Look at YES! It looks so tempting! 👀",
  "Scientifically impossible to press NO! 🧬",
  "Come on, you know you want to forgive me! 🥺"
];

const mascotEmojis = ["🥺", "😮", "🤭", "😜", "🙈", "🥳", "💖"];

// ==========================================================
// 2. WEB AUDIO SYNTHESIZER (100% Offline & Pure JS)
// ==========================================================
let audioCtx = null;
let bgMusicInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle pleasant chime sound
function playChime(freq = 587.33, duration = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio fail gracefully
  }
}

// Playful "Boing / Pop" sound for runaway No button
function playBoingSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (e) {
    // Audio fail gracefully
  }
}

// Celebratory Fanfare on YES click
function playFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((note, index) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }, index * 120);
    });
  } catch (e) {
    // Audio fail gracefully
  }
}

// Gentle ambient background melody generator (lo-fi music generator)
function toggleMusic() {
  state.musicPlaying = !state.musicPlaying;
  const soundIcon = document.getElementById('sound-icon');
  const soundBtn = document.getElementById('sound-btn');
  
  if (state.musicPlaying) {
    soundIcon.textContent = '🔊';
    soundBtn.classList.add('pulse-glow');
    showToast('🎵 Soothing background music enabled');
    startAmbientMelody();
  } else {
    soundIcon.textContent = '🎵';
    soundBtn.classList.remove('pulse-glow');
    showToast('🔇 Music paused');
    stopAmbientMelody();
  }
}

const melodyScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic C Major
function startAmbientMelody() {
  if (bgMusicInterval) clearInterval(bgMusicInterval);
  getAudioContext();
  
  bgMusicInterval = setInterval(() => {
    if (!state.musicPlaying) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const note = melodyScale[Math.floor(Math.random() * melodyScale.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  }, 900);
}

function stopAmbientMelody() {
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
}

// ==========================================================
// 3. PAGE NAVIGATION & ROUTING
// ==========================================================
function navigateToPage(pageNum) {
  if (pageNum < 1 || pageNum > 4) return;
  state.currentPage = pageNum;
  
  // Play transition chime
  playChime(520 + pageNum * 50, 0.3);

  // Update Page Views
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(`page-${pageNum}`);
  if (targetView) {
    targetView.classList.add('active');
    // Scroll smoothly to top of container
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update Step Indicators
  document.querySelectorAll('.step-indicator').forEach(indicator => {
    const step = parseInt(indicator.dataset.step, 10);
    indicator.classList.remove('active', 'completed');
    if (step === pageNum) {
      indicator.classList.add('active');
    } else if (step < pageNum) {
      indicator.classList.add('completed');
    }
  });

  // Update Progress Bar Width
  const progressBar = document.getElementById('step-progress-bar');
  if (progressBar) {
    const percentages = [0, 0, 33.3, 66.6, 100];
    progressBar.style.width = `${percentages[pageNum]}%`;
  }

  // Page Specific Inits
  if (pageNum === 3) {
    resetRunawayButton();
  } else if (pageNum === 4) {
    launchMegaConfetti(120);
    playFanfare();
  }

  // Update URL Hash without jump
  if (history.pushState) {
    history.pushState(null, null, `#page-${pageNum}`);
  }
}

// ==========================================================
// 4. PAGE 1: ENVELOPE TOGGLE
// ==========================================================
function toggleEnvelope() {
  const env = document.getElementById('envelope');
  if (!env) return;
  
  const isOpen = env.classList.toggle('open');
  playChime(isOpen ? 659.25 : 440, 0.35);
  
  const hint = document.getElementById('envelope-hint');
  if (hint) {
    hint.textContent = isOpen 
      ? "💌 Letter opened! Scroll down for more." 
      : "✨ Tap the envelope above to read my letter ✨";
  }
}

// ==========================================================
// 5. PAGE 3: THE ELUSIVE RUNAWAY "NO" ENGINE
// ==========================================================
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const buttonArena = document.getElementById('button-arena');
const speechBubble = document.getElementById('speech-bubble');
const mascotFace = document.getElementById('mascot-face');
const escapeCountEl = document.getElementById('escape-count');
const forgiveSelect = document.getElementById('forgive-select');

function resetRunawayButton() {
  if (!btnNo) return;
  btnNo.classList.remove('escaped');
  btnNo.style.position = '';
  btnNo.style.left = '';
  btnNo.style.top = '';
  btnNo.style.transform = '';
  
  state.yesScale = 1.0;
  if (btnYes) {
    btnYes.style.transform = `scale(1)`;
  }
}

function triggerRunaway(e) {
  if (!btnNo) return;
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  state.escapeCount++;
  if (escapeCountEl) {
    escapeCountEl.textContent = state.escapeCount;
  }

  // Play comical evasion sound
  playBoingSound();

  // Pick random position within safe viewport boundaries
  const btnWidth = btnNo.offsetWidth || 130;
  const btnHeight = btnNo.offsetHeight || 50;
  const padding = 30;

  const maxWidth = window.innerWidth - btnWidth - padding;
  const maxHeight = window.innerHeight - btnHeight - padding;

  let randomX = Math.max(padding, Math.random() * maxWidth);
  let randomY = Math.max(padding + 60, Math.random() * maxHeight); // avoid navbar top

  // Ensure button moves dynamically
  btnNo.classList.add('escaped');
  btnNo.style.left = `${randomX}px`;
  btnNo.style.top = `${randomY}px`;
  btnNo.style.transform = `rotate(${(Math.random() - 0.5) * 24}deg)`;

  // Update Teasing Quotes & Mascot
  const quote = teasingQuotes[state.escapeCount % teasingQuotes.length];
  const mascot = mascotEmojis[state.escapeCount % mascotEmojis.length];

  if (speechBubble) {
    speechBubble.textContent = quote;
    speechBubble.classList.remove('shake-animation');
    void speechBubble.offsetWidth; // trigger reflow
    speechBubble.classList.add('shake-animation');
  }

  if (mascotFace) {
    mascotFace.textContent = mascot;
  }

  // Grow YES button to make it increasingly irresistible
  if (btnYes) {
    state.yesScale = Math.min(1.5, 1.0 + state.escapeCount * 0.07);
    btnYes.style.transform = `scale(${state.yesScale})`;
  }

  // Spawn small floating heart burst at escape location
  spawnMiniHearts(randomX + btnWidth / 2, randomY + btnHeight / 2);
}

// Proximity detection for Desktop (slips away before cursor even touches!)
function setupRunawayListeners() {
  if (!btnNo) return;

  // Desktop Proximity Check
  window.addEventListener('mousemove', (e) => {
    if (state.currentPage !== 3) return;
    
    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    
    // Proximity threshold: 85px
    if (dist < 85) {
      triggerRunaway(e);
    }
  });

  // Mobile / Touch / Direct Hover Events
  ['mouseenter', 'mouseover', 'touchstart', 'pointerdown', 'click', 'focus'].forEach(eventType => {
    btnNo.addEventListener(eventType, (e) => {
      triggerRunaway(e);
    }, { passive: false });
  });

  // Dropdown Select Interception
  if (forgiveSelect) {
    forgiveSelect.addEventListener('change', (e) => {
      if (e.target.value === 'no') {
        // Punish picking NO in dropdown: shake, boing, and auto-snap to YES!
        playBoingSound();
        forgiveSelect.classList.add('shake-animation');
        showToast("Nice try! But only 'YES' is accepted in this household! 😇");
        
        setTimeout(() => {
          forgiveSelect.value = 'yes';
          forgiveSelect.classList.remove('shake-animation');
          handleYesClick();
        }, 500);
      } else if (e.target.value === 'yes') {
        handleYesClick();
      }
    });
  }
}

// YES Button Click Handler (Grand celebration and automatic redirect)
function handleYesClick() {
  playFanfare();
  launchMegaConfetti(150);
  
  if (speechBubble) {
    speechBubble.textContent = "YAAAY! I KNEW YOU WOULD FORGIVE ME! ❤️✨ Redirecting to celebration...";
  }
  if (mascotFace) {
    mascotFace.textContent = "🥳";
  }

  showToast(`🎉 ${state.sisterName} officially pardoned you! Redirecting...`);

  // Redirect to Page 4 after 1.2 seconds of celebration
  setTimeout(() => {
    navigateToPage(4);
  }, 1200);
}

// ==========================================================
// 6. PAGE 4: VOUCHERS & PEACE TREATY
// ==========================================================
function claimCoupon(cardEl, couponName) {
  if (!cardEl) return;
  
  if (cardEl.classList.contains('claimed')) {
    showToast(`✨ You already claimed the '${couponName}' voucher!`);
    return;
  }

  playChime(784, 0.4);
  cardEl.classList.add('claimed');
  state.claimedCoupons.add(couponName);

  const tag = cardEl.querySelector('.voucher-tag');
  if (tag) {
    tag.textContent = 'CLAIMED & ACTIVE! ✔';
  }

  // Mini burst
  const rect = cardEl.getBoundingClientRect();
  spawnMiniHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
  
  showToast(`🎉 '${couponName}' redeemed! Your sibling is now obligated!`);
}

function triggerMegaCelebration() {
  playFanfare();
  launchMegaConfetti(180);
  showToast("🎊 Confetti shower activated! Best sister ever! 💖");
}

function printOrSaveTreaty() {
  window.print();
}

function restartExperience() {
  state.escapeCount = 0;
  state.yesScale = 1.0;
  if (escapeCountEl) escapeCountEl.textContent = '0';
  resetRunawayButton();
  
  navigateToPage(1);
  showToast("🔄 Rewound back to the beginning with endless love!");
}

// ==========================================================
// 7. CUSTOMIZATION & LOCAL STORAGE
// ==========================================================
function openCustomizer() {
  const modal = document.getElementById('customize-modal');
  if (modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeCustomizer() {
  const modal = document.getElementById('customize-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function saveCustomization() {
  const sisterInput = document.getElementById('input-sister-name');
  const senderInput = document.getElementById('input-sender-name');
  const noteInput = document.getElementById('input-custom-note');

  if (sisterInput && sisterInput.value.trim()) {
    state.sisterName = sisterInput.value.trim();
  }
  if (senderInput && senderInput.value.trim()) {
    state.senderName = senderInput.value.trim();
  }
  if (noteInput && noteInput.value.trim()) {
    state.customNote = noteInput.value.trim();
  }

  // Save in localStorage
  localStorage.setItem('sorry_sister_data', JSON.stringify({
    sisterName: state.sisterName,
    senderName: state.senderName,
    customNote: state.customNote
  }));

  applyCustomizationToDOM();
  closeCustomizer();
  showToast("✨ Personalization updated successfully!");
}

function loadSavedCustomization() {
  try {
    const saved = localStorage.getItem('sorry_sister_data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.sisterName) state.sisterName = data.sisterName;
      if (data.senderName) state.senderName = data.senderName;
      if (data.customNote) state.customNote = data.customNote;
    }
  } catch (e) {}
  
  applyCustomizationToDOM();
}

function applyCustomizationToDOM() {
  document.querySelectorAll('.sister-name-display').forEach(el => {
    el.textContent = state.sisterName;
  });

  document.querySelectorAll('.sender-name-display').forEach(el => {
    el.textContent = state.senderName;
  });

  if (state.customNote) {
    const noteEl = document.getElementById('apology-message-preview');
    if (noteEl) {
      noteEl.textContent = state.customNote;
    }
  }

  // Pre-fill inputs
  const sisterInput = document.getElementById('input-sister-name');
  const senderInput = document.getElementById('input-sender-name');
  const noteInput = document.getElementById('input-custom-note');

  if (sisterInput) sisterInput.value = state.sisterName;
  if (senderInput) senderInput.value = state.senderName;
  if (noteInput && state.customNote) noteInput.value = state.customNote;

  // Format today's date on certificate
  const certDateEl = document.getElementById('cert-date');
  if (certDateEl) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    certDateEl.textContent = `Ratified on ${new Date().toLocaleDateString(undefined, options)}`;
  }
}

// ==========================================================
// 8. TOAST NOTIFICATIONS
// ==========================================================
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>💌</span> <span>${msg}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 3000);
}

// ==========================================================
// 9. BACKGROUND FLOATING HEARTS & CONFETTI PARTICLES
// ==========================================================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;

let bgHearts = [];

function initBgHearts() {
  if (!bgCanvas || !bgCtx) return;
  
  function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  bgHearts = [];
  const heartCount = Math.floor(window.innerWidth / 40); // responsive count
  for (let i = 0; i < heartCount; i++) {
    bgHearts.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      size: 10 + Math.random() * 18,
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.15 + Math.random() * 0.25,
      color: ['#ff85a2', '#fbb1bd', '#b388ff', '#ffb4a2'][Math.floor(Math.random() * 4)]
    });
  }

  function renderHearts() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    bgHearts.forEach(h => {
      h.y -= h.speedY;
      h.x += h.speedX;

      if (h.y < -20) {
        h.y = bgCanvas.height + 20;
        h.x = Math.random() * bgCanvas.width;
      }

      bgCtx.save();
      bgCtx.globalAlpha = h.opacity;
      bgCtx.fillStyle = h.color;
      bgCtx.font = `${h.size}px serif`;
      bgCtx.fillText('♥', h.x, h.y);
      bgCtx.restore();
    });

    requestAnimationFrame(renderHearts);
  }

  renderHearts();
}

// Mega Confetti System
const confettiCanvas = document.getElementById('confetti-canvas');
const confCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];

function resizeConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);

function launchMegaConfetti(count = 100) {
  if (!confettiCanvas || !confCtx) return;
  resizeConfetti();

  const colors = ['#ff4071', '#9b5de5', '#f15bb5', '#fee440', '#00f5d4', '#ff70a6'];
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
      y: confettiCanvas.height / 2,
      w: 8 + Math.random() * 8,
      h: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: -10 - Math.random() * 12,
      gravity: 0.35,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  if (confettiParticles.length === count) {
    animateConfetti();
  }
}

function spawnMiniHearts(x, y) {
  if (!confettiCanvas || !confCtx) return;
  resizeConfetti();

  for (let i = 0; i < 8; i++) {
    confettiParticles.push({
      x: x,
      y: y,
      w: 14,
      h: 14,
      isHeart: true,
      color: '#ff4071',
      vx: (Math.random() - 0.5) * 8,
      vy: -3 - Math.random() * 6,
      gravity: 0.2,
      rot: 0,
      rotSpeed: 0,
      opacity: 1
    });
  }
  animateConfetti();
}

let confettiAnimId = null;
function animateConfetti() {
  if (!confCtx || !confettiCanvas) return;
  
  confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rot += p.rotSpeed;
    p.opacity -= 0.008;

    if (p.opacity <= 0 || p.y > confettiCanvas.height + 50) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confCtx.save();
    confCtx.globalAlpha = Math.max(0, p.opacity);
    confCtx.translate(p.x, p.y);
    confCtx.rotate((p.rot * Math.PI) / 180);

    if (p.isHeart) {
      confCtx.fillStyle = p.color;
      confCtx.font = '16px serif';
      confCtx.fillText('💖', 0, 0);
    } else {
      confCtx.fillStyle = p.color;
      confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }

    confCtx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

// ==========================================================
// 10. INITIALIZATION
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved personalization
  loadSavedCustomization();

  // Initialize Particle Background
  initBgHearts();

  // Setup Runaway Button Evasion
  setupRunawayListeners();

  // Top Nav Controls
  const soundBtn = document.getElementById('sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleMusic);
  }

  const customBtn = document.getElementById('customize-btn');
  if (customBtn) {
    customBtn.addEventListener('click', openCustomizer);
  }

  // Hash Navigation Handler
  function checkHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#page-')) {
      const p = parseInt(hash.replace('#page-', ''), 10);
      if (p >= 1 && p <= 4) {
        navigateToPage(p);
      }
    }
  }

  window.addEventListener('hashchange', checkHash);
  if (window.location.hash) {
    checkHash();
  }
});
