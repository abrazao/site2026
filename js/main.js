/* ==========================================================================
   SOFTCASE - LÓGICA E INTERATIVIDADE (VANILLA JS)
   ========================================================================== */

function initSite() {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initDashboardSimulator();
  initProductTabs();
  initLprSimulator();
  initContactForm();
  initScrollSpy();
  initNetworkParking3D();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}

/* ==========================================================================
   1. NAVBAR EFFECTS & SCROLL PROGRESS
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. MOBILE NAV TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-active');
    
    // Altera o ícone do botão menu
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('mobile-active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Fecha o menu ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-active');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

/* ==========================================================================
   3. SCROLL SPY (INDICADOR ACTIVE NA NAV)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. SCROLL ENTRANCE ANIMATIONS (REVEAL)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Uma vez animado, não precisa re-animar ao subir a página
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================================================
   5. DASHBOARD SIMULATOR — CONTADORES ANIMADOS
   ========================================================================== */
function initDashboardSimulator() {
  const viasEl  = document.getElementById('dash-vias');
  const vagasEl = document.getElementById('dash-vagas');

  if (!viasEl || !vagasEl) return;

  let started = false;

  /**
   * Anima um contador do 0 até o valor alvo.
   * @param {HTMLElement} el      Elemento a atualizar
   * @param {number}      target  Valor final (inteiro)
   * @param {number}      duration Duração em ms
   * @param {string}      suffix  Sufixo opcional (ex: '+')
   */
  function animateCounter(el, target, duration, suffix = '') {
    const start = performance.now();
    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo para desacelerar suavemente no final
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(ease * target);
      el.textContent = current.toLocaleString('pt-BR') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Dispara quando o dashboard entra na viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        animateCounter(viasEl,  1489, 2200); // 1.489
        animateCounter(vagasEl, 40262, 2800); // 40.262
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const dashboard = document.querySelector('.mockup-dashboard');
  if (dashboard) observer.observe(dashboard);
}

/* ==========================================================================
   6. PRODUCT SHOWCASE TABS
   ========================================================================== */
function initProductTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productSections = Array.from(document.querySelectorAll('.product-section-panel'));

  if (!tabButtons.length || !productSections.length) return;

  function setActiveButton(targetId) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === targetId);
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      setActiveButton(targetId);
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) setActiveButton(visibleEntry.target.id);
  }, {
    threshold: [0.25, 0.5, 0.75],
    rootMargin: '-25% 0px -55% 0px'
  });

  productSections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   7. AI LPR SIMULATOR (PARKVISION360 DESTAQUE)
   ========================================================================== */
