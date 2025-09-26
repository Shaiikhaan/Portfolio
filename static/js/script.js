document.addEventListener('DOMContentLoaded', () => {
  // =============================
  // Mobile Nav Toggle
  // =============================
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu when a link is clicked (mobile UX)
    navLinks.addEventListener('click', (e) => {
      const t = e.target;
      if (t instanceof Element && t.matches('a.nav__link')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =============================
  // Smooth Scroll (no header offset in split layout)
  // =============================
  const headerHeight = 0;

  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - (headerHeight + 10);
    window.scrollTo({ top: Math.max(offsetTop, 0), behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      const isSamePageAnchor = href.startsWith('#');
      if (isSamePageAnchor) {
        e.preventDefault();
        smoothScrollTo(href);
        history.pushState(null, '', href);
      }
    });
  });

  // =============================
  // Active Link Highlighting via IntersectionObserver
  // =============================
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          const href = a.getAttribute('href');
          if (href === `#${id}`) {
            a.classList.add('is-active');
          } else {
            a.classList.remove('is-active');
          }
        });
      }
    });
  }, { rootMargin: `-40% 0px -50% 0px`, threshold: 0.1 });

  sections.forEach((sec) => sectionObserver.observe(sec));

  // =============================
  // Reveal on Scroll
  // =============================
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach((el) => revealObserver.observe(el));

  // =============================
  // Back to Top visibility
  // =============================
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const toggleTop = () => {
      if (window.scrollY > 300) toTop.classList.add('is-visible');
      else toTop.classList.remove('is-visible');
    };
    toggleTop();
    window.addEventListener('scroll', toggleTop, { passive: true });
  }

  // =============================
  // Footer year
  // =============================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // =============================
  // Cursor-following light
  // =============================
  const cursorLight = document.querySelector('.cursor-light');
  if (cursorLight) {
    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let curX = targetX, curY = targetY;
    const ease = 0.4; // higher = faster follow
    let hasSnapped = false;

    const update = () => {
      const dx = targetX - curX;
      const dy = targetY - curY;
      // snap when close enough to avoid micro-jitter
      if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
        curX = targetX;
        curY = targetY;
      } else {
        curX += dx * ease;
        curY += dy * ease;
      }
      // GPU-accelerated, includes centering translate
      (cursorLight).style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(update);
    };
    update();

    const onPointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasSnapped) {
        // snap immediately on first movement so it feels responsive
        curX = targetX;
        curY = targetY;
        hasSnapped = true;
      }
    };
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    window.addEventListener('mouseleave', () => {
      (cursorLight).style.opacity = '0';
    });
    window.addEventListener('mouseenter', () => {
      (cursorLight).style.opacity = '0.7';
    });
  }

  // =============================
  // Basic contact form handler (placeholder)
  // =============================
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // You can later wire this to a Flask endpoint
      alert('Thanks! Your message has been captured (demo).');
      if (typeof form.reset === 'function') {
        form.reset();
      }
    });
  }
});

