/**
 * Eli 🌸 | Luxury Analog Timepiece Engine
 * High-DPI Canvas Rendering with Smooth Sweeping Second Hand
 */

class LuxuryAnalogClock {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.digitalTimeEl = document.getElementById('clock-digital-time');
    this.digitalDateEl = document.getElementById('clock-digital-date');

    this.dpr = window.devicePixelRatio || 1;
    this.initCanvasSize();

    // Listen for resize to maintain sharpness
    window.addEventListener('resize', () => this.initCanvasSize());

    // Start high-precision animation loop
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  initCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 240, 280);
    this.width = size;
    this.height = size;
    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.radius = size / 2;
  }

  getThemeColors() {
    const computed = getComputedStyle(document.body);
    return {
      primaryPink: computed.getPropertyValue('--primary-pink').trim() || '#ff4081',
      softRose: computed.getPropertyValue('--soft-rose').trim() || '#ff80ab',
      deepMagenta: computed.getPropertyValue('--deep-magenta').trim() || '#c2185b',
      dialBg: computed.getPropertyValue('--clock-dial-bg').trim() || '#fffbfd',
      hourHand: computed.getPropertyValue('--clock-hand-hour').trim() || '#c2185b',
      minHand: computed.getPropertyValue('--clock-hand-min').trim() || '#e91e63',
      secHand: computed.getPropertyValue('--clock-hand-sec').trim() || '#ff1744',
      accentGold: computed.getPropertyValue('--accent-gold').trim() || '#ffd54f'
    };
  }

  render() {
    const now = new Date();
    this.drawClock(now);
    this.updateDigital(now);
    requestAnimationFrame(this.render);
  }

  updateDigital(now) {
    if (this.digitalTimeEl) {
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      this.digitalTimeEl.textContent = `${h}:${m}:${s}`;
    }

    if (this.digitalDateEl) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const dateStr = now.toLocaleDateString('pt-BR', options);
      this.digitalDateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
  }

  drawClock(now) {
    const ctx = this.ctx;
    const r = this.radius;
    const colors = this.getThemeColors();

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    ctx.translate(r, r);

    // 1. Outer Bezel Shadow & Metallic Gradient
    ctx.beginPath();
    ctx.arc(0, 0, r - 4, 0, Math.PI * 2);
    ctx.fillStyle = colors.dialBg;
    ctx.shadowColor = 'rgba(233, 30, 99, 0.22)';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // Bezel Rim
    const bezelGrad = ctx.createLinearGradient(-r, -r, r, r);
    bezelGrad.addColorStop(0, colors.accentGold);
    bezelGrad.addColorStop(0.35, colors.softRose);
    bezelGrad.addColorStop(0.7, colors.primaryPink);
    bezelGrad.addColorStop(1, colors.accentGold);

    ctx.beginPath();
    ctx.arc(0, 0, r - 5, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = bezelGrad;
    ctx.stroke();

    // Inner subtle ring
    ctx.beginPath();
    ctx.arc(0, 0, r - 16, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 64, 129, 0.2)';
    ctx.stroke();

    // 2. Hallmark "Eli 🌸" Text on Dial
    ctx.save();
    ctx.fillStyle = colors.deepMagenta;
    ctx.font = 'bold 15px "Dancing Script", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('Eli 🌸', 0, -r * 0.32);

    ctx.font = '600 7px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(140, 93, 115, 0.85)';
    ctx.letterSpacing = '1px';
    ctx.fillText('HAUTE HORLOGERIE', 0, -r * 0.24);

    ctx.font = '500 7px "Outfit", sans-serif';
    ctx.fillText('DIVA EDITION', 0, r * 0.42);
    ctx.restore();

    // 3. Dial Hour and Minute Ticks
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI) / 30;
      ctx.save();
      ctx.rotate(angle);

      if (i % 5 === 0) {
        // Main 5-minute / hour markers
        const isQuarter = i % 15 === 0;
        ctx.beginPath();
        ctx.moveTo(0, -r + 20);
        ctx.lineTo(0, -r + (isQuarter ? 32 : 28));
        ctx.lineWidth = isQuarter ? 3.5 : 2.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isQuarter ? colors.deepMagenta : colors.primaryPink;
        ctx.stroke();

        // Little rose diamond on quarters
        if (isQuarter) {
          ctx.beginPath();
          ctx.arc(0, -r + 37, 2, 0, Math.PI * 2);
          ctx.fillStyle = colors.accentGold;
          ctx.fill();
        }
      } else {
        // Minute dots
        ctx.beginPath();
        ctx.arc(0, -r + 22, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 64, 129, 0.35)';
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Time Calculation
    const ms = now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;

    // 5. Hour Hand (Faceted Sword Hand)
    ctx.save();
    ctx.rotate((hr * Math.PI) / 6);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    
    ctx.beginPath();
    ctx.moveTo(-4, 12);
    ctx.lineTo(-3, -r * 0.5);
    ctx.lineTo(0, -r * 0.56);
    ctx.lineTo(3, -r * 0.5);
    ctx.lineTo(4, 12);
    ctx.closePath();
    ctx.fillStyle = colors.hourHand;
    ctx.fill();

    // Center ridge line
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -r * 0.54);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();
    ctx.restore();

    // 6. Minute Hand (Long Elegant Sword Hand)
    ctx.save();
    ctx.rotate((min * Math.PI) / 30);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    ctx.beginPath();
    ctx.moveTo(-3, 14);
    ctx.lineTo(-2, -r * 0.72);
    ctx.lineTo(0, -r * 0.78);
    ctx.lineTo(2, -r * 0.72);
    ctx.lineTo(3, 14);
    ctx.closePath();
    ctx.fillStyle = colors.minHand;
    ctx.fill();

    // Center ridge line
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(0, -r * 0.76);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.stroke();
    ctx.restore();

    // 7. Sweeping Second Hand (Slim & Radiant with counter-balance)
    ctx.save();
    ctx.rotate((sec * Math.PI) / 30);
    ctx.shadowColor = colors.secHand;
    ctx.shadowBlur = 6;

    // Tail & Counterbalance circle
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.lineTo(0, -r * 0.82);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.secHand;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 12, 4, 0, Math.PI * 2);
    ctx.fillStyle = colors.secHand;
    ctx.fill();

    // Tip pip
    ctx.beginPath();
    ctx.arc(0, -r * 0.7, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = colors.accentGold;
    ctx.fill();
    ctx.restore();

    // 8. Center Pin & Gem Cap
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = colors.accentGold;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.deepMagenta;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}

// Auto-initialize when DOM is ready
window.LuxuryAnalogClock = LuxuryAnalogClock;
