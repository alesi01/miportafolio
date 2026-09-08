/**
 * Interactive Terminal CLI - Alexis Fernando Rojas
 * Provides a futuristic developer sandbox with 25+ rich CLI commands,
 * including visual physics sabotage collapse simulation, matrix decoders,
 * dev jokes, audio synthesizers, and easter eggs.
 */
class InteractiveTerminal {
  constructor() {
    this.body = document.getElementById('terminal-body');
    this.input = document.getElementById('terminal-input');
    this.quickButtons = document.querySelectorAll('.quick-btn');
    this.history = [];
    this.historyIndex = -1;
    this.isSabotaging = false;

    // Command registry with extensive aliases & Spanish support
    this.commands = {
      // Core Portfolio & Info
      help: () => this.cmdHelp(),
      ayuda: () => this.cmdHelp(),
      comandos: () => this.cmdHelp(),

      skills: () => this.cmdSkills(),
      habilidades: () => this.cmdSkills(),
      tecnologias: () => this.cmdSkills(),

      projects: () => this.cmdProjects(),
      proyectos: () => this.cmdProjects(),

      bio: () => this.cmdBio(),
      about: () => this.cmdBio(),
      sobremi: () => this.cmdBio(),

      contact: () => this.cmdContact(),
      contacto: () => this.cmdContact(),
      email: () => this.cmdContact(),

      cv: () => this.cmdCV(),
      curriculum: () => this.cmdCV(),
      descargar: () => this.cmdCV(),

      mern: () => this.cmdMern(),
      stack: () => this.cmdMern(),
      arquitectura: () => this.cmdMern(),

      // Sabotear Código (Visual Physics Collapse for 3 seconds)
      sabotear: () => this.cmdSabotage(),
      'sabotear codigo': () => this.cmdSabotage(),
      'sabotear-codigo': () => this.cmdSabotage(),
      sabotage: () => this.cmdSabotage(),
      destruir: () => this.cmdSabotage(),
      colapsar: () => this.cmdSabotage(),
      crash: () => this.cmdSabotage(),

      // Fun & Easter Eggs
      antigravity: () => this.cmdAntigravity(),
      antigravedad: () => this.cmdAntigravity(),

      matrix: () => this.cmdMatrix(),

      hack: () => this.cmdHack(),

      coffee: () => this.cmdCoffee(),
      cafe: () => this.cmdCoffee(),

      sudo: () => this.cmdSudo(),
      'sudo rm -rf': () => this.cmdSudo(),

      joke: () => this.cmdJoke(),
      chiste: () => this.cmdJoke(),

      quote: () => this.cmdQuote(),
      frase: () => this.cmdQuote(),

      cat: () => this.cmdCat(),
      gato: () => this.cmdCat(),

      roll: () => this.cmdRoll(),
      dado: () => this.cmdRoll(),

      ping: () => this.cmdPing(),
      status: () => this.cmdPing(),

      whoami: () => this.cmdWhoami(),

      rickroll: () => this.cmdRickroll(),
      rick: () => this.cmdRickroll(),

      git: () => this.cmdGit(),
      commit: () => this.cmdGit(),

      dance: () => this.cmdDance(),
      bailar: () => this.cmdDance(),

      weather: () => this.cmdWeather(),
      clima: () => this.cmdWeather(),

      calc: (raw) => this.cmdCalc(raw),
      calculadora: (raw) => this.cmdCalc(raw),

      secret: () => this.cmdSecret(),
      secreto: () => this.cmdSecret(),
      easteregg: () => this.cmdSecret(),

      // System Controls
      theme: () => this.cmdTheme(),
      tema: () => this.cmdTheme(),

      clear: () => this.cmdClear(),
      cls: () => this.cmdClear()
    };

    this.init();
  }

