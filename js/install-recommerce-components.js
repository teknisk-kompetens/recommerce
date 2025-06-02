/**
 * install-recommerce-components.js
 *
 * Detta skript injicerar automatiskt alla modulära komponenter utan behov av manuella anpassningar.
 * Allt är nu hårdkodat mot er HTML-struktur v1.3 (”re-commerce_website_complete_v1.3.html”).
 *
 * Funktioner:
 *   1. Animerad uppräkning av statistik i #aboutSection
 *   2. Tjänstekort med Tilt & Fade-In i #servicesSection
 *   3. Fast flytande CTA-knapp som visas efter hero
 *   4. Three.js 3D roterande torus i #hero
 *
 * Instruktion:
 * 1. Spara filen som "install-recommerce-components.js" i ditt /js/-bibliotek.
 * 2. Lägg till i din HTMLs <head> (direkt efter era andra <link> / <script>‐rader):
 *      <script src="js/install-recommerce-components.js" defer></script>
 * 3. Klart. Inga fler manuella steg.
 */

// Kör allt när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
  injectExternalScripts();
  injectComponentStyles();
  replaceStaticStats();
  wrapServiceCardsWithTilt();
  injectFloatingCTA();
  injectThreeJSCanvas();
  initCountUp();
  initTiltOnCards();
  initCTA();
  initThreeJSTorus();
});

/* ========================================================================
 * 1) Lade in externa bibliotek (CountUp.js, VanillaTilt.js, Three.js)
 * ======================================================================== */
function injectExternalScripts() {
  const head = document.head;

  // CountUp.js (för statistik‐uppräkning)
  if (!document.querySelector('script[src*="countup.min.js"]')) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.0.7/countUp.min.js';
    s.defer = true;
    head.appendChild(s);
  }

  // VanillaTilt.js (för tilt‐effekt på korten)
  if (!document.querySelector('script[src*="vanilla-tilt.min.js"]')) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.7.0/dist/vanilla-tilt.min.js';
    s.defer = true;
    head.appendChild(s);
  }

  // Three.js (för 3D‐torus i hero)
  if (!document.querySelector('script[src*="three.min.js"]')) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.151.3/three.min.js';
    s.defer = true;
    head.appendChild(s);
  }
}

/* ========================================================================
 * 2) Injicerar alla nödvändiga CSS-regler i <head>
 * ======================================================================== */
function injectComponentStyles() {
  const head = document.head;
  const style = document.createElement('style');
  style.innerHTML = `
    /* ===== 1. STATISTIK‐UPPRÄKNING ===== */
    /* Ersätter de statiska <h3 class="h5 fw-bold">65%</h3> etc. i #aboutSection */
    .stat-counter {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--secondary);
      margin-bottom: 0.5rem;
    }
    .stat-wrapper {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      margin: 2rem 0;
    }
    .stat-box {
      background: #ffffff;
      border-radius: 0.5rem;
      padding: 1rem 1.5rem;
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
      text-align: center;
      min-width: 120px;
    }
    .stat-box p {
      margin: 0;
      font-size: 0.9rem;
      color: #555;
    }

    /* ===== 2. Tjänstekort (Tilt + Fade‐In) ===== */
    /* Avser alla .card h-100 i #servicesSection */
    .tilt-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      perspective: 1000px;
    }
    .tilt-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .tilt-card .card {
      border: none;
    }
    .tilt-card .card:hover {
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }

    /* ===== 3. Flytande CTA‐knapp ===== */
    #floating-cta {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--secondary);
      color: #fff;
      padding: 0.75rem 1.25rem;
      border-radius: 50px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transform: translateY(100px);
      opacity: 0;
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      z-index: 2000;
    }
    #floating-cta.visible {
      transform: translateY(0);
      opacity: 1;
    }
    #floating-cta:hover {
      background: var(--accent);
    }

    /* ===== 4. 3D‐TORUS i HERO ===== */
    #hero { position: relative; }
    #hero-3d {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }
    #hero > .container {
      position: relative;
      z-index: 1;
    }
  `;
  head.appendChild(style);
}

