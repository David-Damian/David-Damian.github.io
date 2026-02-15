/* ============================================
   main.js — Portfolio interactivity
   ============================================ */

(function () {
  'use strict';

  // ── Typed-text effect ──────────────────────────
  const titles = [
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Problem Solver',
    'Data Storyteller',
  ];

  const typedEl = document.getElementById('typedText');
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPING_SPEED = 80;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_TYPE = 2000;
  const PAUSE_AFTER_DELETE = 400;

  function typeEffect() {
    const currentTitle = titles[titleIndex];

    if (!isDeleting) {
      typedEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentTitle.length) {
        isDeleting = true;
        setTimeout(typeEffect, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(typeEffect, TYPING_SPEED);
    } else {
      typedEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(typeEffect, PAUSE_AFTER_DELETE);
        return;
      }
      setTimeout(typeEffect, DELETING_SPEED);
    }
  }

  // Start typed effect after hero animations land
  setTimeout(typeEffect, 1400);

  // ── Navbar scroll behaviour ────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  function onScroll() {
    const scrollY = window.scrollY;

    // Shrink & blur navbar
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 500);
    }

    // Highlight active nav link
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile hamburger menu ─────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinksContainer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });

  // ── Scroll reveal (Intersection Observer) ─────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger children slightly
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ── Animated counters ──────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const start = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // ── Project filter ─────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── Contact form (demo handler) ────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="ph ph-check-circle"></i> Message Sent!';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.7';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ── Footer year ────────────────────────────────
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ── Profile image fallback ─────────────────────
  const profileImg = document.getElementById('profileImage');
  if (profileImg) {
    profileImg.addEventListener('error', () => {
      profileImg.style.display = 'none';
    });
  }
})();

// ── CV Download Modal (global scope for onclick) ──
function openCvModal(e) {
  e.preventDefault();
  document.getElementById('cvModal').classList.add('active');
}

function closeCvModal() {
  document.getElementById('cvModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const cvModal = document.getElementById('cvModal');
  const cvModalClose = document.getElementById('cvModalClose');
  const cvForm = document.getElementById('cvForm');

  // Close on X button
  if (cvModalClose) cvModalClose.addEventListener('click', closeCvModal);

  // Close on overlay click
  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeCvModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCvModal();
  });

  // Form submission
  if (cvForm) {
    cvForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('cvSubmitBtn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="ph ph-spinner"></i> Sending...';
      btn.disabled = true;

      try {
        const formData = new FormData(cvForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          btn.innerHTML = '<i class="ph ph-check-circle"></i> Downloading...';

          // Trigger CV download
          const link = document.createElement('a');
          link.href = 'assets/docs/David_Damian_CV.pdf';
          link.download = 'David_Damian_CV.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            closeCvModal();
            cvForm.reset();
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          }, 1500);
        } else {
          btn.innerHTML = '<i class="ph ph-warning"></i> Error. Try again.';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          }, 2000);
        }
      } catch (err) {
        btn.innerHTML = '<i class="ph ph-warning"></i> Error. Try again.';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }, 2000);
      }
    });
  }
});
