/**
 * Main Application Controller
 * Handles UI animations, custom cursor, theme switching, projects, modals, and confetti.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Antigravity Canvas
  if (document.getElementById('antigravity-canvas')) {
    window.antigravityInstance = new AntigravityEngine('antigravity-canvas');
  }

  // 2. Initialize 3D Tilt Cards
  if (window.TiltCardController) {
    new TiltCardController();
  }

  // 2.2 Initialize Physical Draggable Lanyard Badge (ReactBits)
  if (window.LanyardBadge && document.getElementById('lanyard-container')) {
    window.lanyardInstance = new LanyardBadge('lanyard-container', {
      githubUrl: 'https://github.com/alesi01',
      githubUsername: 'alesi01',
      linkedinUrl: 'https://www.linkedin.com/in/alexis-fernando-rojas-94922b250',
      avatarUrl: 'assets/alexis-profile.png',
      badgeTitle: 'Alexis',
      badgeRole: 'Full Stack & Data Analyst'
    });
  }

  // 2.5 Initialize Reactive BorderGlow
  if (window.initAllBorderGlows) {
    window.initAllBorderGlows();
  }

  // 3. Initialize Interactive Terminal
  if (window.InteractiveTerminal) {
    new InteractiveTerminal();
  }

  // 4. Setup Theme Toggle (Dark / Light)
  setupThemeToggle();

  // 5. Setup Sound FX & Audio Indicator
  setupAudioControl();

  // 6. ReactBits Pill Nav (Sliding highlight capsule & color indicator)
  setupPillNav();

  // 7. Setup Magnetic Buttons
  setupMagneticButtons();

  // 8. Setup Interactive Bio Tabs
  setupBioTabs();

  // 9. Setup Projects Filter & Modal
  setupProjectsAndModal();

  // 10. Counter Animation on Scroll
  setupMetricCounters();

  // 11. Confetti & Contact Form
  setupContactAndCV();

  // 12. Infinite Marquee Auto-Duplicate
  setupInfiniteMarquee();

  // 13. Mobile Navigation Menu
  setupMobileNav();

  // 14. Smooth Navbar On Scroll
  setupScrollNavbar();
});

/**
 * THEME TOGGLE CONTROLLER
 */
function setupThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('alexis_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('alexis_theme', nextTheme);
      updateThemeIcon(nextTheme);

      if (window.antigravityInstance) {
        window.antigravityInstance.updateColors();
      }

      if (window.soundEngine) {
        window.soundEngine.playToggle();
      }
    });
  }
}

function updateThemeIcon(theme) {
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  if (sunIcon && moonIcon) {
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
}

/**
 * AUDIO CONTROLS
 */
function setupAudioControl() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  const updateButtonState = () => {
    if (window.soundEngine && window.soundEngine.muted) {
      soundBtn.classList.add('audio-muted');
      soundBtn.setAttribute('title', 'Activar efectos de sonido');
    } else {
      soundBtn.classList.remove('audio-muted');
      soundBtn.setAttribute('title', 'Silenciar efectos de sonido');
    }
  };

  updateButtonState();

  soundBtn.addEventListener('click', () => {
    if (window.soundEngine) {
      window.soundEngine.toggleMute();
      updateButtonState();
    }
  });

  // Attach hover sounds to interactive elements
  const interactiveEls = document.querySelectorAll('a, button, .btn, .tech-pill, .stat-tile, .project-card, .tech-marquee-badge');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.playHover();
    });
  });
}

/**
 * REACTBITS PILL NAV CONTROLLER
 * Handles sliding highlight capsule, hover transitions, and scroll-spy.
 */
