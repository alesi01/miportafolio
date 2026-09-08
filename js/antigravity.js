/**
 * Antigravity Canvas Engine - Apple Ambient Depth
 * Simulates gentle celestial zero-gravity particles with subtle cursor attraction and depth of field.
 */
class AntigravityEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = window.innerWidth < 768 ? 35 : 65;
    this.mouse = {
      x: null,
      y: null,
      radius: 160,
      active: false
    };
    this.colors = this.getThemeColors();
    this.animationFrameId = null;

    this.init();
  }

  getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      return {
        particle: 'rgba(29, 29, 31, 0.25)',
        glow: 'rgba(0, 113, 227, 0.15)',
        line: 'rgba(0, 0, 0, 0.04)'
      };
    }
    return {
      particle: 'rgba(255, 255, 255, 0.45)',
      glow: 'rgba(41, 151, 255, 0.25)',
      line: 'rgba(255, 255, 255, 0.06)'
    };
  }

  updateColors() {
    this.colors = this.getThemeColors();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  init() {
    this.resize();
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(new Particle(this.width, this.height));
    }

    window.addEventListener('resize', () => {
      this.resize();
      this.numParticles = window.innerWidth < 768 ? 35 : 65;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    window.addEventListener('click', (e) => {
      this.createShockwave(e.clientX, e.clientY);
    });

    this.animate();
  }

  createShockwave(x, y) {
    this.particles.forEach((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220 && dist > 0) {
        const force = (220 - dist) / 220;
        p.vx += (dx / dist) * force * 6;
        p.vy += (dy / dist) * force * 6;
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.update(this.width, this.height, this.mouse);
      p.draw(this.ctx, this.colors);

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 110;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.colors.line.replace(/[\d\.]+\)$/, `${alpha})`);
          this.ctx.lineWidth = 0.6;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

class Particle {
  constructor(width, height) {
    this.reset(width, height, true);
  }

  reset(width, height, initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 10;
    this.baseVy = -(Math.random() * 0.4 + 0.15);
    this.vy = this.baseVy;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 1.8 + 0.8;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.02 + Math.random() * 0.015;
  }

  update(width, height, mouse) {
    this.vy += -0.008;
    if (this.vy < -1.4) this.vy = -1.4;

    this.vx *= 0.985;
    this.vy = this.vy * 0.985 + this.baseVy * 0.015;

    if (mouse.active && mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        
        this.vx += Math.cos(angle) * force * 0.8;
        this.vy += Math.sin(angle) * force * 0.8;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.pulse += this.pulseSpeed;

    if (this.y < -20) {
      this.reset(width, height, false);
    }
    if (this.x < -20) this.x = width + 10;
    if (this.x > width + 20) this.x = -10;
  }

  draw(ctx, colors) {
    const currentRadius = this.radius + Math.sin(this.pulse) * 0.3;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.4, currentRadius), 0, Math.PI * 2);
    ctx.fillStyle = colors.particle;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }
}

window.AntigravityEngine = AntigravityEngine;
