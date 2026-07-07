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
  const cars = [];
  const pulses = [];

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  camera.position.set(0, 7.6, 8.6);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xdafcff, 0x081322, 1.6));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
  keyLight.position.set(3.8, 7.2, 4.6);
  scene.add(keyLight);

  const cyan = 0x00f2fe;
  const blue = 0x0a84ff;
  const white = 0xf6fbff;
  const asphalt = new THREE.MeshStandardMaterial({ color: 0x111a27, roughness: 0.72, metalness: 0.05 });
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.65, metalness: 0.08 });
  const laneMat = new THREE.MeshBasicMaterial({ color: 0xdff8ff, transparent: true, opacity: 0.72 });
  const glowMat = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.28 });
  const lotMat = new THREE.MeshStandardMaterial({ color: 0x10223d, roughness: 0.55, metalness: 0.12 });
  const glassMat = new THREE.MeshStandardMaterial({ color: cyan, emissive: cyan, emissiveIntensity: 0.18, roughness: 0.3, metalness: 0.35 });

  const ground = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.16, 5.6), asphalt);
  ground.position.y = -0.1;
  scene.add(ground);

  const grid = new THREE.GridHelper(9.8, 14, 0x1f6b83, 0x163145);
  grid.position.y = 0.01;
  scene.add(grid);

  function makeBox(width, height, depth, material, position) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);
    return mesh;
  }

  function makeRoad(x, z, length, rotation) {
    const road = new THREE.Mesh(new THREE.BoxGeometry(length, 0.06, 0.42), roadMat);
    road.position.set(x, 0.08, z);
    road.rotation.y = rotation;
    scene.add(road);

    for (let i = -2; i <= 2; i += 1) {
      const lane = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.012, 0.035), laneMat);
      lane.position.set(x + Math.cos(rotation) * i * 0.82, 0.13, z - Math.sin(rotation) * i * 0.82);
      lane.rotation.y = rotation;
      scene.add(lane);
    }
  }

  function makeLot(x, z) {
    const base = makeBox(1.15, 0.2, 0.86, lotMat, { x, y: 0.1, z });
    makeBox(0.85, 0.62, 0.56, lotMat, { x, y: 0.51, z });

    for (let i = -1; i <= 1; i += 1) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.012, 0.62), laneMat);
      stripe.position.set(x + i * 0.24, 0.84, z);
      scene.add(stripe);
    }

    const beacon = makeBox(0.13, 0.13, 0.13, glassMat, { x, y: 0.94, z });
    animatedObjects.push({ mesh: beacon, baseY: beacon.position.y, speed: 1.6 });
    return base;
  }

  function makeGate(x, z, rotation) {
    const post = makeBox(0.12, 0.55, 0.12, glassMat, { x, y: 0.35, z });
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: white, roughness: 0.35 }));
    arm.position.set(x + Math.cos(rotation) * 0.35, 0.66, z - Math.sin(rotation) * 0.35);
    arm.rotation.y = rotation;
    scene.add(arm);
    animatedObjects.push({ mesh: arm, gateRotation: rotation, speed: 2.2 });
    return post;
  }

  function makeCar(color) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.26), new THREE.MeshStandardMaterial({ color, roughness: 0.34, metalness: 0.18 }));
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.13, 0.2), new THREE.MeshStandardMaterial({ color: 0xdafcff, roughness: 0.18, metalness: 0.45 }));
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.18), new THREE.MeshBasicMaterial({ color: cyan }));
    body.position.y = 0.18;
    cabin.position.set(0.02, 0.33, 0);
    light.position.set(0.26, 0.19, 0);
    group.add(body, cabin, light);
    scene.add(group);
    return group;
  }

  function makePulse() {
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.86 }));
    scene.add(pulse);
    return pulse;
  }

  makeRoad(-2.35, -1.08, 4.6, -0.42);
  makeRoad(2.35, -1.08, 4.6, 0.42);
  makeRoad(0, 1.35, 5.1, 0);

  makeLot(-3.8, -2.05);
  makeLot(3.8, -2.05);
  makeLot(0, 2.2);

  makeGate(-2.92, -1.78, -0.42);
  makeGate(2.92, -1.78, 0.42);
  makeGate(-0.74, 1.35, 0);

  const hubBase = makeBox(1.05, 0.3, 1.05, new THREE.MeshStandardMaterial({ color: 0x0b1b32, roughness: 0.35, metalness: 0.22 }), { x: 0, y: 0.15, z: 0 });
  const hubCore = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.86, 32), glassMat);
  hubCore.position.set(0, 0.74, 0);
  scene.add(hubCore);
  animatedObjects.push({ mesh: hubCore, spin: true, speed: 0.45 });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.015, 8, 80), glowMat);
  ring.position.y = 0.88;
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  animatedObjects.push({ mesh: ring, spin: true, speed: -0.65 });

  cars.push({ mesh: makeCar(0xffffff), from: new THREE.Vector3(-3.8, 0, -2.05), to: new THREE.Vector3(-0.72, 0, -0.2), rot: -0.42, offset: 0 });
  cars.push({ mesh: makeCar(0x0a84ff), from: new THREE.Vector3(3.8, 0, -2.05), to: new THREE.Vector3(0.72, 0, -0.2), rot: Math.PI + 0.42, offset: 0.33 });
  cars.push({ mesh: makeCar(0x30d158), from: new THREE.Vector3(0, 0, 2.2), to: new THREE.Vector3(0, 0, 0.62), rot: Math.PI, offset: 0.66 });

  pulses.push({ mesh: makePulse(), from: new THREE.Vector3(-3.55, 0.95, -1.72), to: new THREE.Vector3(0, 1.18, 0), offset: 0.12 });
  pulses.push({ mesh: makePulse(), from: new THREE.Vector3(3.55, 0.95, -1.72), to: new THREE.Vector3(0, 1.18, 0), offset: 0.45 });
  pulses.push({ mesh: makePulse(), from: new THREE.Vector3(0, 1.1, 1.9), to: new THREE.Vector3(0, 1.18, 0), offset: 0.78 });

  function easeInOut(value) {
    return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
  }

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(0, width < 520 ? 8.6 : 7.6, width < 520 ? 9.8 : 8.6);
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

    if (!prefersReducedMotion && isVisible) {
      cars.forEach((car) => {
        const loop = (elapsed * 0.22 + car.offset) % 1;
        const progress = loop < 0.82 ? easeInOut(loop / 0.82) : 1;
        car.mesh.position.lerpVectors(car.from, car.to, progress);
        car.mesh.position.y = 0.08 + Math.sin(progress * Math.PI) * 0.03;
        car.mesh.rotation.y = car.rot;
        car.mesh.visible = loop < 0.92;
      });

      pulses.forEach((pulse) => {
        const loop = (elapsed * 0.38 + pulse.offset) % 1;
        pulse.mesh.position.lerpVectors(pulse.from, pulse.to, easeInOut(loop));
        pulse.mesh.material.opacity = loop < 0.86 ? 0.88 - loop * 0.55 : 0;
        const scale = 0.85 + loop * 1.4;
        pulse.mesh.scale.setScalar(scale);
      });

      animatedObjects.forEach((item, index) => {
        if (item.spin) item.mesh.rotation.y += item.speed * 0.01;
        if (item.baseY) item.mesh.position.y = item.baseY + Math.sin(elapsed * item.speed + index) * 0.045;
        if (item.gateRotation !== undefined) item.mesh.rotation.z = -Math.sin(elapsed * item.speed + index) * 0.34;
      });

      hubBase.rotation.y = Math.sin(elapsed * 0.45) * 0.08;
    } else {
      cars.forEach((car, index) => {
        car.mesh.position.lerpVectors(car.from, car.to, index === 2 ? 0.45 : 0.58);
        car.mesh.rotation.y = car.rot;
        car.mesh.visible = true;
      });
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
}