/* ========================================================================
 * 3a) ERSÄTTER STATISKA “65%, 304%, 48”‐BLOCKET med UPPRÄKNING 
 * ========================================================================
 * Originalet:
 *   <div class="d-flex flex-wrap gap-3 mt-4">
 *     <div class="text-center px-4 py-3 bg-white rounded shadow-sm">
 *       <h3 class="h5 fw-bold">65%</h3>
 *       <p class="text-muted mb-0">Genomsnittlig försäljningsökning</p>
 *     </div>
 *     <div class="text-center px-4 py-3 bg-white rounded shadow-sm">
 *       <h3 class="h5 fw-bold">304%</h3>
 *       <p class="text-muted mb-0">EBIT‐förbättring</p>
 *     </div>
 *     <div class="text-center px-4 py-3 bg-white rounded shadow-sm">
 *       <h3 class="h5 fw-bold">48%</h3>
 *       <p class="text-muted mb-0">…</p>
 *     </div>
 *   </div>
 *
 * Nu ersätter vi allt detta med:
 *   <div class="stat-wrapper">
 *     <div class="stat-box">
 *       <div class="stat-counter" data-target="65">0%</div>
 *       <p>Genomsnittlig försäljningsökning</p>
 *     </div>
 *     …
 *   </div>
 */
function replaceStaticStats() {
  // 1. Leta upp #aboutSection
  const about = document.querySelector('#aboutSection');
  if (!about) return;

  // 2. Inuti hitta det statiska blocket (d-flex flex-wrap gap-3 mt-4)
  const oldStatsWrapper = about.querySelector('.d-flex.flex-wrap.gap-3.mt-4');
  if (!oldStatsWrapper) return;

  // 3. Skapa ny container
  const wrapper = document.createElement('div');
  wrapper.className = 'stat-wrapper';

  // 4. Hämta de tre statiska värdena och rubrikerna som text
  //    Vi vet att det fanns tre <div class="text-center …"> med <h3> och <p class="text-muted mb-0">…
  const oldBoxes = Array.from(oldStatsWrapper.querySelectorAll('div.text-center'));
  oldBoxes.forEach(box => {
    // Identifiera talet (65%, 304%, 48% etc.)
    const rawNumber = box.querySelector('h3.h5.fw-bold')?.textContent.trim().replace('%','');
    // Identifiera beskrivningstexten (”Genomsnittlig försäljningsökning” etc.)
    const label = box.querySelector('p.text-muted')?.textContent.trim() || '';
    if (rawNumber) {
      const statBox = document.createElement('div');
      statBox.className = 'stat-box';
      // Uppräknings-elementet
      const counter = document.createElement('div');
      counter.className = 'stat-counter';
      counter.setAttribute('data-target', rawNumber);
      counter.textContent = '0%';
      // Etiketten under
      const p = document.createElement('p');
      p.textContent = label;
      // Samla ihop
      statBox.appendChild(counter);
      statBox.appendChild(p);
      wrapper.appendChild(statBox);
    }
  });

  // 5. Ersätt det gamla blocket med det nya
  oldStatsWrapper.replaceWith(wrapper);
}

/* ========================================================================
 * 3b) WRAPPA ALLA TJÄNSTEKORT i #servicesSection med tilt‐kontainer
 * ========================================================================
 * Originalet:
 *   <section id="servicesSection"> …
 *     <div class="row g-4">
 *       <div class="col-md-6 col-lg-4 fade-in">
 *         <div class="card h-100 text-center p-4"> … </div>
 *       </div>
 *       … fler kort …
 *     </div>
 *   </section>
 *
 * Vi ska ta varje `<div class="card h-100">` och göra om det till:
 *   <div class="tilt-card">
 *     <div class="card h-100"> …</div>
 *   </div>
 *
 * Observera att vi adderar fade-in-effekten först när elementet scrol­las in.
 */
function wrapServiceCardsWithTilt() {
  const svcSection = document.querySelector('#servicesSection');
  if (!svcSection) return;

  // Leta upp alla kort i just denna sektion (”.card.h-100”)
  const existingCards = svcSection.querySelectorAll('.card.h-100');
  existingCards.forEach(card => {
    // Hoppa om vi redan lagt wrapper
    if (card.closest('.tilt-card')) return;

    // 1) Skapa en tilt‐wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'tilt-card fade-in'; 
    // ”fade-in” finns redan i HTML för att Bootstrap‐fade‐in på scroll

    // 2) Klona kortet (för att inte förlora eventuella lyssnare), men behåll text/innehåll
    const clone = card.cloneNode(true);
    // 3) Ersätt originalet med wrapper
    wrapper.appendChild(clone);
    card.replaceWith(wrapper);
  });
}

/* ========================================================================
 * 3c) INJECTA FAST FLYTANDE “Kontakta oss”-KNAPP längst ner i <body>
 * ========================================================================
 * Detta är bara en <div> med id="floating-cta". 
 * CSS/JS hanterar sedan när den syns och scrollar till #contactSection.
 */
