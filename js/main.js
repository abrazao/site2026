/* ==========================================================================
   SOFTCASE - LÓGICA E INTERATIVIDADE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initDashboardSimulator();
  initProductTabs();
  initLprSimulator();
  initContactForm();
  initScrollSpy();
});

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
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove classes active
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
      });
      
      // Adiciona classes active no botão e container alvo
      button.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      
      // Animação suave de transição
      targetContent.style.display = 'grid';
      setTimeout(() => {
        targetContent.classList.add('active');
      }, 50);
    });
  });
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
  const successState = document.getElementById('form-success');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Botão de envio entra em estado de Loading
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando solicitação...';
    
    // Simula requisição de API com delay de 1.5s
    setTimeout(() => {
      // Oculta formulário e exibe tela de sucesso
      form.style.display = 'none';
      successState.style.display = 'flex';
      
      // Rola a visualização para o topo do card de forma suave
      successState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
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