function setupPillNav() {
  const pillBar = document.getElementById('pill-nav-bar');
  const slider = document.getElementById('pill-slider');
  const navLinks = document.querySelectorAll('.pill-nav-bar .nav-link');
  if (!pillBar || !slider || !navLinks.length) return;

  function moveToElement(el) {
    const barRect = pillBar.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offsetLeft = elRect.left - barRect.left;
    const offsetTop = elRect.top - barRect.top;

    slider.style.width = `${elRect.width}px`;
    slider.style.height = `${elRect.height}px`;
    slider.style.transform = `translate3d(${offsetLeft}px, ${offsetTop}px, 0)`;
    slider.style.opacity = '1';
  }

  function getActiveLink() {
    return document.querySelector('.pill-nav-bar .nav-link.active') || navLinks[0];
  }

  // Initial positioning after layout
  setTimeout(() => {
    const active = getActiveLink();
    if (active) moveToElement(active);
  }, 100);

  window.addEventListener('resize', () => {
    const active = getActiveLink();
    if (active) moveToElement(active);
  });

  // Hover transitions and high-contrast color indicators
  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      moveToElement(link);
      navLinks.forEach((l) => l.classList.remove('pill-hovered'));
      link.classList.add('pill-hovered');
      if (window.soundEngine) window.soundEngine.playClick();
    });

    link.addEventListener('click', () => {
      navLinks.forEach((l) => {
        l.classList.remove('active');
        l.classList.remove('pill-hovered');
      });
      link.classList.add('active');
      moveToElement(link);
    });
  });

  pillBar.addEventListener('mouseleave', () => {
    navLinks.forEach((l) => l.classList.remove('pill-hovered'));
    const active = getActiveLink();
    if (active) {
      moveToElement(active);
    }
  });

  // ScrollSpy to sync active link with current section
  const sections = ['hero', 'bio', 'terminal', 'projects', 'contact'];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;

    sections.forEach((secId) => {
      const sec = document.getElementById(secId);
      if (!sec) return;
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        const correspondingLink = document.querySelector(`.pill-nav-bar .nav-link[data-section="${secId}"]`);
        if (correspondingLink && !correspondingLink.classList.contains('active')) {
          navLinks.forEach((l) => l.classList.remove('active'));
          correspondingLink.classList.add('active');
          if (!pillBar.matches(':hover')) {
            moveToElement(correspondingLink);
          }
        }
        const mobLink = document.querySelector(`.mobile-nav-link[data-section="${secId}"]`);
        if (mobLink && !mobLink.classList.contains('active')) {
          document.querySelectorAll('.mobile-nav-link').forEach((l) => l.classList.remove('active'));
          mobLink.classList.add('active');
        }
      }
    });
  }, { passive: true });
}

/**
 * MAGNETIC BUTTONS EFFECT
 */
function setupMagneticButtons() {
  const magneticBtns = document.querySelectorAll('[data-magnetic]');
  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/**
 * BIOGRAPHY ARCHITECTURE TABS
 */
function setupBioTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }

      if (window.soundEngine) window.soundEngine.playClick();
    });
  });
}

/**
 * PROJECTS DATA, FILTER & MODAL
 */
