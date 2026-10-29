/**
 * Eli 🌸 | Main Application Controller
 * Audio Synthesizer, Petals Particle Engine, Themes, Ariana Vibes & UI Interaction
 */

// =====================================================================
// 1. Web Audio Synthesizer (Zero-dependency chic sound effects)
// =====================================================================
class GlamSoundEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  play(type = 'click') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      switch (type) {
        case 'click':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;

        case 'pop':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;

        case 'soft':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;

        case 'chime':
          // C-major sparkle triad
          [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const chordOsc = this.ctx.createOscillator();
            const chordGain = this.ctx.createGain();
            chordOsc.connect(chordGain);
            chordGain.connect(this.ctx.destination);
            chordOsc.type = 'sine';
            chordOsc.frequency.setValueAtTime(freq, now + idx * 0.04);
            chordGain.gain.setValueAtTime(0.06, now + idx * 0.04);
            chordGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);
            chordOsc.start(now + idx * 0.04);
            chordOsc.stop(now + idx * 0.04 + 0.25);
          });
          break;

        case 'celebrate':
          // Arpeggio sparkle for '='
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const chordOsc = this.ctx.createOscillator();
            const chordGain = this.ctx.createGain();
            chordOsc.connect(chordGain);
            chordGain.connect(this.ctx.destination);
            chordOsc.type = 'sine';
            chordOsc.frequency.setValueAtTime(freq, now + idx * 0.05);
            chordGain.gain.setValueAtTime(0.08, now + idx * 0.05);
            chordGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);
            chordOsc.start(now + idx * 0.05);
            chordOsc.stop(now + idx * 0.05 + 0.35);
          });
          break;

        case 'clear':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

// =====================================================================
// 2. Sakura Petals Floating Canvas Engine
// =====================================================================
class PetalsCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.enabled = true;
    this.petals = [];
    this.maxPetals = 35;
    
    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.initPetals();
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initPetals() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: 10 + Math.random() * 14,
      speedY: 0.8 + Math.random() * 1.4,
      speedX: -0.4 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      opacity: 0.4 + Math.random() * 0.45,
      swayFreq: 0.02 + Math.random() * 0.02,
      swayAmp: 1 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    };
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    return this.enabled;
  }

  animate() {
    if (this.enabled) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.y += p.speedY;
        p.phase += p.swayFreq;
        p.x += Math.sin(p.phase) * p.swayAmp + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > this.height + 20 || p.x < -30 || p.x > this.width + 30) {
          this.petals[i] = this.createPetal(false);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // Draw soft Sakura Petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size);
        ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
        
        // Gradient fill for petal
        const grad = ctx.createLinearGradient(-p.size / 2, -p.size / 2, p.size / 2, p.size);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#ffb6c1');
        grad.addColorStop(1, '#ff69b4');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
      }
    }
    requestAnimationFrame(this.animate);
  }
}

// =====================================================================
// 3. Ariana Grande Quotes & Vibe Engine
// =====================================================================
const arianaQuotes = [
  "\"I want it, I got it... agora vamos calcular! 💅✨\"",
  "\"Right now, I'm in a state of mind, calculando com muito glamour! 🌸\"",
  "\"Switching them positions for you... e ajustando os ângulos para DEG! 📐💖\"",
  "\"God is a woman, e essa fórmula ficou perfeita! 👑✨\"",
  "\"Baby, you might need to seat down, esse resultado foi grandioso! 💎\"",
  "\"7 Rings na mão e 100% de precisão nos cálculos do Eli! 💍🌸\"",
  "\"Just keep breathin' and calculating, darling! 🎶💅\"",
  "\"Don't call me angel... call me Rainha da Matemática! 👼💖\""
];

// =====================================================================
// 4. Confetti / Sparkle Burst Effect
// =====================================================================
function triggerCelebrationConfetti(anchorEl) {
  const colors = ['#ff4081', '#ff80ab', '#ffd54f', '#ffffff', '#ea80fc', '#00e5ff'];
  const rect = anchorEl ? anchorEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 35; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    const size = 6 + Math.random() * 8;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 160;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 40;

    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }
}