function initLprSimulator() {
  const simulators = document.querySelectorAll('.lpr-simulator');
  if (!simulators.length) return;

  // Ciclos da câmera de inteligência artificial baseados nas fotos oficiais
  const lprCycles = [
    {
      image: 'assets/images/lpr_estacionamento.jpg',
      plate: 'UZO-0F78',
      owner: 'VW VIRTUS - MENSALISTA',
      camera: 'ENTRADA PRINCIPAL 01',
      confidence: '99.8%',
      status: 'MENSALISTA LIBERADO',
      box: { top: '121px', left: '250px', width: '82px', height: '30px' }
    },
    {
      image: 'assets/images/hero-real.png',
      plate: 'UFO-0C78',
      owner: 'TOYOTA COROLLA - VISITANTE',
      camera: 'ACESSO SUL 02',
      confidence: '99.4%',
      status: 'TICKET IMPRESSO - ENTRADA',
      box: { top: '110px', left: '164px', width: '88px', height: '32px' }
    },
    {
      image: 'assets/images/cancelas_detalhe.jpg',
      plate: 'ABC-1D23',
      owner: 'FORD KA - VISITANTE (PAGO)',
      camera: 'SAÍDA NORTE 01',
      confidence: '98.9%',
      status: 'PAGO - SAÍDA LIBERADA',
      box: { top: '90px', left: '140px', width: '115px', height: '42px' }
    },
    {
      image: 'assets/images/cancelas_detalhe_v2.jpg',
      plate: 'XYZ-9M87',
      owner: 'JEEP COMPASS - MENSALISTA',
      camera: 'ENTRADA PRINCIPAL 02',
      confidence: '99.7%',
      status: 'MENSALISTA LIBERADO',
      box: { top: '128px', left: '245px', width: '88px', height: '32px' }
    }
  ];

  simulators.forEach((simulator, simulatorIndex) => {
    const lprVideo = simulator.querySelector('.lpr-video-feed');
    const lprBox = simulator.querySelector('.lpr-box');
    const lprStatusLabel = simulator.querySelector('.lpr-label-box');
    const lprConfidence = simulator.querySelector('.lpr-confidence, #lpr-confidence');
    const lprPlateDisplay = simulator.querySelector('.lpr-plate-display');
    const lprOwner = simulator.querySelector('.lpr-owner, #lpr-owner');
    const lprCamName = simulator.querySelector('.lpr-cam-name, #lpr-cam-name');
    const lprLogList = simulator.querySelector('.lpr-log-list');

    if (!lprVideo || !lprBox || !lprStatusLabel || !lprConfidence || !lprPlateDisplay || !lprCamName || !lprLogList) return;

    let currentCycle = simulatorIndex % lprCycles.length;

    setInterval(() => {
      // Transiciona para o próximo ciclo
      currentCycle = (currentCycle + 1) % lprCycles.length;
      const cycle = lprCycles[currentCycle];

      // Status visual de Processando Placa
      lprStatusLabel.textContent = cycle.plate;
      lprStatusLabel.style.background = 'var(--color-primary)';
      lprStatusLabel.style.color = '#ffffff';
      lprBox.style.borderColor = 'var(--color-primary)';
      lprBox.style.boxShadow = '0 0 15px var(--color-primary)';

      // Altera a imagem de fundo de forma suave
      lprVideo.style.backgroundImage = `url('${cycle.image}')`;

      // Move a bounding box com delay simulando tempo de processamento da IA
      setTimeout(() => {
        lprBox.style.top = cycle.box.top;
        lprBox.style.left = cycle.box.left;
        lprBox.style.width = cycle.box.width;
        lprBox.style.height = cycle.box.height;

        // Atualiza os metadados da detecção após processar
        setTimeout(() => {
          lprStatusLabel.textContent = cycle.plate;
          lprStatusLabel.style.background = 'var(--color-accent)';
          lprStatusLabel.style.color = 'var(--text-dark)';
          lprBox.style.borderColor = 'var(--color-accent)';
          lprBox.style.boxShadow = '0 0 15px var(--color-accent)';

          lprConfidence.textContent = cycle.confidence;
          lprPlateDisplay.textContent = cycle.plate;
          if (lprOwner) lprOwner.textContent = cycle.owner;
          lprCamName.textContent = cycle.camera;

          // Adiciona ao Log de IA
          const timeString = new Date().toLocaleTimeString('pt-BR');
          const logItem = document.createElement('div');
          logItem.className = 'lpr-log-item';
          logItem.innerHTML = `
            <span><span style="color:var(--color-secondary)">[${timeString}]</span> ${cycle.plate} - ${cycle.status}</span>
            <span style="color:var(--color-accent)">OK</span>
          `;
          lprLogList.insertBefore(logItem, lprLogList.firstChild);

          if (lprLogList.children.length > 2) {
            lprLogList.removeChild(lprLogList.lastChild);
          }
        }, 400);
      }, 600);
    }, 5000);
  });
}
/* ==========================================================================
   8. FORMULÁRIO B2B COM FEEDBACK DE SUCESSO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMessage = document.getElementById('contact-form-status');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (statusMessage) {
      statusMessage.className = 'form-status-message';
      statusMessage.textContent = '';
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando mensagem...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = result.error === 'SMTP_NOT_CONFIGURED'
          ? 'Envio de e-mail ainda nao configurado no servidor. Configure o SMTP para ativar o formulario.'
          : 'Nao foi possivel enviar a mensagem. Tente novamente em alguns instantes.';
        throw new Error(message);
      }

      form.reset();
      if (statusMessage) {
        statusMessage.textContent = 'mensagem enviada com sucesso';
        statusMessage.classList.add('is-success');
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (error) {
      if (statusMessage) {
        statusMessage.textContent = error.message || 'Nao foi possivel enviar a mensagem. Tente novamente em alguns instantes.';
        statusMessage.classList.add('is-error');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// Expõe globalmente para poder reiniciar o formulário a partir do botão
window.resetFormState = function() {
  const form = document.getElementById('contact-form');
  const successState = document.getElementById('form-success');
  const submitBtn = form.querySelector('.form-submit-btn');
  
  form.reset();
  form.style.display = 'block';
  successState.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Solicitar demonstração <i class="fa-solid fa-arrow-right"></i>';
};
/* ==========================================================================
   9. ANIMACAO 3D - REDES DE ESTACIONAMENTO
   ========================================================================== */
