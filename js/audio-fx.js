/**
 * AudioFX - Synthetic Web Audio API Sound Generator
 * Generates futuristic micro-interaction sound effects without external audio files.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('alexis_portfolio_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (!this.initialized) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.initialized = true;
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHover() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.015);

    gain.gain.setValueAtTime(0.005, now);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  playToggle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [520, 780].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (i * 0.04));
      gain.gain.setValueAtTime(0.03, now + (i * 0.04));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.04) + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + (i * 0.04));
      osc.stop(now + (i * 0.04) + 0.08);
    });
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (idx * 0.07));
      gain.gain.setValueAtTime(0.04, now + (idx * 0.07));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.07) + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + (idx * 0.07));
      osc.stop(now + (idx * 0.07) + 0.25);
    });
  }

  playKey() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('alexis_portfolio_muted', this.muted);
    if (!this.muted) {
      this.playToggle();
    }
    return this.muted;
  }
}

window.soundEngine = new SoundEngine();