// =====================================================================
// 5. Main App Initialization & Event Wiring
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Sound Engine
  const sound = new GlamSoundEngine();

  // Analog Clock
  const clock = new LuxuryAnalogClock('analog-clock-canvas');

  // Petals Canvas
  const petals = new PetalsCanvasEngine('petals-canvas');

  // Themes
  const themes = [
    { id: 'sweetener', name: 'Sweetener Pink 🌸' },
    { id: 'lavender', name: 'Lavender Dream 💜' },
    { id: 'rainbow', name: 'Prism Rainbow 🌈' },
    { id: 'midnight', name: 'Midnight Diva 🌙' }
  ];
  let currentThemeIndex = 0;

  const btnCycleTheme = document.getElementById('btn-cycle-theme');
  const themeNameDisplay = document.getElementById('theme-name-display');

  function applyTheme(index) {
    currentThemeIndex = index % themes.length;
    const theme = themes[currentThemeIndex];
    document.body.setAttribute('data-theme', theme.id);
    if (themeNameDisplay) themeNameDisplay.textContent = theme.name;
    try {
      localStorage.setItem('eli_selected_theme', theme.id);
    } catch (e) {}
  }

  // Restore saved theme
  try {
    const savedTheme = localStorage.getItem('eli_selected_theme');
    if (savedTheme) {
      const idx = themes.findIndex(t => t.id === savedTheme);
      if (idx !== -1) currentThemeIndex = idx;
    }
  } catch (e) {}
  applyTheme(currentThemeIndex);

  if (btnCycleTheme) {
    btnCycleTheme.addEventListener('click', () => {
      sound.play('pop');
      applyTheme(currentThemeIndex + 1);
    });
  }

  // Sound Toggle Button
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      btnToggleSound.classList.toggle('active', isEnabled);
      const label = btnToggleSound.querySelector('.btn-label');
      if (label) label.textContent = isEnabled ? 'Som: ON' : 'Som: OFF';
      if (soundIcon) soundIcon.className = isEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      if (isEnabled) sound.play('pop');
    });
  }

  // Petals Toggle Button
  const btnTogglePetals = document.getElementById('btn-toggle-petals');
  if (btnTogglePetals) {
    btnTogglePetals.addEventListener('click', () => {
      sound.play('soft');
      const isEnabled = petals.toggle();
      btnTogglePetals.classList.toggle('active', isEnabled);
    });
  }

  // Ariana Grande Quotes Interaction
  const arianaQuoteText = document.getElementById('ariana-quote-text');
  const btnArianaVibe = document.getElementById('btn-ariana-vibe');
  const musicBars = document.getElementById('music-bars');
  let quoteIdx = 0;

  function nextArianaQuote() {
    sound.play('chime');
    quoteIdx = (quoteIdx + 1) % arianaQuotes.length;
    if (arianaQuoteText) {
      arianaQuoteText.style.opacity = '0';
      setTimeout(() => {
        arianaQuoteText.textContent = arianaQuotes[quoteIdx];
        arianaQuoteText.style.opacity = '1';
      }, 200);
    }
    triggerCelebrationConfetti(document.getElementById('ariana-photo'));
  }

  if (btnArianaVibe) btnArianaVibe.addEventListener('click', nextArianaQuote);
  if (musicBars) musicBars.addEventListener('click', nextArianaQuote);

  // Screen DOM elements
  const expressionEl = document.getElementById('calc-expression');
  const resultEl = document.getElementById('calc-result');
  const angleBadge = document.getElementById('angle-mode-badge');
  const btnCopyResult = document.getElementById('btn-copy-result');
  const copyTooltip = document.getElementById('copy-tooltip');
  const historyListEl = document.getElementById('history-list');
  const btnClearHistory = document.getElementById('btn-clear-history');

  // Trigger tactile vibration on mobile devices
  function triggerHaptic() {
    if (navigator && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(12); } catch (e) {}
    }
  }

  // Calculator Engine Setup
  const calc = new ScientificCalculator({
    playAudio: (type) => sound.play(type),
    onUpdate: () => {
      if (expressionEl) {
        expressionEl.textContent = calc.expression || '0';
        expressionEl.scrollLeft = expressionEl.scrollWidth;
      }
      if (resultEl) {
        const len = String(calc.currentValue).length;
        resultEl.classList.toggle('very-long-text', len > 13);
        resultEl.classList.toggle('long-text', len > 8 && len <= 13);
        resultEl.textContent = calc.currentValue;
        resultEl.scrollLeft = resultEl.scrollWidth;
      }
      if (angleBadge) {
        angleBadge.textContent = calc.angleMode;
      }
    },
    onCalculate: (res) => {
      triggerHaptic();
      const equalsBtn = document.getElementById('btn-equals');
      triggerCelebrationConfetti(equalsBtn);
    },
    onHistoryChange: (history) => {
      renderHistory(history);
    }
  });

  // Mobile Segmented Navigation Tabs Handler
  const mobileNav = document.getElementById('mobile-nav-bar');
  const mainDashboard = document.getElementById('main-dashboard');
  if (mobileNav && mainDashboard) {
    mobileNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.mobile-nav-btn');
      if (!btn) return;
      triggerHaptic();
      sound.play('soft');
      const tab = btn.getAttribute('data-tab');
      mainDashboard.setAttribute('data-active-tab', tab);
      mobileNav.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Collapsible Scientific Keypad Toggle
  const btnToggleSciDrawer = document.getElementById('btn-toggle-sci-drawer');
  const scientificGrid = document.getElementById('scientific-grid');
  if (btnToggleSciDrawer && scientificGrid) {
    btnToggleSciDrawer.addEventListener('click', () => {
      triggerHaptic();
      sound.play('pop');
      scientificGrid.classList.toggle('mobile-hidden');
    });
  }

  // Render History List
  function renderHistory(history) {
    if (!historyListEl) return;
    if (!history || history.length === 0) {
      historyListEl.innerHTML = `
        <div class="history-empty" id="history-empty-placeholder">
          <span class="empty-icon">🌸</span>
          <p>Nenhum cálculo recente ainda.</p>
          <small>Calcule algo glamouroso com o Eli!</small>
        </div>
      `;
      return;
    }

    historyListEl.innerHTML = '';
    history.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div class="history-item-top">
          <span class="history-item-expr" title="${item.expr}">${item.expr}</span>
          <span class="history-item-time">${item.timestamp}</span>
        </div>
        <div class="history-item-result">= ${item.result}</div>
      `;
      div.addEventListener('click', () => {
        calc.recallHistory(item);
      });
      historyListEl.appendChild(div);
    });
  }

  // Initial history render
  renderHistory(calc.history);

  // Clear History
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      sound.play('clear');
      calc.clearHistory();
    });
  }

  // Angle Mode (DEG/RAD) Toggle Button
  const btnToggleRad = document.getElementById('btn-toggle-rad');
  if (btnToggleRad) {
    btnToggleRad.addEventListener('click', () => {
      calc.toggleAngleMode();
    });
  }

  // Copy Result to Clipboard
  if (btnCopyResult) {
    btnCopyResult.addEventListener('click', async () => {
      sound.play('chime');
      const textToCopy = calc.currentValue;
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }

      if (copyTooltip) {
        copyTooltip.classList.add('show');
        setTimeout(() => copyTooltip.classList.remove('show'), 1600);
      }
    });
  }

  // Keypad Click Event Delegation
  const keyboard = document.getElementById('calc-keyboard');
  if (keyboard) {
    keyboard.addEventListener('click', (e) => {
      const btn = e.target.closest('.calc-key');
      if (!btn) return;
      triggerHaptic();

      const digit = btn.getAttribute('data-val');
      const action = btn.getAttribute('data-action');

      if (digit !== null) {
        if (digit === '.') {
          calc.inputDot();
        } else {
          calc.inputDigit(digit);
        }
        return;
      }

      if (action) {
        switch (action) {
          case 'op':
            calc.inputOperator(btn.getAttribute('data-val'));
            break;
          case 'calculate':
            calc.calculate();
            break;
          case 'clear-all':
            calc.clearAll();
            break;
          case 'backspace':
            calc.backspace();
            break;
          case 'negate':
            calc.negate();
            break;
          case '2nd':
            calc.toggleSecond();
            break;
          case 'hyp':
            calc.toggleHyp();
            break;
          case 'open-paren':
            calc.inputParenthesis('(');
            break;
          case 'close-paren':
            calc.inputParenthesis(')');
            break;
          case 'pi':
            calc.inputConstant('pi');
            break;
          case 'e':
            calc.inputConstant('e');
            break;
          case 'rand':
            calc.inputRandom();
            break;
          default:
            calc.executeFunction(action);
            break;
        }
      }
    });
  }

  // Memory Ribbon Buttons
  const memoryRibbon = document.querySelector('.memory-ribbon');
  if (memoryRibbon) {
    memoryRibbon.addEventListener('click', (e) => {
      const btn = e.target.closest('.mem-btn');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action) {
        calc.memoryAction(action);
      }
    });
  }

  // Physical Keyboard Handling
  window.addEventListener('keydown', (e) => {
    // Avoid interfering if user is focused on an input element
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const key = e.key;

    if (key >= '0' && key <= '9') {
      calc.inputDigit(key);
      e.preventDefault();
    } else if (key === '.' || key === ',') {
      calc.inputDot();
      e.preventDefault();
    } else if (key === '+' || key === '-') {
      calc.inputOperator(key);
      e.preventDefault();
    } else if (key === '*' || key === 'x' || key === 'X') {
      calc.inputOperator('*');
      e.preventDefault();
    } else if (key === '/') {
      calc.inputOperator('/');
      e.preventDefault();
    } else if (key === '^') {
      calc.inputOperator('^');
      e.preventDefault();
    } else if (key === 'Enter' || key === '=') {
      calc.calculate();
      e.preventDefault();
    } else if (key === 'Backspace') {
      calc.backspace();
      e.preventDefault();
    } else if (key === 'Escape') {
      calc.clearAll();
      e.preventDefault();
    } else if (key === '(' || key === ')') {
      calc.inputParenthesis(key);
      e.preventDefault();
    } else if (key === '%') {
      calc.executeFunction('pct');
      e.preventDefault();
    } else if (key === 'p' || key === 'P') {
      calc.inputConstant('pi');
      e.preventDefault();
    } else if (key === 'e' || key === 'E') {
      calc.inputConstant('e');
      e.preventDefault();
    }
  });

  // Initial trigger to refresh display
  calc.onUpdate();
});
