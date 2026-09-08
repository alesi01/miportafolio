/**
 * Lanyard Badge - Interactive Physics Hanging Badge
 * Simulates a real-life physical conference lanyard badge with rope physics,
 * spring pendulum oscillation, 3D tilt, drag & release dynamics.
 */

class LanyardBadge {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = {
      githubUrl: options.githubUrl || 'https://github.com/alesi01',
      githubUsername: options.githubUsername || 'alesi01',
      linkedinUrl: options.linkedinUrl || 'https://www.linkedin.com/in/alexis-fernando-rojas-94922b250',
      avatarUrl: options.avatarUrl || 'assets/alexis-profile.png',
      badgeTitle: options.badgeTitle || 'Alexis',
      badgeRole: options.badgeRole || 'Full Stack & Data Analyst',
      restLength: options.restLength || 135, // Length of lanyard strap
      stiffness: options.stiffness || 0.042, // Spring stiffness
      damping: options.damping || 0.89,      // Inertial damping
      gravity: options.gravity || 0.55,      // Downward gravity
      ...options
    };

    // Physics State
    this.anchor = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.restPos = { x: 0, y: 0 };
    this.rot = 0;
    this.rotVel = 0;

    // Interaction State
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.hasMoved = false;
    this.mouseOffset = { x: 0, y: 0 };
    this.animId = null;

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="lanyard-wrapper" id="lanyard-wrapper">
        <canvas class="lanyard-rope-canvas" id="lanyard-rope-canvas"></canvas>
        <div class="lanyard-clip" id="lanyard-clip">
          <div class="lanyard-ring"></div>
          <div class="lanyard-hook"></div>
        </div>
        <div class="lanyard-card" id="lanyard-card" title="Arrastra el badge o haz clic para interactuar">
          <div class="card-sheen" id="lanyard-sheen"></div>
          <div class="badge-hole"></div>
          <div class="badge-inner">
            <div class="badge-top-bar">
              <div class="badge-chip">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
              </div>
              <div class="badge-status-dot" title="Activo"></div>
            </div>

            <div class="badge-photo-container">
              <div class="badge-photo-frame">
                <img src="${this.options.avatarUrl}" alt="${this.options.badgeTitle}" class="badge-photo-img" loading="eager" decoding="sync" />
              </div>
            </div>

            <div class="badge-info">
              <h3 class="badge-name">${this.options.badgeTitle}</h3>
              <p class="badge-role">${this.options.badgeRole}</p>

              <div class="badge-social-pills">
                <a href="${this.options.githubUrl}" target="_blank" rel="noopener" class="badge-social-pill github" title="Abrir GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                  </svg>
                  <span>github.com/${this.options.githubUsername}</span>
                </a>

                <a href="${this.options.linkedinUrl}" target="_blank" rel="noopener" class="badge-social-pill linkedin" title="Abrir LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>linkedin.com/in/alexis-rojas</span>
                </a>
              </div>
            </div>