function injectFloatingCTA() {
  if (document.getElementById('floating-cta')) return;
  const cta = document.createElement('div');
  cta.id = 'floating-cta';
  cta.setAttribute('aria-label', 'Snabb kontakt');
  cta.setAttribute('role', 'button');
  cta.innerHTML = '<i class="fas fa-phone-alt"></i> Kontakta oss';
  document.body.appendChild(cta);
}

/* ========================================================================
 * 3d) INJECTA EN TOM DIV (#hero-3d) inuti er #hero-kontainer
 * ========================================================================
 * Originalet:
 *   <section id="homeSection">
 *     <div id="hero" class="section-content d-flex align-items-center"> … </div>
 *   </section>
 *
 * Vi lägger till:
 *   <div id="hero-3d"></div>
 * *innan* själva .container inuti #hero, så att det ligger bakom texten.
 */
function injectThreeJSCanvas() {
  // Leta upp själva <div id="hero"> (inte sectionen)
  const heroDiv = document.querySelector('#hero');
  if (!heroDiv) return;

  // Hoppa om vi redan lagt in en #hero-3d
  if (heroDiv.querySelector('#hero-3d')) return;

  // 1) Säkerställ att #hero-position är relative (om det inte redan är det)
  const computed = window.getComputedStyle(heroDiv);
  if (computed.position === 'static') {
    heroDiv.style.position = 'relative';
  }

  // 2) Skapa div#hero-3d och prependa (så den hamnar bakom .container)
  const hero3d = document.createElement('div');
  hero3d.id = 'hero-3d';
  hero3d.style.pointerEvents = 'none';
  heroDiv.prepend(hero3d);
}

/* ========================================================================
 * 4) INITIERA COUNTUP‐ANIMERING (STAT‐UPPRÄKNING)
 * ======================================================================== */
function initCountUp() {
  if (typeof CountUp !== 'function') {
    // Om CountUp fortfarande inte laddats, vänta tills load
    return window.addEventListener('load', initCountUp);
  }
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const options = { duration: 2, separator: ' ', suffix: '%' };
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.getAttribute('data-target');
      const cu = new CountUp(el, target, options);
      if (!cu.error) cu.start();
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ========================================================================
 * 5) INITIERA VANILLA TILT‐EFFEKTER PÅ KORTEN
 * ======================================================================== */
function initTiltOnCards() {
  if (typeof VanillaTilt !== 'function') {
    return window.addEventListener('load', initTiltOnCards);
  }
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const wrapper = entry.target;
      wrapper.classList.add('visible');
      // Applikera tilt på just <div class="card"> som finns inuti .tilt-card
      const innerCard = wrapper.querySelector('.card.h-100');
      if (innerCard) {
        VanillaTilt.init(innerCard, {
          max: 15,
          speed: 300,
          glare: true,
          'max-glare': 0.2
        });
      }
      observer.unobserve(wrapper);
    });
  }, { threshold: 0.3 });

  cards.forEach(c => obs.observe(c));
}

/* ========================================================================
 * 6) INITIERA FLYTANDE CTA‐VISNING OCH CLICK‐SCROLL
 * ======================================================================== */
function initCTA() {
  const cta = document.getElementById('floating-cta');
  if (!cta) return;

  // Scroll‐hanterare: visa knappen först när #hero är helt utanför viewport
  document.addEventListener('scroll', () => {
    const heroDiv = document.querySelector('#hero');
    if (!heroDiv) return;
    const heroHeight = heroDiv.offsetHeight;
    if (window.scrollY > heroHeight) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  });

  // Klickhanterare: scrollar till #contactSection eller fallback
  cta.addEventListener('click', () => {
    const target = document.querySelector('#contactSection') || document.querySelector('form') || document.body;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ========================================================================
 * 7) INITIERA 3D‐TORUS MED THREE.JS
 * ======================================================================== */
function initThreeJSTorus() {
  if (typeof THREE === 'undefined') {
    return window.addEventListener('load', initThreeJSTorus);
  }
  const container = document.getElementById('hero-3d');
  if (!container) return;

  // Se till att #hero-3d tar hela bredd/höjd
  container.style.width = '100%';
  container.style.height = '100%';

  // 1) Skapa scen, kamera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  // 2) Torus‐geometri + material
  const geometry = new THREE.TorusGeometry(3, 1, 16, 100);
  const material = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    metalness: 0.7,
    roughness: 0.2
  });
  const torus = new THREE.Mesh(geometry, material);
  scene.add(torus);

  // 3) Belysning
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  camera.position.z = 10;

  // 4) Animera
  function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  // 5) Justera vid fönsterändring
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ============= SLUT PÅ FIL ============ */
