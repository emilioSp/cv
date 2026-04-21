import { runBoot } from './boot.js';
import { startClock, initAccordion } from './interactions.js';

function init() {
  startClock();
  initAccordion();
  runBoot(() => {
    document.getElementById('app').style.opacity = '1';
  });
}

document.addEventListener('DOMContentLoaded', init);