  init() {
    if (!this.input || !this.body) return;

    this.input.addEventListener('keydown', (e) => {
      if (window.soundEngine) window.soundEngine.playKey();

      if (e.key === 'Enter') {
        const raw = this.input.value.trim();
        this.input.value = '';
        if (raw) {
          this.history.push(raw);
          this.historyIndex = this.history.length;
          this.executeCommand(raw);
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
        e.preventDefault();
      }
    });

    this.quickButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
          if (window.soundEngine) window.soundEngine.playClick();
        }
      });
    });
  }

  printLine(html) {
    const line = document.createElement('div');
    line.className = 'terminal-log';
    line.innerHTML = html;
    this.body.appendChild(line);
    this.body.scrollTop = this.body.scrollHeight;
  }

  executeCommand(cmdText) {
    const rawTrim = cmdText.trim();
    if (!rawTrim) return;

    // Normalize accents and convert to lowercase
    const normalized = rawTrim
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    this.printLine(`<span class="terminal-prompt">&gt; alexis-sh ~ $</span> <span class="yellow">${this.escapeHTML(rawTrim)}</span>`);

    const parts = normalized.split(/\s+/);
    const mainCmd = parts[0];

    if (this.commands[normalized]) {
      this.commands[normalized](rawTrim);
    } else if (this.commands[mainCmd]) {
      this.commands[mainCmd](rawTrim);
    } else {
      this.printLine(`<span style="color:#ef4444;">Comando no reconocido: "${this.escapeHTML(rawTrim)}". Escribe <span class="cyan">help</span> para ver los más de 25 comandos disponibles.</span>`);
    }
  }

  cmdHelp() {
    this.printLine(`
      <div style="margin: 6px 0; line-height: 1.6;">
        <span class="cyan" style="font-weight:700;">🖥️ COMANDOS DISPONIBLES EN ALEXIS-SH (25+):</span><br><br>
        <span class="yellow" style="text-decoration:underline;">🛠️ INFORMACIÓN & PERFIL:</span><br>
        &nbsp;&nbsp;<span class="emerald">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Stack tecnológico (MERN + Análisis con Python & Power BI).<br>
        &nbsp;&nbsp;<span class="emerald">projects</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Catálogo de proyectos y soluciones escalables.<br>
        &nbsp;&nbsp;<span class="emerald">bio</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Formación académica en Sistemas y enfoque profesional.<br>
        &nbsp;&nbsp;<span class="emerald">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Enlaces profesionales (LinkedIn, GitHub, Formulario).<br>
        &nbsp;&nbsp;<span class="emerald">cv</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Descarga directa del Curriculum Vitae real oficial.<br>
        &nbsp;&nbsp;<span class="emerald">mern</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Diagrama ASCII de la arquitectura full stack.<br><br>
        <span class="yellow" style="text-decoration:underline;">💥 EFECTO ESPECIAL DESTACADO:</span><br>
        &nbsp;&nbsp;<span class="red" style="font-weight:800;">sabotear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 💥 Derrumbe visual completo de la página hacia abajo (3s auto-repair).<br>
        &nbsp;&nbsp;<em>(Alias: "sabotear codigo", "sabotage", "destruir")</em><br><br>
        <span class="yellow" style="text-decoration:underline;">🎮 DIVERSIÓN & EASTER EGGS (15+ comandos):</span><br>
        &nbsp;&nbsp;<span class="emerald">antigravity</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ⚡ Pulso y ondas de choque cuánticas en el canvas.<br>
        &nbsp;&nbsp;<span class="emerald">matrix</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 💻 Lluvia digital de glifos estilo Matrix.<br>
        &nbsp;&nbsp;<span class="emerald">hack</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🔓 Simulación de bypass de seguridad perimetral.<br>
        &nbsp;&nbsp;<span class="emerald">coffee</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ☕ Prepara un espresso doble para compilar sin parar.<br>
        &nbsp;&nbsp;<span class="emerald">joke</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 😄 Chistes clásicos de programadores y bugs.<br>
        &nbsp;&nbsp;<span class="emerald">quote</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 💡 Citas inspiradoras de leyendas del software.<br>
        &nbsp;&nbsp;<span class="emerald">cat</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🐱 Un gato ASCII durmiendo sobre el teclado.<br>
        &nbsp;&nbsp;<span class="emerald">roll</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🎲 Lanza un dado d20 para probar tu suerte en prod.<br>
        &nbsp;&nbsp;<span class="emerald">rickroll</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🕺 Un homenaje legendario a Rick Astley.<br>
        &nbsp;&nbsp;<span class="emerald">git</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🌿 Estado actual del repositorio git mental.<br>
        &nbsp;&nbsp;<span class="emerald">dance</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 💃 Un robot danzante celebrando el deploy.<br>
        &nbsp;&nbsp;<span class="emerald">weather</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🌤️ Pronóstico del tiempo en localhost:3000.<br>
        &nbsp;&nbsp;<span class="emerald">calc [expr]</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🧮 Calculadora cuántica (ej: calc 42 * 2).<br>
        &nbsp;&nbsp;<span class="emerald">ping</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🏓 Test de latencia y estado de servicios.<br>
        &nbsp;&nbsp;<span class="emerald">whoami</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 👤 Muestra tu rol e identidad de sesión.<br>
        &nbsp;&nbsp;<span class="emerald">sudo</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🛡️ Intenta ejecutar como superusuario root.<br>
        &nbsp;&nbsp;<span class="emerald">secret</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 🤫 Guía de secretos y trucos ocultos en la web.<br><br>
        <span class="yellow" style="text-decoration:underline;">⚙️ SISTEMA:</span><br>
        &nbsp;&nbsp;<span class="emerald">theme</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Alterna el tema Dark / Light.<br>
        &nbsp;&nbsp;<span class="emerald">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Limpia la pantalla de la terminal.
      </div>
    `);
  }

  cmdSabotage() {
    if (this.isSabotaging) return;
    this.isSabotaging = true;

    this.printLine(`<span style="color:#ef4444; font-weight:800; font-size:1.05rem;">💥 [CRITICAL FAILURE] ¡SABOTAJE ACTIVADO!</span>`);
    this.printLine(`<span style="color:#f87171;">Toda la página entera se derrumba hacia abajo... Redirigiendo al inicio para presenciar el colapso.</span>`);

    if (window.soundEngine) window.soundEngine.playClick();

    // Automatically send the user to the beginning (hero) to watch the entire collapse
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Select all visual modules across the page (outside the terminal)
    const targetSelectors = [
      '#navbar',
      '#hero .hero-content',
      '#hero .lanyard-wrapper',
      '#bio .section-header',
      '#bio .bio-grid',
      '#projects .section-header',
      '#projects .projects-filter-bar',
      '#projects .projects-grid',
      '#contact .section-header',
      '#contact .contact-card-box',
      '.footer',
      '.floating-dock'
    ].join(', ');

    const elements = document.querySelectorAll(targetSelectors);
    document.body.classList.add('sabotage-mode');

    // Assign randomized tumble directions via pure CSS classes
    const fallClasses = ['sabotage-fall-left', 'sabotage-fall-right', 'sabotage-fall-center'];
    elements.forEach((el, index) => {
      el.classList.remove('sabotage-fall-left', 'sabotage-fall-right', 'sabotage-fall-center', 'sabotage-rebuilding');
      const chosenClass = fallClasses[index % fallClasses.length];
      el.classList.add(chosenClass);
    });

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        this.printLine(`<span style="color:#f97316;">⏱️ Reensamblando módulos en ${count}s...</span>`);
      }
    }, 900);

    // Exactly at 3.0s: Trigger smooth spring rebuild animation
    setTimeout(() => {
      clearInterval(interval);

      elements.forEach((el) => {
        el.classList.remove('sabotage-fall-left', 'sabotage-fall-right', 'sabotage-fall-center');
        el.classList.add('sabotage-rebuilding');
      });

      // At 3.95s: Remove all animation classes so elements return 100% to natural DOM state
      setTimeout(() => {
        elements.forEach((el) => {
          el.classList.remove('sabotage-rebuilding');
        });
        document.body.classList.remove('sabotage-mode');
        this.isSabotaging = false;
      }, 950);

      this.printLine(`<span class="emerald" style="font-weight:700;">✨ [AUTO-HEAL] Reconstrucción cuántica completada. El código está 100% a salvo y en perfecto estado.</span>`);
      if (window.soundEngine) window.soundEngine.playSuccess();
    }, 3000);
  }

  cmdSkills() {
    this.printLine(`
      <div style="margin: 4px 0;">
        <span class="cyan">🚀 Habilidades & Tecnologías Principales:</span><br>
        • <span class="violet">Stack MERN:</span> JavaScript (ES6+), React, Node.js, Express.js, MongoDB (Mongoose).<br>
        • <span class="violet">Análisis de Datos:</span> Python (Pandas, NumPy), Microsoft Power BI, SQL, DAX, Modelado de Negocios.<br>
        • <span class="violet">Bases de Datos & APIs:</span> MongoDB (NoSQL), SQL (PostgreSQL/MySQL), RESTful APIs, Autenticación JWT.<br>
        • <span class="violet">Herramientas & Entornos:</span> Git, GitHub, Visual Studio Code, Postman, Excel Avanzado.<br>
        • <span class="violet">Ingeniería en Sistemas:</span> Patrones de diseño, SOLID, clean architecture y metodologías ágiles.
      </div>
    `);
  }

  cmdProjects() {
    this.printLine(`
      <div style="margin: 4px 0;">
        <span class="cyan">💼 Proyectos Destacados:</span><br>
        1. <span class="emerald">Plataforma E-Commerce MERN</span> — Catálogo reactivo, carrito dinámico, JWT y panel admin.<br>
        2. <span class="emerald">Sistema de Gestión de Turnos</span> — Reserva en tiempo real, 0 solapamiento y roles diferenciados.<br>
        3. <span class="emerald">Punto de Venta (POS) & Control de Stock</span> — Facturación ultra-rápida y control atómico de inventario.<br>
        4. <span class="emerald">Análisis de Viabilidad de Negocio</span> — Modelado financiero en Python y Power BI (TIR, VAN, Break-even).<br>
        5. <span class="emerald">Dashboard de Análisis de Ventas & Clientes</span> — BI con Power BI, Python y SQL (Segmentación RFM y tendencias).
      </div>
    `);
  }

  cmdBio() {
    this.printLine(`
      <div style="margin: 4px 0;">
        <span class="cyan">👨‍💻 Alexis Fernando Rojas — Full Stack Developer & Analista de Datos</span><br>
        Estudiante de Ingeniería en Sistemas apasionado por el desarrollo de aplicaciones web de extremo a extremo con el <strong>Stack MERN</strong> (MongoDB, Express, React, Node.js) y la ciencia de datos aplicada a la toma de decisiones empresariales con <strong>Python</strong> y <strong>Power BI</strong>.
      </div>
    `);
  }

  cmdContact() {
    this.printLine(`
      <div style="margin: 4px 0;">
        <span class="cyan">📬 Canales de Conexión Profesional:</span><br>
        • <span class="yellow">LinkedIn:</span> <a href="https://www.linkedin.com/in/alexis-fernando-rojas-94922b250" target="_blank" style="color:#2997ff;">linkedin.com/in/alexis-fernando-rojas-94922b250</a><br>
        • <span class="yellow">GitHub:</span> <a href="https://github.com/alesi01" target="_blank" style="color:#2997ff;">github.com/alesi01</a><br>
        • <span class="yellow">Formulario:</span> Puedes dejarme un mensaje directo en la sección de contacto al final de la página.<br>
      </div>
    `);
  }

  cmdCV() {
    const cvBtn = document.getElementById('download-cv-btn');
    if (cvBtn) {
      cvBtn.click();
      this.printLine(`<span class="emerald">📄 Descargando Curriculum Vitae oficial de Alexis...</span>`);
    } else {
      window.open('assets/Alexis_Fernando_Rojas_CV.pdf', '_blank');
      this.printLine(`<span class="emerald">📄 Abriendo Curriculum Vitae oficial de Alexis...</span>`);
    }
  }

  cmdMern() {
    this.printLine(`
      <div style="margin: 4px 0; font-family: monospace; font-size: 0.8rem; line-height: 1.4;">
        <span class="cyan">🌐 ARQUITECTURA STACK MERN DE ALEXIS:</span><br><br>
        ┌─────────────────────────┐<br>
        │   <span class="yellow">REACT (Frontend SPA)</span>  │ ◄── Componentes modulares, Hooks, State Management<br>
        └────────────┬────────────┘<br>
                     │  HTTP / REST API (JSON)<br>
        ┌────────────▼────────────┐<br>
        │ <span class="emerald">EXPRESS.JS + NODE.JS</span>    │ ◄── Middlewares, JWT Auth, Rutas asíncronas<br>
        └────────────┬────────────┘<br>
                     │  Mongoose ODM (Driver)<br>
        ┌────────────▼────────────┐<br>
        │  <span class="violet">MONGODB (Database)</span>     │ ◄── Colecciones NoSQL, Agregaciones optimizadas<br>
        └─────────────────────────┘
      </div>
    `);
  }

  cmdCoffee() {
    this.printLine(`<span class="yellow">☕ Preparando Espresso Doble...</span>`);
    setTimeout(() => {
      this.printLine(`<span class="yellow">⚙️ Moliendo granos de café... Inyectando cafeína a los hilos de Node.js...</span>`);
    }, 350);
    setTimeout(() => {
      this.printLine(`<span class="emerald">✓ ¡Café servido! Energía al 100% para escribir código sin bugs durante 12 horas seguidas.</span>`);
      if (window.soundEngine) window.soundEngine.playSuccess();
    }, 850);
  }

  cmdSudo() {
    this.printLine(`<span style="color:#ef4444;">🛡️ Permission denied: 'alexis' está en el archivo sudoers, pero tus intenciones son sospechosas. ¡Nice try! 😉</span>`);
    if (window.soundEngine) window.soundEngine.playClick();
  }

  cmdHack() {
    this.printLine(`<span class="emerald">Iniciando protocolo de bypass en puertos cuánticos...</span>`);
    const steps = [
      'Inyectando payloads en el servidor proxy...',
      'Bypasseando cortafuegos perimetral [AES-256 OK]...',
      'Accediendo al mainframe de Alexis...',
      '🔓 ACCESS GRANTED: Bienvenido al núcleo cuántico del portafolio.'
    ];

    steps.forEach((msg, idx) => {
      setTimeout(() => {
        this.printLine(`<span style="color:${idx === 3 ? '#30d158' : '#38bdf8'}; font-family:monospace;">${msg}</span>`);
        if (idx === 3 && window.soundEngine) window.soundEngine.playSuccess();
      }, (idx + 1) * 350);
    });
  }

  cmdJoke() {
    const jokes = [
      "¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae a los bugs.",
      "Un programador va al supermercado. Su esposa le dice: 'Trae una botella de leche, y si hay huevos, trae 10'. Regresó con 10 botellas de leche porque había huevos.",
      "Hay 10 tipos de personas en el mundo: los que entienden binario y los que no.",
      "¿Cuál es el café favorito de un desarrollador? Java con un poco de script.",
      "¿Por qué C++ no puede tener citas con C? Porque C no tiene clase.",
      "Un tester entra a un bar. Pide una cerveza. Pide 0 cervezas. Pide 999999 cervezas. Pide un lagarto. Pide -1 cervezas. El primer cliente real entra y pregunta dónde está el baño; el bar explota en llamas."
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    this.printLine(`<span class="yellow">😄 ${picked}</span>`);
  }

  cmdQuote() {
    const quotes = [
      "“Talk is cheap. Show me the code.” — Linus Torvalds",
      "“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.” — Martin Fowler",
      "“First, solve the problem. Then, write the code.” — John Johnson",
      "“Simplicity is prerequisite for reliability.” — Edsger W. Dijkstra",
      "“Make it work, make it right, make it fast.” — Kent Beck",
      "“The most important property of a program is whether it accomplishes the intention of its user.” — C.A.R. Hoare"
    ];
    const picked = quotes[Math.floor(Math.random() * quotes.length)];
    this.printLine(`<span class="cyan">💡 ${picked}</span>`);
  }

  cmdCat() {
    this.printLine(`
      <div style="font-family: monospace; line-height: 1.2; color:#f59e0b; margin: 4px 0;">
&nbsp;&nbsp;&nbsp;&nbsp;/\\_/\\&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;(&nbsp;o.o&nbsp;)&nbsp;&nbsp;*purrr*<br>
&nbsp;&nbsp;&nbsp;&nbsp;&gt;&nbsp;^&nbsp;&lt;&nbsp;&nbsp;&nbsp;[El gato de Alexis durmiendo plácidamente sobre el teclado]
      </div>
    `);
    if (window.soundEngine) window.soundEngine.playSuccess();
  }

  cmdRoll() {
    const d20 = Math.floor(Math.random() * 20) + 1;
    let comment = '';
    if (d20 === 20) {
      comment = '¡ÉXITO CRÍTICO! Tus commits entran directo a producción sin ningún bug.';
    } else if (d20 === 1) {
      comment = 'Pifia crítica: borraste la base de datos sin backup... por suerte era el entorno local.';
    } else if (d20 >= 12) {
      comment = 'Tirada exitosa: la compilación finalizó en 0.4s.';
    } else {
      comment = 'Tirada regular: encontraste un punto y coma faltante en la línea 42.';
    }
    this.printLine(`<span class="yellow">🎲 Tiraste un d20: <strong>${d20}</strong>.</span> <span class="cyan">${comment}</span>`);
  }

  cmdPing() {
    const ms = (Math.random() * 10 + 8).toFixed(1);
    this.printLine(`<span class="emerald">🏓 PONG alexis-node.local: latencia=${ms}ms | Stack=MERN | Status=100% OPERATIONAL</span>`);
  }

  cmdWhoami() {
    this.printLine(`<span class="cyan">👤 Sesión: Invitado VIP explorando el portafolio interactivo de Alexis Fernando Rojas. Permisos: READ & INTERACT.</span>`);
  }

  cmdRickroll() {
    this.printLine(`
      <div style="margin: 4px 0; color:#ec4899; font-family: monospace;">
        🕺 NEVER GONNA GIVE YOU UP 🎵<br>
        &nbsp;&nbsp;Never gonna let you down...<br>
        &nbsp;&nbsp;Never gonna run around and desert you!<br>
        &nbsp;&nbsp;Never gonna make you cry, never gonna say goodbye!<br>
        <span class="yellow">✨ ¡Has sido rickrolleado con estilo en la shell de Alexis!</span>
      </div>
    `);
    if (window.soundEngine) window.soundEngine.playSuccess();
  }

  cmdGit() {
    this.printLine(`
      <div style="margin: 4px 0; font-family: monospace; font-size: 0.82rem;">
        <span class="cyan">🌿 On branch main</span><br>
        <span class="emerald">Your branch is up to date with 'origin/main'.</span><br><br>
        Changes not staged for commit:<br>
        &nbsp;&nbsp;<span style="color:#ef4444;">modified: insomnia.js (added 3 more espresso shots)</span><br>
        &nbsp;&nbsp;<span style="color:#ef4444;">modified: perfectionism.css (zero pixel misalignment)</span><br><br>
        Untracked files:<br>
        &nbsp;&nbsp;<span class="yellow">secret_ideas_for_startup/</span><br><br>
        <em>no changes added to commit (use "git add" to build greatness)</em>
      </div>
    `);
  }

  cmdDance() {
    const frames = [
      '\\(•_•)/ &nbsp; ¡Party deploy!',
      '( •_•)&gt;⌐■-■ &nbsp; Poniendo lentes oscuros...',
      '(⌐■_■) &nbsp; ¡Deploy en producción sin errores!'
    ];
    frames.forEach((f, i) => {
      setTimeout(() => {
        this.printLine(`<span class="yellow" style="font-family: monospace; font-size: 0.9rem;">${f}</span>`);
        if (i === 2 && window.soundEngine) window.soundEngine.playSuccess();
      }, i * 300);
    });
  }

  cmdWeather() {
    this.printLine(`
      <div style="margin: 4px 0;">
        <span class="cyan">🌤️ Pronóstico del tiempo para localhost:3000:</span><br>
        • <strong>Temperatura:</strong> 24°C (Ideal para programar)<br>
        • <strong>Humedad de errores:</strong> 0% de bugs detectados<br>
        • <strong>Precipitación:</strong> 100% de probabilidad de lluvia de café<br>
        • <strong>Viento:</strong> Vientos alisios de fibra óptica a 1 Gbps
      </div>
    `);
  }

  cmdCalc(raw) {
    const expr = raw.replace(/^(calc|calculadora)\s*/i, '').trim();
    if (!expr) {
      this.printLine(`<span class="cyan">🧮 Calculadora: Escribe una expresión (ej: <span class="yellow">calc 24 * 7</span> o <span class="yellow">calc (150 + 50) * 1.21</span>).</span>`);
      return;
    }

    // Sanitize to only allow numbers, operators, and parentheses
    if (!/^[\d\s\+\-\*\/\(\)\.\%]+$/.test(expr)) {
      this.printLine(`<span style="color:#ef4444;">Expresión inválida. Solo se admiten operaciones matemáticas estándar (+, -, *, /, %).</span>`);
      return;
    }

    try {
      const res = Function(`'use strict'; return (${expr})`)();
      this.printLine(`<span class="emerald">🧮 ${expr} = <strong>${res}</strong></span>`);
      if (window.soundEngine) window.soundEngine.playSuccess();
    } catch {
      this.printLine(`<span style="color:#ef4444;">Error al evaluar la expresión matemática.</span>`);
    }
  }

  cmdSecret() {
    this.printLine(`
      <div style="margin: 4px 0;">
        <span class="yellow">🤫 EASTER EGGS & SECRETOS DESCUBIERTOS:</span><br>
        1. <strong>Tarjeta con Lanyard:</strong> Agarra la tarjeta de Alexis y arrástrala; reacciona dinámicamente con física y balanceo real.<br>
        2. <strong>Efecto Sabotear:</strong> Prueba el comando <span class="red" style="font-weight:700;">sabotear</span> o <span class="red" style="font-weight:700;">sabotear codigo</span> para ver colapsar la página entera por 3 segundos.<br>
        3. <strong>Audio Fx:</strong> El conmutador de audio de la barra activa sonidos sintetizados en tiempo real mediante Web Audio API.<br>
        4. <strong>Antigravedad:</strong> El comando <span class="emerald">antigravity</span> dispara ondas sónicas en el canvas de partículas del fondo.<br>
        5. <strong>Rickroll:</strong> Escribe <span class="emerald">rickroll</span> para una dosis nostálgica de buen código.
      </div>
    `);
  }

  cmdAntigravity() {
    this.printLine(`<span class="violet">⚡ [QUANTUM_FLUX_ENABLED] Desencadenando pulso de antigravedad cuántico...</span>`);
    if (window.antigravityInstance) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const rx = Math.random() * window.innerWidth;
          const ry = Math.random() * window.innerHeight;
          window.antigravityInstance.createShockwave(rx, ry);
        }, i * 150);
      }
    }
    if (window.soundEngine) window.soundEngine.playSuccess();
  }

  cmdTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.click();
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      this.printLine(`<span class="cyan">✓ Tema cambiado a modo: <strong>${current.toUpperCase()}</strong></span>`);
    }
  }

  cmdMatrix() {
    this.printLine(`<span class="emerald">Iniciando decodificación del buffer cuántico...</span>`);
    const glyphs = '01ABCDEFΩΨ∑∏∆∇≈≠≤≥λπ§±';
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        let stream = '';
        for (let j = 0; j < 38; j++) {
          stream += glyphs[Math.floor(Math.random() * glyphs.length)] + ' ';
        }
        this.printLine(`<span style="color:#10b981; font-family:monospace; opacity:${0.4 + i * 0.2};">${stream}</span>`);
      }, i * 120);
    }
  }

  cmdClear() {
    this.body.innerHTML = '';
    this.printLine(`<span class="cyan">Terminal reiniciada. Escribe <span class="yellow">help</span> para consultar los más de 25 comandos disponibles.</span>`);
  }

  escapeHTML(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }
}

window.InteractiveTerminal = InteractiveTerminal;