const projectsData = [
  {
    id: 'ecommerce-mern',
    category: 'mern',
    categoryLabel: 'Stack MERN',
    title: 'Plataforma E-Commerce MERN',
    shortDesc: 'Comercio electrónico desarrollado para Mueblería Hermanos Jota con catálogo reactivo, carrito de compras persistente, checkout seguro y panel administrativo.',
    tags: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB'],
    image: 'assets/muebleria-hermanos-jota.png',
    visualGrad: 'linear-gradient(180deg, #131d18 0%, #090f0c 100%)',
    iconSvg: `<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
    fullDesc: 'Plataforma integral de comercio electrónico desarrollada a medida para Mueblería Hermanos Jota bajo una arquitectura desacoplada. Integra autenticación por tokens JWT, navegación de catálogo de mobiliario con filtros interactivos, gestión de stock en tiempo real y panel de administración para supervisión de pedidos y clientes.',
    architecture: [
      'Frontend reactivo en React con Context API para gestión fluida del carrito de compras y catálogo de muebles',
      'API RESTful modular con Express.js y controladores desacoplados en Node.js',
      'Modelado de colecciones NoSQL con MongoDB y validaciones estrictas en Mongoose',
      'Autenticación robusta basada en JWT (JSON Web Tokens) y contraseñas hasheadas con bcryptjs'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/alesi01'
  },
  {
    id: 'gestion-turnos',
    category: 'mern',
    categoryLabel: 'Stack MERN',
    title: 'Sistema de Gestión de Turnos',
    shortDesc: 'Plataforma web para asignación, control y reserva de turnos en tiempo real con calendario interactivo y prevención de solapamientos.',
    tags: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB'],
    visualGrad: 'linear-gradient(180deg, #141b24 0%, #0b0e14 100%)',
    iconSvg: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="2"/>`,
    fullDesc: 'Sistema diseñado para centros de atención, consultorios y prestadores de servicios. Permite a los usuarios consultar franjas horarias libres y programar turnos de manera autónoma, mientras que el personal administrativo gestiona cancelaciones y confirmaciones instantáneas.',
    architecture: [
      'Calendario y selector horario dinámico en React con validación visual instantánea',
      'Manejo de reservas atómicas en MongoDB para impedir solapamiento de horarios simultáneos',
      'Control de roles diferenciados (Administrador, Profesional y Paciente/Cliente)',
      'Notificaciones y estados de turno automatizados (Pendiente, Confirmado, Atendido, Cancelado)'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/alesi01'
  },
  {
    id: 'pos-stock',
    category: 'mern',
    categoryLabel: 'Stack MERN',
    title: 'Punto de Venta (POS) & Control de Stock',
    shortDesc: 'Software de mostrador de alta velocidad para cobro ágil, lectura de código de barras, control de inventario y arqueo de caja.',
    tags: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB'],
    visualGrad: 'linear-gradient(180deg, #1b1926 0%, #0d0c14 100%)',
    iconSvg: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 8h10M7 12h6"/>`,
    fullDesc: 'Punto de venta comercial concebido para maximizar la velocidad transaccional en mostrador. Brinda búsqueda ultrarrápida por código de barras o SKU, cálculo automático de impuestos y descuentos, y rebaja inmediata de mercancía en inventario.',
    architecture: [
      'Interfaz de facturación en React optimizada para uso con atajos de teclado y pistolas de códigos',
      'Actualización atómica de stock mediante operadores nativos de MongoDB ($inc) sin condiciones de carrera',
      'Módulo de apertura y cierre de caja con conciliación por métodos de pago (Efectivo / Tarjeta)',
      'Histórico de movimientos de kardex y generación de recibos'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/alesi01'
  },
  {
    id: 'viabilidad-negocio',
    category: 'data',
    categoryLabel: 'Análisis de Datos',
    title: 'Análisis de Viabilidad de Negocio',
    shortDesc: 'Modelo financiero y cuantitativo en Python y Power BI para evaluar rentabilidad, TIR, VAN y punto de equilibrio operativo.',
    tags: ['Python', 'Pandas', 'Power BI', 'Data Analytics', 'Modelado Financiero'],
    visualGrad: 'linear-gradient(180deg, #1f1a14 0%, #0f0c08 100%)',
    iconSvg: `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
    fullDesc: 'Proyecto de análisis de datos financieros enfocado en evaluar la factibilidad técnica y económica de iniciativas comerciales. Permite cuantificar inversiones iniciales, calcular costos marginales y proyectar la recuperación de capital bajo distintos horizontes de tiempo.',
    architecture: [
      'Scripts en Python con Pandas y NumPy para el procesamiento de flujos de fondos proyectados',
      'Cálculo algorítmico de indicadores financieros fundamentales: VAN, TIR, Payback y Punto de Equilibrio',
      'Modelado interactivo en Power BI con parámetros de hipótesis (What-if) para análisis de sensibilidad',
      'Visualizaciones ejecutivas para directores y toma de decisiones fundamentadas en datos'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/alesi01'
  },
  {
    id: 'analisis-ventas',
    category: 'data',
    categoryLabel: 'Análisis de Datos',
    title: 'Dashboard de Análisis de Ventas & Clientes',
    shortDesc: 'Solución integral de Business Intelligence en Power BI y Python para detectar estacionalidad, ticket promedio y segmentación de clientes.',
    tags: ['Power BI', 'Python', 'Pandas', 'SQL', 'Visualización de Datos'],
    visualGrad: 'linear-gradient(180deg, #181922 0%, #0b0c12 100%)',
    iconSvg: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
    fullDesc: 'Ecosistema analítico para la exploración profunda de patrones comerciales y comportamiento del consumidor. Integra procesos de limpieza ETL en Python con modelado relacional en estrella en Power BI para brindar una visión de 360 grados del rendimiento de ventas.',
    architecture: [
      'Proceso ETL con Python y consultas SQL para depuración, desduplicación y normalización de transacciones',
      'Esquema dimensional en estrella (Star Schema) optimizado para alto rendimiento de consultas en Power BI',
      'Métricas complejas en DAX (Time Intelligence, variación interanual YoY, margen neto y ticket promedio)',
      'Segmentación de clientes RFM (Recencia, Frecuencia y Monto) para fidelización y retención'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/alesi01'
  }
];

function setupProjectsAndModal() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body-content');

  // Render project cards
  renderProjects('all');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderProjects(category);
      if (window.soundEngine) window.soundEngine.playClick();
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      closeProjectModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }
}

function renderProjects(filterCategory) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = filterCategory === 'all' 
    ? projectsData 
    : projectsData.filter((p) => p.category === filterCategory);

  grid.innerHTML = '';

  filtered.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-border-glow', '');
    card.setAttribute('data-glow-colors', 'rgba(255,255,255,0.95), rgba(210,230,255,0.85), rgba(41,151,255,0.45)');
    card.setAttribute('data-edge-sensitivity', '40');
    card.setAttribute('data-border-radius', '24');
    card.setAttribute('data-glow-radius', '90');
    card.innerHTML = `
      <div class="project-media">
        ${p.image ? `
          <img src="${p.image}" alt="${p.title}" class="project-img" loading="lazy" />
        ` : `
          <div class="project-visual-mock" style="background: ${p.visualGrad};">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              ${p.iconSvg || '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'}
            </svg>
          </div>
        `}
        <span class="project-category-badge">${p.categoryLabel || p.category.toUpperCase()}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.shortDesc}</p>
        <div class="project-tech-tags">
          ${p.tags.map(t => `<span class="project-tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-footer">
          <button class="project-link-btn view-details-btn" data-id="${p.id}">
            Ver Arquitectura
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn-icon" style="width:34px; height:34px;" title="Ver Repositorio en GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
    if (window.BorderGlow) {
      new BorderGlow(card, {
        colors: ['rgba(255,255,255,0.95)', 'rgba(210,230,255,0.85)', 'rgba(41,151,255,0.45)'],
        edgeSensitivity: 40,
        borderRadius: 24,
        glowRadius: 90,
        glowIntensity: 1.2
      });
    }
  });

  // Attach modal detail openers
  const detailButtons = grid.querySelectorAll('.view-details-btn');
  detailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-id');
      const project = projectsData.find((p) => p.id === projId);
      if (project) {
        openProjectModal(project);
      }
    });
  });
}

function openProjectModal(p) {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom: 8px;">
      <span class="project-category-badge" style="position:static;">${p.categoryLabel || p.category.toUpperCase()}</span>
      <span style="color:var(--text-muted); font-family:var(--font-mono); font-size:0.8rem;">ID: #${p.id}</span>
    </div>
    <h2 style="font-family:var(--font-display); font-size:1.8rem; font-weight:800; line-height:1.2;">${p.title}</h2>
    
    ${p.image ? `
      <div style="width:100%; height:230px; border-radius:var(--radius-md); overflow:hidden; margin: 16px 0; border: 1px solid var(--border-subtle); background:#0e0e12;">
        <img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover; object-position:top center; display:block;" />
      </div>
    ` : `
      <div style="background:${p.visualGrad}; height:180px; border-radius:var(--radius-md); display:grid; place-items:center; margin: 12px 0;">
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          ${p.iconSvg || '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'}
        </svg>
      </div>
    `}

    <div>
      <h4 style="font-family:var(--font-display); margin-bottom:8px; font-size:1.1rem;">Visión General</h4>
      <p style="color:var(--text-secondary); line-height:1.7;">${p.fullDesc}</p>
    </div>

    <div>
      <h4 style="font-family:var(--font-display); margin-bottom:12px; font-size:1.1rem;">Arquitectura y Decisiones Técnicas</h4>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:10px;">
        ${p.architecture.map(item => `
          <li style="display:flex; align-items:flex-start; gap:10px; color:var(--text-primary); font-size:0.92rem;">
            <span class="check-icon" style="margin-top:2px;">✓</span>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div>
      <h4 style="font-family:var(--font-display); margin-bottom:8px; font-size:1.1rem;">Stack Tecnológico</h4>
      <div class="project-tech-tags">
        ${p.tags.map(t => `<span class="project-tech-tag" style="padding:6px 12px; font-size:0.82rem;">${t}</span>`).join('')}
      </div>
    </div>

    <div style="display:flex; gap:16px; margin-top:16px; padding-top:16px; border-top:1px solid var(--border-subtle);">
      <a href="${p.liveUrl}" class="btn btn-primary" style="flex:1;">
        Demo en Vivo
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
      </a>
      <a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-secondary" style="flex:1;">
        Código GitHub
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
      </a>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (window.soundEngine) window.soundEngine.playClick();
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (window.soundEngine) window.soundEngine.playClick();
}

/**
 * METRIC COUNTERS ANIMATION ON SCROLL
 */
function setupMetricCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-target') || '0');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

        animateCounter(el, targetVal, prefix, suffix, decimals, 1800);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach((st) => observer.observe(st));
}

function animateCounter(el, target, prefix, suffix, decimals, duration) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // EaseOutExpo
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = start + (target - start) * easeProgress;

    el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * CONFETTI & CONTACT FORM SUBMIT
 */
function setupContactAndCV() {
  const form = document.getElementById('contact-form');
  const cvBtn = document.getElementById('download-cv-btn');

  if (cvBtn) {
    cvBtn.addEventListener('click', () => {
      if (cvBtn.classList.contains('downloading')) return;

      const iconWrap = document.getElementById('cv-icon-wrap');
      const textEl = document.getElementById('cv-text');

      if (window.soundEngine) window.soundEngine.playClick();

      cvBtn.classList.add('downloading');
      if (iconWrap) {
        iconWrap.innerHTML = `<span class="btn-cv-spinner"></span>`;
      }
      if (textEl) textEl.textContent = 'Descargando...';

      setTimeout(() => {
        cvBtn.classList.remove('downloading');
        cvBtn.classList.add('success');
        if (iconWrap) {
          iconWrap.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          `;
        }
        if (textEl) textEl.textContent = 'CV Descargado';
        if (window.soundEngine) window.soundEngine.playSuccess();
        showToast('✓ Curriculum Vitae de Alexis descargado con éxito.');

        setTimeout(() => {
          cvBtn.classList.remove('success');
          if (iconWrap) {
            iconWrap.innerHTML = `
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            `;
          }
          if (textEl) textEl.textContent = 'Descargar CV';
        }, 2800);
      }, 500);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg style="animation:spin 1s linear infinite;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Enviando paquete cifrado...
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        triggerConfetti();
        if (window.soundEngine) window.soundEngine.playSuccess();
        submitBtn.innerHTML = `✓ Mensaje Transmitido con Éxito`;
        submitBtn.style.background = 'var(--accent-emerald)';
        form.reset();

        showToast('🚀 Mensaje recibido. Te responderé en menos de 24 horas.');

        setTimeout(() => {
          submitBtn.innerHTML = origText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3500);
      }, 1200);
    });
  }
}

/**
 * TOAST NOTIFICATION
 */
function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--bg-surface);
      color: var(--text-primary);
      padding: 14px 24px;
      border-radius: var(--radius-md);
      border: 1px solid var(--accent-cyan);
      box-shadow: 0 10px 30px rgba(0, 240, 255, 0.25);
      backdrop-filter: blur(16px);
      z-index: 10001;
      font-family: var(--font-mono);
      font-size: 0.88rem;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 4000);
}

/**
 * CONFETTI ENGINE (PURE CANVAS)
 */
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const confettiPieces = [];
  const colors = ['#00f0ff', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 + 100,
      w: Math.random() * 8 + 4,
      h: Math.random() * 12 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 18,
      vy: -(Math.random() * 16 + 8),
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      alpha: 1
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let active = false;

    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.rot += p.rotSpeed;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (active) {
      requestAnimationFrame(drawConfetti);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  requestAnimationFrame(drawConfetti);
}

/**
 * INFINITE MARQUEE CLONER
 */
function setupInfiniteMarquee() {
  const rows = document.querySelectorAll('.marquee-row');
  rows.forEach((row) => {
    const content = row.querySelector('.marquee-content');
    if (content) {
      const clone = content.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      row.appendChild(clone);
    }
  });
}

/**
 * MOBILE NAVIGATION MENU
 */
/**
 * MOBILE NAVIGATION MENU (OVERLAY DRAWER)
 */
function setupMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggle || !overlay) return;

  function openMenu() {
    overlay.classList.add('active');
    toggle.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.soundEngine) window.soundEngine.playClick();
  }

  function closeMenu() {
    overlay.classList.remove('active');
    toggle.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (overlay.classList.contains('active')) {
      closeMenu();
      if (window.soundEngine) window.soundEngine.playClick();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeMenu();
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  // Close on clicking backdrop
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // Handle clicking mobile nav links
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      closeMenu();
      if (window.soundEngine) window.soundEngine.playSuccess();
    });
  });
}

/**
 * SCROLL NAVBAR EFFECT
 */
function setupScrollNavbar() {
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}