            <div class="badge-bottom-bar">
              <div class="badge-barcode">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
              <span class="badge-nfc-label">PASS_2026 // PRO</span>
            </div>
          </div>
          <div class="lanyard-drag-hint">Drag me!</div>
        </div>
      </div>
    `;

    this.card = this.container.querySelector('#lanyard-card');
    this.clip = this.container.querySelector('#lanyard-clip');
    this.canvas = this.container.querySelector('#lanyard-rope-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sheen = this.container.querySelector('#lanyard-sheen');

    this.updateDimensions();
    this.attachEvents();
    this.animate();
  }

  updateDimensions() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 420;
    this.height = Math.max(rect.height || 550, 520);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Anchor at top center of container
    this.anchor.x = this.width / 2;
    this.anchor.y = 0;

    // Resting badge position hanging directly beneath anchor
    this.restPos.x = this.anchor.x;
    this.restPos.y = this.anchor.y + this.options.restLength + 60;

    if (!this.pos.x && !this.pos.y) {
      this.pos.x = this.restPos.x;
      this.pos.y = this.restPos.y;
    }
  }

  attachEvents() {
    window.addEventListener('resize', () => this.updateDimensions());

    // Pointer down on card
    const onStart = (clientX, clientY, targetEl) => {
      // Don't drag if clicking directly on a link
      if (targetEl && targetEl.closest('a')) {
        return;
      }

      this.isDragging = true;
      this.hasMoved = false;
      this.dragStart.x = clientX;
      this.dragStart.y = clientY;

      const cardRect = this.card.getBoundingClientRect();
      this.mouseOffset.x = clientX - (cardRect.left + cardRect.width / 2);
      this.mouseOffset.y = clientY - (cardRect.top + 30);

      this.card.classList.add('dragging');
      if (window.soundEngine) window.soundEngine.playHover();
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDragging) return;

      const contRect = this.container.getBoundingClientRect();
      const targetX = clientX - contRect.left - this.mouseOffset.x;
      const targetY = clientY - contRect.top - this.mouseOffset.y;

      const distMoved = Math.hypot(clientX - this.dragStart.x, clientY - this.dragStart.y);
      if (distMoved > 7) {
        this.hasMoved = true;
      }

      // Constrain position with elastic pull
      this.vel.x = (targetX - this.pos.x) * 0.48;
      this.vel.y = (targetY - this.pos.y) * 0.48;
      this.pos.x = targetX;
      this.pos.y = Math.max(targetY, 60); // Don't let it drag above anchor
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.card.classList.remove('dragging');

      if (this.hasMoved) {
        if (window.soundEngine) window.soundEngine.playClick();
      }
    };

    // Mouse Listeners
    this.card.addEventListener('mousedown', (e) => {
      if (!e.target.closest('a')) {
        e.preventDefault();
      }
      onStart(e.clientX, e.clientY, e.target);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        onMove(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => onEnd());

    // Touch Listeners for Mobile
    this.card.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        onStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => onEnd());
  }

  animate() {
    this.updatePhysics();
    this.render();
    this.animId = requestAnimationFrame(() => this.animate());
  }

  updatePhysics() {
    if (!this.isDragging) {
      // Spring force toward static resting position
      const fx = -this.options.stiffness * (this.pos.x - this.restPos.x);
      const fy = -this.options.stiffness * (this.pos.y - this.restPos.y);

      this.vel.x = (this.vel.x + fx) * this.options.damping;
      this.vel.y = (this.vel.y + fy) * this.options.damping;

      // Threshold to stop micro-jitter and bring to complete stillness
      if (
        Math.abs(this.vel.x) < 0.003 &&
        Math.abs(this.vel.y) < 0.003 &&
        Math.abs(this.pos.x - this.restPos.x) < 0.05 &&
        Math.abs(this.pos.y - this.restPos.y) < 0.05
      ) {
        this.pos.x = this.restPos.x;
        this.pos.y = this.restPos.y;
        this.vel.x = 0;
        this.vel.y = 0;
      } else {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
      }
    }

    // Dynamic rotation based strictly on horizontal swing displacement & velocity
    const dx = this.pos.x - this.anchor.x;
    const targetRot = (dx / 180) * 30 + (this.vel.x * 2.2);
    this.rot += (targetRot - this.rot) * 0.2;
    if (!this.isDragging && Math.abs(this.rot) < 0.01) {
      this.rot = 0;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const startX = this.anchor.x;
    const startY = this.anchor.y;

    // The card is centered horizontally at this.pos.x
    // Top of the card is at this.pos.y
    // Center of badge-hole is at this.pos.y + 17.5px
    // The clip is positioned with bottom hook inside hole, and top of ring at this.pos.y - 13px
    const endX = this.pos.x;
    const endY = this.pos.y - 13; // Connects directly to top of ring

    // Control points for natural gravity curve
    const midX = (startX + endX) / 2 + (this.vel.x * 2.8);
    const midY = (startY + endY) / 2 + Math.abs(endX - startX) * 0.16;

    // 1. Draw Grey Titanium Ribbon (Visible on both Dark and Light modes)
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.quadraticCurveTo(midX, midY, endX, endY);
    this.ctx.lineWidth = 16;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#52525b';
    this.ctx.shadowColor = 'rgba(0,0,0,0.35)';
    this.ctx.shadowBlur = 8;
    this.ctx.stroke();

    // Inner Ribbon Body (Refined neutral grey)
    this.ctx.lineWidth = 12;
    this.ctx.strokeStyle = '#9ca3af';
    this.ctx.stroke();

    // Center seam stitching
    this.ctx.lineWidth = 1.2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.stroke();
    this.ctx.restore();

    // 2. Position Metallic Clip - Perfectly centered and piercing into badge hole
    if (this.clip) {
      this.clip.style.transform = `translate3d(${endX}px, ${this.pos.y + 18}px, 0) translate(-50%, -100%) rotate(${this.rot * 0.85}deg)`;
    }

    // 3. Position and 3D Rotate Badge Card - crisp 2D when stationary to prevent blur, dynamic 3D when swinging
    if (this.card) {
      if (!this.isDragging && Math.abs(this.vel.x) < 0.005 && Math.abs(this.vel.y) < 0.005 && Math.abs(this.rot) < 0.02) {
        this.card.style.transform = `translate3d(${Math.round(this.pos.x)}px, ${Math.round(this.pos.y)}px, 0) translate(-50%, 0)`;
      } else {
        const dynamicTiltX = -this.vel.y * 1.6;
        const dynamicTiltY = this.vel.x * 2.4;
        this.card.style.transform = `translate3d(${this.pos.x.toFixed(1)}px, ${this.pos.y.toFixed(1)}px, 0) translate(-50%, 0) rotateZ(${this.rot.toFixed(2)}deg) rotateX(${dynamicTiltX.toFixed(2)}deg) rotateY(${dynamicTiltY.toFixed(2)}deg)`;
      }

      // Specular Sheen reflection
      if (this.sheen) {
        const sheenX = 50 + (this.rot * 2.5);
        this.sheen.style.background = `radial-gradient(circle at ${sheenX}% 30%, rgba(255,255,255,0.25), transparent 70%)`;
      }
    }
  }
}

window.LanyardBadge = LanyardBadge;

