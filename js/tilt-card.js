/**
 * TiltCard - 3D Gyroscopic & Mouse Tilt Physics with Specular Glare
 */
class TiltCardController {
  constructor() {
    this.cards = document.querySelectorAll('[data-tilt]');
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      this.attachEvents(card);
    });

    // Mobile Gyroscope support (if permitted)
    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
    }
  }

  attachEvents(card) {
    let bounds;
    const maxTilt = parseFloat(card.getAttribute('data-tilt-max') || '14');

    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out';
    };

    const onMouseMove = (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = mouseX / bounds.width;
      const yPct = mouseY / bounds.height;

      const rotateX = (0.5 - yPct) * (maxTilt * 2);
      const rotateY = (xPct - 0.5) * (maxTilt * 2);

      card.style.setProperty('--mouse-x', `${xPct * 100}%`);
      card.style.setProperty('--mouse-y', `${yPct * 100}%`);

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const onMouseLeave = () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      bounds = null;
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  }

  handleOrientation(e) {
    if (!e.gamma || !e.beta) return;
    // Gamma is left-to-right tilt in degrees [-90, 90]
    // Beta is front-to-back tilt in degrees [-180, 180]
    const gamma = Math.min(Math.max(e.gamma, -25), 25);
    const beta = Math.min(Math.max(e.beta - 45, -25), 25);

    this.cards.forEach((card) => {
      const rotateX = -beta * 0.4;
      const rotateY = gamma * 0.4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });
  }
}

window.TiltCardController = TiltCardController;
