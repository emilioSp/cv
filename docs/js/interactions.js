export function initAccordion() {
  document.querySelectorAll('.exp-card').forEach(card => {
    const header  = card.querySelector('.exp-header');
    const body    = card.querySelector('.exp-body');
    const chevron = card.querySelector('.exp-chevron');
    if (!header || !body || !chevron) return;

    header.addEventListener('click', () => {
      const opening = !body.classList.contains('open');
      body.classList.toggle('open', opening);
      chevron.classList.toggle('open', opening);
      header.style.background = opening ? 'rgba(255,255,255,0.018)' : 'transparent';
    });
  });
}
