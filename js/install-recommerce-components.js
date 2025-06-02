/**
 * install-recommerce-components.js
 *
 * Detta skript injicerar automatiskt alla modulära komponenter utan behov av några manuella ändringar.
 *
 * Funktioner:
 *   1. Animerad uppräkning av statistik (skapar sektion om den saknas)
 *   2. Tjänstekort med Tilt & Fade-In (slår igenom befintliga kort)
 *   3. Fast flytande CTA-knapp
 *   4. Three.js 3D roterande torus i hero-sektionen
 *
 * Instruktion:
 * 1. Spara filen som "install-recommerce-components.js" i ditt /js/-bibliotek.
 * 2. Lägg till i din HTMLs <head>:  <script src="js/install-recommerce-components.js" defer></script>
 * 3. Ingen ytterligare konfiguration krävs: skriptet letar upp rätt sektioner automatiskt.
 */

// Kör allt när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
  injectExternalScripts();
  injectComponentStyles();
  injectStatisticsSection();
  injectServiceCardTiltWrappers();
  injectFloatingCTA();
  injectThreeJSHero();
  initCountUpCounters();
  initVanillaTiltCards();
  initFloatingCTA();
  initThreeJSTorus();
});

/**
 * 1) Lägg till externa script-taggars referenser i <head>
 */
function injectExternalScripts() {
  const head = document.head;
  // CountUp.js
  if (!document.querySelector('script[src*="countup.min.js"]')) {
    const countUpScript = document.createElement('script');
    countUpScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.0.7/countUp.min.js';
    countUpScript.defer = true;
    head.appendChild(countUpScript);
  }
  // VanillaTilt.js
  if (!document.querySelector('script[src*="vanilla-tilt.min.js"]')) {
    const tiltScript = document.createElement('script');
    tiltScript.src = 'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.7.0/dist/vanilla-tilt.min.js';
    tiltScript.defer = true;
    head.appendChild(tiltScript);
  }
  // Three.js
  if (!document.querySelector('script[src*="three.min.js"]')) {
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r146/three.min.js';
    threeScript.defer = true;
    head.appendChild(threeScript);
  }
}

/**
 * 2) Injicera CSS-regler i <head>
 */
function injectComponentStyles() {
  const head = document.head;
  const style = document.createElement('style');
  style.innerHTML = `
    /* ===== Komponent 1: Animerad Statistik ===== */
    .stat-section { padding: 4rem 2rem; text-align: center; }
    .stat-counter { font-size: 2rem; font-weight: bold; color: var(--primary); margin: 0 1rem; display: inline-block; }

    /* ===== Komponent 2: Tjänstekort Tilt & Fade-In ===== */
    .service-card-tilt { width: 100%; perspective: 1000px; margin-bottom: 2rem; opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
    .service-card-tilt.visible { opacity: 1; transform: translateY(0); }
    .service-card-content { background: #fff; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1); transition: box-shadow 0.3s; }
    .service-card-content:hover { box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

    /* ===== Komponent 3: Flytande CTA-knapp ===== */
    #floating-cta { position: fixed; bottom: 2rem; right: 2rem; background: var(--secondary); color: #fff; padding: 1rem 1.5rem; border-radius: 50px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transform: translateY(100px); opacity: 0; transition: opacity 0.3s ease-out, transform 0.3s ease-out; z-index: 1000; }
    #floating-cta.visible { transform: translateY(0); opacity: 1; }
    #floating-cta:hover { background: var(--accent); }

    /* ===== Komponent 4: 3D Torus i Hero ===== */
    #hero-3d { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
  `;
  head.appendChild(style);
}

/**
 * 3a) Skapa eller hitta statistiksektionen och injicera räknare
 * Om ingen befintlig <section> med class "stat-section" finns, skapa en ny ovanför "services"
 */
function injectStatisticsSection() {
  let statSection = document.querySelector('.stat-section');
  if (!statSection) {
    // Försök hitta services-sektionen för att infoga innan den
    const servicesSection = document.querySelector('#services, section[data-section="services"], section.services, section:nth-of-type(2)');
    statSection = document.createElement('section');
    statSection.className = 'stat-section';
    if (servicesSection && servicesSection.parentElement) {
      servicesSection.parentElement.insertBefore(statSection, servicesSection);
    } else {
      document.body.prepend(statSection);
    }
  }
  // Undvik dubbelinjektion
  if (statSection.querySelector('.stat-counter')) return;
  // Skapa upp till tre räknare
  const targets = [65, 304, 15];
  targets.forEach(val => {
    const div = document.createElement('div');
    div.className = 'stat-counter';
    div.setAttribute('data-target', String(val));
    div.textContent = '0%';
    statSection.appendChild(div);
  });
}

