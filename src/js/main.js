/* ─────────────────────────────────────────────────────────
   MATHÉO BENTO · E-Portfolio · JavaScript
   ───────────────────────────────────────────────────────── */

// ── NAV SCROLL ────────────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── BURGER MENU ───────────────────────────────────────────
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── HERO NAME REVEAL ──────────────────────────────────────
const heroLast = document.querySelector('.hero__name-last');
if (heroLast) {
  heroLast.setAttribute('data-text', heroLast.textContent);
  setTimeout(() => heroLast.classList.add('revealed'), 600);
}

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── SMOOTH ACTIVE NAV ─────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--text)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

// ── KPI COUNTER ANIMATION ─────────────────────────────────
function animateCounter(el, target, duration = 1400, isFloat = false) {
  const start = performance.now();
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;

    if (isFloat) {
      el.textContent = current.toFixed(1).replace('.', ',') + '%';
    } else if (target >= 1000) {
      el.textContent = Math.round(current).toLocaleString('fr-FR');
    } else {
      el.textContent = Math.round(current).toString();
    }

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const kpiObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const valEl = entry.target.querySelector('.kpi-card__value');
      if (!valEl || valEl.dataset.animated) return;
      valEl.dataset.animated = '1';

      const raw = valEl.textContent.trim();

      if (raw === '1 869') {
        animateCounter(valEl, 1869, 1400);
      } else if (raw === '11,7%') {
        animateCounter(valEl, 11.7, 1400, true);
      } else if (raw === '85,7%') {
        animateCounter(valEl, 85.7, 1400, true);
      } else if (raw === '433') {
        animateCounter(valEl, 433, 1200);
      }

      kpiObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.kpi-card').forEach(el => kpiObserver.observe(el));

// ── CURSOR GLOW (desktop only) ────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,68,5,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  function moveCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(moveCursor);
  }
  moveCursor();

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

// ── HERO GRID PARALLAX ────────────────────────────────────
const heroGrid = document.querySelector('.hero__grid');
if (heroGrid) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroGrid.style.transform = `translateY(${y * 0.2}px)`;
  }, { passive: true });
}

// ── TYPING EFFECT on hero title ──────────────────────────
const heroTitle = document.querySelector('.hero__title');
if (heroTitle) {
  const fullText = heroTitle.innerHTML;
  heroTitle.style.opacity = '0';
  setTimeout(() => {
    heroTitle.style.transition = 'opacity 0.6s ease';
    heroTitle.style.opacity = '1';
  }, 900);
}
