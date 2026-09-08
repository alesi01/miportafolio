/**
 * BorderGlow - Apple Pro Luxury Specular Edge Sheen
 * Inspired by Apple Vision Pro & Titanium edge reflections.
 * Tracks mouse near borders with silky smooth damping and specular illumination.
 */
class BorderGlow {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      edgeSensitivity: options.edgeSensitivity ?? 45,
      glowRadius: options.glowRadius ?? 90,
      glowIntensity: options.glowIntensity ?? 1.2,
      borderRadius: options.borderRadius ?? 24,
      backgroundColor: options.backgroundColor ?? 'var(--bg-card)',
      colors: options.colors ?? ['rgba(255,255,255,0.95)', 'rgba(210,230,255,0.85)', 'rgba(41,151,255,0.45)'],
      ...options
    };

    this.isHovered = false;
    this.bounds = null;
    this.init();
  }

  init() {
    this.el.classList.add('border-glow-container');
    this.el.style.setProperty('--border-glow-radius', `${this.options.borderRadius}px`);
    this.el.style.setProperty('--border-glow-spread', `${this.options.glowRadius}px`);

    // Set Apple Pro Titanium & Sapphire glow colors
    if (this.options.colors && this.options.colors.length) {
      this.el.style.setProperty('--glow-color-1', this.options.colors[0] || 'rgba(255,255,255,0.95)');
      this.el.style.setProperty('--glow-color-2', this.options.colors[1] || 'rgba(210,230,255,0.85)');
      this.el.style.setProperty('--glow-color-3', this.options.colors[2] || 'rgba(41,151,255,0.45)');
    }

    // Create specular glow border layer (strictly masked to the edge line)
    let glowLayer = this.el.querySelector('.border-glow-layer');
    if (!glowLayer) {
      glowLayer = document.createElement('div');
      glowLayer.className = 'border-glow-layer';
      this.el.prepend(glowLayer);
    }
    this.glowLayer = glowLayer;

    // Remove any legacy ambient blob elements
    const oldAmbient = this.el.querySelector('.border-glow-ambient');
    if (oldAmbient) oldAmbient.remove();

    this.attachEvents();
  }

  attachEvents() {
    this.el.addEventListener('mouseenter', () => {
      this.bounds = this.el.getBoundingClientRect();
      this.isHovered = true;
    });

    this.el.addEventListener('mousemove', (e) => {
      if (!this.bounds) this.bounds = this.el.getBoundingClientRect();
      const x = e.clientX - this.bounds.left;
      const y = e.clientY - this.bounds.top;

      // Distance to nearest outer edge
      const distLeft = x;
      const distRight = this.bounds.width - x;
      const distTop = y;
      const distBottom = this.bounds.height - y;
      const minDist = Math.min(distLeft, distRight, distTop, distBottom);

      const sens = this.options.edgeSensitivity || 45;

      // STRICT EDGE CHECK: Glow ONLY when cursor is near the outer edges!
      if (minDist >= sens || x < 0 || y < 0 || x > this.bounds.width || y > this.bounds.height) {
        // Cursor is in the interior of the box -> 0 opacity, completely off!
        this.el.classList.remove('glow-active');
        this.el.style.setProperty('--glow-opacity', '0');
        return;
      }

      this.el.classList.add('glow-active');
      // Smooth falloff from 1.0 (directly on the edge) down to 0 (at distance = sens)
      const edgeFactor = Math.max(0, 1 - (minDist / sens));
      const opacity = Math.min(edgeFactor * this.options.glowIntensity, 1.25);

      this.el.style.setProperty('--glow-x', `${x}px`);
      this.el.style.setProperty('--glow-y', `${y}px`);
      this.el.style.setProperty('--glow-opacity', opacity.toFixed(3));
    });

    this.el.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.el.classList.remove('glow-active');
      this.el.style.setProperty('--glow-opacity', '0');
      this.bounds = null;
    });

    window.addEventListener('resize', () => {
      this.bounds = null;
    });
  }
}

function initAllBorderGlows() {
  const elements = document.querySelectorAll('[data-border-glow]');
  elements.forEach((el) => {
    const rawColors = el.getAttribute('data-glow-colors');
    const colors = rawColors ? rawColors.split(',').map(c => c.trim()) : ['rgba(255,255,255,0.95)', 'rgba(210,230,255,0.85)', 'rgba(41,151,255,0.45)'];
    const radius = parseFloat(el.getAttribute('data-glow-radius') || '90');
    const bRadius = parseFloat(el.getAttribute('data-border-radius') || '24');
    const sensitivity = parseFloat(el.getAttribute('data-edge-sensitivity') || '45');

    new BorderGlow(el, {
      colors,
      glowRadius: radius,
      borderRadius: bRadius,
      edgeSensitivity: sensitivity,
      glowIntensity: 1.2
    });
  });
}

window.BorderGlow = BorderGlow;
window.initAllBorderGlows = initAllBorderGlows;