/**
 * 3b) Omslut befintliga tjänstekort med Tilt & Fade-In-container
 * Söker efter element med klass "service-card" under #services eller <section> med h2 "Our Services"
 */
function injectServiceCardTiltWrappers() {
  // Hitta container för tjänster
  let servicesSection = document.querySelector('#services');
  if (!servicesSection) {
    // fallback: leta efter <h2> med text "Our Services" och ta närmaste sektion
    const header = Array.from(document.querySelectorAll('h2')).find(h => /services/i.test(h.textContent));
    servicesSection = header ? header.closest('section') : null;
  }
  if (!servicesSection) return;
  // Hitta alla kort, exempelvis <div class="service-card">
  const existingCards = servicesSection.querySelectorAll('.service-card');
  existingCards.forEach(card => {
    if (card.closest('.service-card-tilt')) return;
    const wrapper = document.createElement('div'); wrapper.className = 'service-card-tilt';
    const content = document.createElement('div'); content.className = 'service-card-content';
    content.appendChild(card.cloneNode(true));
    wrapper.appendChild(content);
    card.replaceWith(wrapper);
  });
}

/**
 * 3c) Skapa och lägg till en flytande CTA-knapp längst ner i <body>
 */
function injectFloatingCTA() {
  if (document.getElementById('floating-cta')) return;
  const cta = document.createElement('div');
  cta.id = 'floating-cta'; cta.setAttribute('aria-label', 'Snabb kontakt'); cta.setAttribute('role','button');
  cta.innerHTML = '<i class="fas fa-phone-alt"></i> Kontakta oss';
  document.body.appendChild(cta);
}

/**
 * 3d) Lägg till en Three.js-canvas i hero-sektionen
 * Hittar <section id="hero"> eller första <section> med bakgrund eller .hero
 */
function injectThreeJSHero() {
  let heroSection = document.querySelector('#hero, .hero, section[data-section="hero"]');
  if (!heroSection) {
    heroSection = document.querySelector('section');
  }
  if (!heroSection) return;
  if (heroSection.querySelector('#hero-3d')) return;
  const computedStyle = window.getComputedStyle(heroSection);
  if (computedStyle.position === 'static') heroSection.style.position = 'relative';
  const hero3d = document.createElement('div'); hero3d.id = 'hero-3d'; hero3d.style.pointerEvents='none';
  heroSection.prepend(hero3d);
}

/**
 * 4) Initiera alla komponenters JavaScript-funktionalitet
 */
function initCountUpCounters() {
  if (typeof CountUp !== 'function') return window.addEventListener('load', initCountUpCounters);
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;
  const options = { duration: 2, separator: ' ', suffix: '' };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const countUp = new CountUp(el, +el.getAttribute('data-target'), options);
        if (!countUp.error) countUp.start();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => observer.observe(counter));
}

function initVanillaTiltCards() {
  if (typeof VanillaTilt !== 'function') return window.addEventListener('load', initVanillaTiltCards);
  const cards = document.querySelectorAll('.service-card-tilt');
  if (!cards.length) return;
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const content = entry.target.querySelector('.service-card-content');
        if (content) VanillaTilt.init(content, { max: 15, speed: 400, glare: true, 'max-glare': 0.2 });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  cards.forEach(card => obs.observe(card));
}

function initFloatingCTA() {
  const cta = document.getElementById('floating-cta'); if (!cta) return;
  document.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) cta.classList.add('visible'); else cta.classList.remove('visible');
  });
  cta.addEventListener('click', () => {
    const contactSection = document.querySelector('#contact, section.contact, form');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  });
}

function initThreeJSTorus() {
  if (typeof THREE === 'undefined') return window.addEventListener('load', initThreeJSTorus);
  const container = document.getElementById('hero-3d'); if (!container) return;
  container.style.width='100%'; container.style.height='100%';
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight); renderer.domElement.style.display='block';
  container.appendChild(renderer.domElement);
  const geometry = new THREE.TorusGeometry(3,1,16,100);
  const material = new THREE.MeshStandardMaterial({ color:0x3498db, metalness:0.7, roughness:0.2 });
  const torus = new THREE.Mesh(geometry, material); scene.add(torus);
  const ambientLight = new THREE.AmbientLight(0xffffff,0.5); scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff,1); pointLight.position.set(5,5,5); scene.add(pointLight);
  camera.position.z=10;
  function animate() { requestAnimationFrame(animate); torus.rotation.x+=0.01; torus.rotation.y+=0.01; renderer.render(scene, camera); }
  animate();
  window.addEventListener('resize', () => { camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); });
}

/* SLUT PÅ FIL */