function initNetworkParking3D() {
  const container = document.querySelector('[data-network-parking-3d]');
  const canvas = container?.querySelector('.network-parking-canvas');

  if (!container || !canvas || !window.THREE) {
    if (container) container.classList.add('three-unavailable');
    return;
  }

  const THREE = window.THREE;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  const clock = new THREE.Clock();
  const animatedObjects = [];
  const pulses = [];
  const gateState = new Map();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  camera.position.set(0, 8.2, 8.8);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xdafcff, 0x081322, 1.55));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.75);
  keyLight.position.set(3.8, 7.2, 4.6);
  scene.add(keyLight);

  const cyan = 0x00f2fe;
  const blue = 0x0a84ff;
  const green = 0x30d158;
  const white = 0xf6fbff;
  const amber = 0xff9f0a;
  const asphalt = new THREE.MeshStandardMaterial({ color: 0x101827, roughness: 0.72, metalness: 0.05 });
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.65, metalness: 0.08 });
  const laneMat = new THREE.MeshBasicMaterial({ color: 0xdff8ff, transparent: true, opacity: 0.72 });
  const slotMat = new THREE.MeshBasicMaterial({ color: 0x7bdff2, transparent: true, opacity: 0.64 });
  const glassMat = new THREE.MeshStandardMaterial({ color: cyan, emissive: cyan, emissiveIntensity: 0.2, roughness: 0.3, metalness: 0.35 });
  const gateMat = new THREE.MeshStandardMaterial({ color: white, roughness: 0.35 });
  const emitterMat = new THREE.MeshStandardMaterial({ color: amber, emissive: amber, emissiveIntensity: 0.18, roughness: 0.38, metalness: 0.14 });
  const receiverMat = new THREE.MeshStandardMaterial({ color: green, emissive: green, emissiveIntensity: 0.18, roughness: 0.38, metalness: 0.14 });
  const deviceMat = new THREE.MeshStandardMaterial({ color: blue, emissive: blue, emissiveIntensity: 0.12, roughness: 0.36, metalness: 0.18 });

  const ground = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.16, 5.9), asphalt);
  ground.position.y = -0.1;
  scene.add(ground);

  const grid = new THREE.GridHelper(10.2, 16, 0x1f6b83, 0x163145);
  grid.position.y = 0.01;
  scene.add(grid);

  function makeBox(width, height, depth, material, position, parent = scene) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(position.x, position.y, position.z);
    parent.add(mesh);
    return mesh;
  }

  function makeCylinder(radius, height, material, position, parent = scene) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 18), material);
    mesh.position.set(position.x, position.y, position.z);
    parent.add(mesh);
    return mesh;
  }

  function makeRoadBetween(start, end, width = 0.46) {
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const length = Math.hypot(dx, dz);
    const road = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, width), roadMat);
    road.position.set((start.x + end.x) / 2, 0.08, (start.z + end.z) / 2);
    road.rotation.y = Math.atan2(-dz, dx);
    scene.add(road);

    const dashCount = Math.max(2, Math.floor(length / 0.85));
    for (let i = 1; i < dashCount; i += 1) {
      const t = i / dashCount;
      const lane = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.032), laneMat);
      lane.position.set(start.x + dx * t, 0.13, start.z + dz * t);
      lane.rotation.y = road.rotation.y;
      scene.add(lane);
    }
  }

  function makeLabel(text, position, options = {}) {
    const canvasLabel = document.createElement('canvas');
    const context = canvasLabel.getContext('2d');
    const scale = options.scale || 2;
    const width = options.width || 230;
    const height = options.height || 72;
    canvasLabel.width = width * scale;
    canvasLabel.height = height * scale;
    context.scale(scale, scale);
    context.clearRect(0, 0, width, height);
    context.fillStyle = options.fill || 'rgba(4, 11, 26, 0.82)';
    context.strokeStyle = options.stroke || 'rgba(0, 242, 254, 0.7)';
    context.lineWidth = 2;
    const radius = 14;
    context.beginPath();
    context.moveTo(radius, 1);
    context.lineTo(width - radius, 1);
    context.quadraticCurveTo(width - 1, 1, width - 1, radius);
    context.lineTo(width - 1, height - radius);
    context.quadraticCurveTo(width - 1, height - 1, width - radius, height - 1);
    context.lineTo(radius, height - 1);
    context.quadraticCurveTo(1, height - 1, 1, height - radius);
    context.lineTo(1, radius);
    context.quadraticCurveTo(1, 1, radius, 1);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = options.color || '#f6fbff';
    context.font = `${options.weight || 800} ${options.fontSize || 24}px Inter, Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvasLabel);
    texture.needsUpdate = true;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    sprite.position.set(position.x, position.y, position.z);
    sprite.scale.set(options.spriteWidth || 1.2, options.spriteHeight || 0.38, 1);
    scene.add(sprite);
    return sprite;
  }

  function makeParkingSlot(x, z, label) {
    makeBox(0.72, 0.018, 1.05, new THREE.MeshBasicMaterial({ color: 0x0f2038, transparent: true, opacity: 0.46 }), { x, y: 0.04, z });
    makeBox(0.026, 0.03, 1.05, slotMat, { x: x - 0.37, y: 0.08, z });
    makeBox(0.026, 0.03, 1.05, slotMat, { x: x + 0.37, y: 0.08, z });
    makeBox(0.74, 0.03, 0.026, slotMat, { x, y: 0.08, z: z - 0.52 });
    makeLabel(label, { x, y: 0.44, z: z - 0.18 }, { width: 120, height: 54, fontSize: 24, spriteWidth: 0.78, spriteHeight: 0.32, fill: 'rgba(4, 11, 26, 0.82)' });
  }

  function makeDeviceSymbol(label, position, material, shape = 'box') {
    if (shape === 'cylinder') {
      const mesh = makeCylinder(0.09, 0.38, material, { x: position.x, y: 0.28, z: position.z });
      mesh.rotation.z = Math.PI / 2;
    } else if (shape === 'antenna') {
      makeCylinder(0.045, 0.48, material, { x: position.x, y: 0.32, z: position.z });
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.01, 8, 32), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.76 }));
      halo.position.set(position.x, 0.62, position.z);
      halo.rotation.x = Math.PI / 2;
      scene.add(halo);
      animatedObjects.push({ mesh: halo, spin: true, speed: 1.1 });
    } else {
      makeBox(0.18, 0.34, 0.18, material, { x: position.x, y: 0.26, z: position.z });
    }
    makeLabel(label, { x: position.x, y: 1.14, z: position.z }, { width: 300, height: 86, fontSize: 34, spriteWidth: 1.78, spriteHeight: 0.56, fill: 'rgba(4, 11, 26, 0.94)' });
  }

  function makeGate(config) {
    const { id, type, number, position, rotation } = config;
    const group = new THREE.Group();
    group.position.set(position.x, 0, position.z);
    group.rotation.y = rotation;
    scene.add(group);

    const title = id;
    makeLabel(title, { x: position.x, y: 1.62, z: position.z }, { width: 136, height: 76, fontSize: 40, spriteWidth: 0.94, spriteHeight: 0.52, fill: type === 'entrada' ? 'rgba(10, 132, 255, 0.92)' : 'rgba(48, 209, 88, 0.92)' });

    makeBox(0.16, 0.74, 0.16, glassMat, { x: -0.28, y: 0.4, z: 0 }, group);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.05, 0.05), gateMat);
    arm.position.set(0.18, 0.76, 0);
    group.add(arm);

    const deviceLabels = type === 'entrada'
      ? [`LPR${number}`, `AntenaTAG${number}`, `Cancela${number}`, `Emissor${number}`]
      : [`LPR${number}`, `AntenaTAG${number}`, `Cancela${number}`, `Receptor${number}`];

    const localPositions = [
      { x: -0.52, z: -0.32, mat: deviceMat, shape: 'box' },
      { x: -0.16, z: 0.34, mat: glassMat, shape: 'antenna' },
      { x: 0.22, z: -0.32, mat: gateMat, shape: 'cylinder' },
      { x: 0.58, z: 0.34, mat: type === 'entrada' ? emitterMat : receiverMat, shape: 'box' },
    ];

    deviceLabels.forEach((label, index) => {
      const local = localPositions[index];
      const world = new THREE.Vector3(local.x, 0, local.z).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
      makeDeviceSymbol(label, { x: position.x + world.x, z: position.z + world.z }, local.mat, local.shape);
    });

    gateState.set(id, { group, arm, position: new THREE.Vector3(position.x, 0.9, position.z), active: 0 });
    return group;
  }

  function makeCar(color) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.28), new THREE.MeshStandardMaterial({ color, roughness: 0.34, metalness: 0.18 }));
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.13, 0.2), new THREE.MeshStandardMaterial({ color: 0xdafcff, roughness: 0.18, metalness: 0.45 }));
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.035, 0.18), new THREE.MeshBasicMaterial({ color: cyan }));
    body.position.y = 0.18;
    cabin.position.set(0.03, 0.33, 0);
    light.position.set(0.28, 0.19, 0);
    group.add(body, cabin, light);
    scene.add(group);
    return group;
  }

  function makePulse() {
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.86 }));
    scene.add(pulse);
    return pulse;
  }

  function v(x, z) {
    return new THREE.Vector3(x, 0.08, z);
  }

  function easeInOut(value) {
    return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
  }

  function samplePath(points, progress) {
    const clamped = Math.min(Math.max(progress, 0), 1);
    const scaled = clamped * (points.length - 1);
    const index = Math.min(points.length - 2, Math.floor(scaled));
    const local = scaled - index;
    const position = new THREE.Vector3().lerpVectors(points[index], points[index + 1], easeInOut(local));
    const direction = new THREE.Vector3().subVectors(points[index + 1], points[index]);
    return { position, direction };
  }

  const hubBase = makeBox(1.05, 0.3, 1.05, new THREE.MeshStandardMaterial({ color: 0x0b1b32, roughness: 0.35, metalness: 0.22 }), { x: 0, y: 0.15, z: 0 });
  const hubCore = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.86, 32), glassMat);
  hubCore.position.set(0, 0.74, 0);
  scene.add(hubCore);
  animatedObjects.push({ mesh: hubCore, spin: true, speed: 0.45 });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.015, 8, 80), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.28 }));
  ring.position.y = 0.88;
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  animatedObjects.push({ mesh: ring, spin: true, speed: -0.65 });

  const gates = [
    { id: 'P1', type: 'entrada', number: 1, position: { x: -4.2, z: -1.86 }, rotation: 0 },
    { id: 'P2', type: 'entrada', number: 2, position: { x: 4.2, z: 1.86 }, rotation: Math.PI },
    { id: 'P3', type: 'saida', number: 3, position: { x: -4.2, z: 1.86 }, rotation: 0 },
    { id: 'P4', type: 'saida', number: 4, position: { x: 4.2, z: -1.86 }, rotation: Math.PI },
  ];

  gates.forEach(makeGate);

  makeRoadBetween(v(-5.0, -1.86), v(-2.2, -1.15));
  makeRoadBetween(v(5.0, 1.86), v(2.2, 1.15));
  makeRoadBetween(v(-2.2, 1.15), v(-5.0, 1.86));
  makeRoadBetween(v(2.2, -1.15), v(5.0, -1.86));
  makeRoadBetween(v(-2.2, -1.15), v(2.2, -1.15));
  makeRoadBetween(v(-2.2, 1.15), v(2.2, 1.15));
  makeRoadBetween(v(-2.2, -1.15), v(-2.2, 1.15));
  makeRoadBetween(v(2.2, -1.15), v(2.2, 1.15));
  makeRoadBetween(v(0, -1.15), v(0, 1.15), 0.38);

  const slots = [
    { id: 'V01', x: -1.35, z: -0.36 },
    { id: 'V02', x: -0.45, z: -0.36 },
    { id: 'V03', x: 0.45, z: -0.36 },
    { id: 'V04', x: 1.35, z: -0.36 },
    { id: 'V05', x: -1.35, z: 0.52 },
    { id: 'V06', x: -0.45, z: 0.52 },
    { id: 'V07', x: 0.45, z: 0.52 },
    { id: 'V08', x: 1.35, z: 0.52 },
  ];
  slots.forEach((slot) => makeParkingSlot(slot.x, slot.z, slot.id));

  const routes = [
    {
      mesh: makeCar(0xffffff),
      startsParked: true,
      enterGate: 'P1',
      exitGate: 'P4',
      enterStart: 18,
      exitStart: 0,
      slot: v(-1.35, -0.36),
      entryPath: [v(-5.15, -1.86), v(-4.2, -1.86), v(-2.2, -1.15), v(-1.35, -0.36)],
      exitPath: [v(-1.35, -0.36), v(0, -1.15), v(2.2, -1.15), v(4.2, -1.86), v(5.2, -1.86)],
    },
    {
      mesh: makeCar(0x0a84ff),
      enterGate: 'P2',
      exitGate: 'P3',
      enterStart: 3,
      exitStart: 21,
      slot: v(0.45, 0.52),
      entryPath: [v(5.15, 1.86), v(4.2, 1.86), v(2.2, 1.15), v(0.45, 0.52)],
      exitPath: [v(0.45, 0.52), v(0, 1.15), v(-2.2, 1.15), v(-4.2, 1.86), v(-5.2, 1.86)],
    },
    {
      mesh: makeCar(0x30d158),
      startsParked: true,
      enterGate: 'P1',
      exitGate: 'P3',
      enterStart: 24,
      exitStart: 6,
      slot: v(1.35, -0.36),
      entryPath: [v(-5.15, -1.86), v(-4.2, -1.86), v(-2.2, -1.15), v(0, -1.15), v(1.35, -0.36)],
      exitPath: [v(1.35, -0.36), v(0, 1.15), v(-2.2, 1.15), v(-4.2, 1.86), v(-5.2, 1.86)],
    },
    {
      mesh: makeCar(0xff9f0a),
      enterGate: 'P2',
      exitGate: 'P4',
      enterStart: 9,
      exitStart: 27,
      slot: v(-0.45, 0.52),
      entryPath: [v(5.15, 1.86), v(4.2, 1.86), v(2.2, 1.15), v(0, 1.15), v(-0.45, 0.52)],
      exitPath: [v(-0.45, 0.52), v(0, -1.15), v(2.2, -1.15), v(4.2, -1.86), v(5.2, -1.86)],
    },
    {
      mesh: makeCar(0xff4d6d),
      startsParked: true,
      enterGate: 'P1',
      exitGate: 'P4',
      enterStart: 30,
      exitStart: 12,
      slot: v(-0.45, -0.36),
      entryPath: [v(-5.15, -1.86), v(-4.2, -1.86), v(-2.2, -1.15), v(-0.45, -0.36)],
      exitPath: [v(-0.45, -0.36), v(0, -1.15), v(2.2, -1.15), v(4.2, -1.86), v(5.2, -1.86)],
    },
    {
      mesh: makeCar(0x9b7bff),
      enterGate: 'P2',
      exitGate: 'P3',
      enterStart: 15,
      exitStart: 33,
      slot: v(1.35, 0.52),
      entryPath: [v(5.15, 1.86), v(4.2, 1.86), v(2.2, 1.15), v(1.35, 0.52)],
      exitPath: [v(1.35, 0.52), v(0, 1.15), v(-2.2, 1.15), v(-4.2, 1.86), v(-5.2, 1.86)],
    },
  ];
  pulses.push({ mesh: makePulse(), fromGate: 'P1', offset: 0.0 });
  pulses.push({ mesh: makePulse(), fromGate: 'P2', offset: 0.25 });
  pulses.push({ mesh: makePulse(), fromGate: 'P3', offset: 0.5 });
  pulses.push({ mesh: makePulse(), fromGate: 'P4', offset: 0.75 });

  const cycleDuration = 36;
  const moveDuration = 2.35;

  function operationForRoute(route, time) {
    const entryEnd = route.enterStart + moveDuration;
    const exitEnd = route.exitStart + moveDuration;

    if (time >= route.enterStart && time < entryEnd) {
      return { type: 'enter', gate: route.enterGate, progress: (time - route.enterStart) / moveDuration };
    }

    if (time >= route.exitStart && time < exitEnd) {
      return { type: 'exit', gate: route.exitGate, progress: (time - route.exitStart) / moveDuration };
    }

    return null;
  }

  function isParkedDuringCycle(route, time) {
    if (route.startsParked) {
      return time < route.exitStart || time >= route.enterStart + moveDuration;
    }

    return time >= route.enterStart + moveDuration && time < route.exitStart;
  }

  function parkCar(route) {
    route.mesh.position.copy(route.slot);
    route.mesh.position.y = 0.08;
    route.mesh.rotation.y = Math.PI / 2;
    route.mesh.visible = true;
  }

  function animateRoute(route, operation) {
    const path = operation.type === 'enter' ? route.entryPath : route.exitPath;
    const sample = samplePath(path, operation.progress);
    route.mesh.position.copy(sample.position);
    route.mesh.position.y = 0.08 + Math.sin(operation.progress * Math.PI) * 0.03;
    route.mesh.rotation.y = Math.atan2(-sample.direction.z, sample.direction.x);
    route.mesh.visible = operation.progress < 0.98 || operation.type === 'enter';
  }

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(0, width < 520 ? 9.25 : 8.2, width < 520 ? 9.9 : 8.8);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  let isVisible = true;
  const visibilityObserver = new IntersectionObserver((entries) => {
    isVisible = entries.some((entry) => entry.isIntersecting);
  }, { threshold: 0.05 });
  visibilityObserver.observe(container);

  function render() {
    const elapsed = clock.getElapsedTime();
    const cycleTime = (elapsed % cycleDuration);

    if (!prefersReducedMotion && isVisible) {
      gateState.forEach((state) => { state.active = 0; });

      routes.forEach((route) => {
        const operation = operationForRoute(route, cycleTime);
        if (operation) {
          animateRoute(route, operation);
          const gate = gateState.get(operation.gate);
          if (gate) gate.active = Math.max(gate.active, Math.sin(operation.progress * Math.PI));
        } else if (isParkedDuringCycle(route, cycleTime)) {
          parkCar(route);
        } else {
          route.mesh.visible = false;
        }
      });

      gateState.forEach((state) => {
        state.arm.rotation.z = -state.active * 0.82;
      });

      pulses.forEach((pulse) => {
        const gate = gateState.get(pulse.fromGate);
        const loop = (elapsed * 0.36 + pulse.offset) % 1;
        if (gate) pulse.mesh.position.lerpVectors(gate.position, new THREE.Vector3(0, 1.18, 0), easeInOut(loop));
        const gateActivity = gate ? gate.active : 0;
        pulse.mesh.material.opacity = gateActivity > 0.05 && loop < 0.86 ? (0.78 - loop * 0.52) * gateActivity : 0;
        pulse.mesh.scale.setScalar(0.85 + loop * 1.4);
      });

      animatedObjects.forEach((item, index) => {
        if (item.spin) item.mesh.rotation.y += item.speed * 0.01;
        if (item.baseY) item.mesh.position.y = item.baseY + Math.sin(elapsed * item.speed + index) * 0.045;
      });

      hubBase.rotation.y = Math.sin(elapsed * 0.45) * 0.08;
    } else {
      routes.forEach((route) => parkCar(route));
      gateState.forEach((state) => {
        state.arm.rotation.z = -0.26;
      });
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
}
