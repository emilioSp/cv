import { initAccordion } from './interactions.js';

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const panel  = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  panel.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '&#9776;';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initMobileNav();
});
