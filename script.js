/* =========================================================
   BENJI BOKOMOFULO — SITE PERSONNEL / CIC
   Script principal
   ========================================================= */

console.log('%cBienvenue sur le site de Benji Bokomofulo 👋', 'color:#0a192f;font-weight:bold;font-size:14px;');
console.log('%cCIC — Responsable de la Programmation des Formations', 'color:#0a192f;');

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Barre de progression au scroll ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 1bis. Parallaxe légère sur l'image du hero ---------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.25;
      heroBg.style.transform = `translateY(${offset}px) scale(1.05)`;
    }, { passive: true });
  }

  /* ---------- 2. Menu burger mobile ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. Animation au scroll (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 4. Bouton retour en haut ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 5. Mode sombre / clair ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const applyTheme = (mode) => {
      document.body.classList.toggle('dark-mode', mode === 'dark');
      themeToggle.checked = mode === 'dark';
    };
    let saved = 'light';
    try { saved = window.localStorage ? (localStorage.getItem('bb-theme') || 'light') : 'light'; } catch (e) { saved = 'light'; }
    applyTheme(saved);
    themeToggle.addEventListener('change', () => {
      const next = themeToggle.checked ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('bb-theme', next); } catch (e) { /* stockage indisponible, on ignore */ }
    });
  }

  /* ---------- 5bis. Compteurs animés (chiffres clés) ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const duration = 1200;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.round(progress * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => countObserver.observe(el));
  }

  /* ---------- 5ter. Lien de navigation actif au scroll ---------- */
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navAnchors)
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(sec => spy.observe(sec));
  }

  /* ---------- 6. Formulaire de contact avec validation ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const feedback = document.getElementById('form-feedback');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        feedback.textContent = 'Merci de remplir tous les champs avant d\'envoyer le message.';
        feedback.style.color = '#e05c5c';
        return;
      }
      if (!emailPattern.test(email)) {
        feedback.textContent = 'L\'adresse email saisie ne semble pas valide.';
        feedback.style.color = '#e05c5c';
        return;
      }

      const subject = encodeURIComponent('Contact depuis le site — ' + name);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = `mailto:bokomofulob@gmail.com?subject=${subject}&body=${body}`;

      feedback.textContent = 'Votre client mail va s\'ouvrir pour envoyer le message. Merci !';
      feedback.style.color = '#2a9d6f';
      form.reset();
    });
  }

  /* ---------- 7. Année dynamique dans le footer ---------- */
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
