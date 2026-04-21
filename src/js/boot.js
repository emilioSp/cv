export function runBoot(onComplete) {
  const seq = JSON.parse(document.getElementById('boot-data').textContent);
  const container = document.getElementById('boot-lines');
  const bootEl = document.getElementById('boot');
  container.innerHTML = '';

  const alreadyBooted = sessionStorage.getItem('dp_booted');

  if (alreadyBooted) {
    bootEl.style.display = 'none';
    onComplete();
    return;
  }

  let i = 0;
  const tick = setInterval(() => {
    if (i < seq.length) {
      const line = seq[i++];
      const el = document.createElement('div');
      el.className = 'boot-line';
      el.style.cssText = [
        `margin-bottom:${line.type === 'rule' ? 14 : 5}px`,
        'display:flex', 'align-items:center', 'gap:12px',
        `font-size:${line.type === 'head' ? 14 : line.type === 'ready' ? 13 : 11}px`,
        `font-weight:${line.type === 'head' || line.type === 'ready' ? 600 : 400}`,
        `color:${line.type === 'head' || line.type === 'ready' ? 'var(--accent)' : line.type === 'rule' ? '#222' : '#555'}`,
        'letter-spacing:0.05em',
      ].join(';');

      if (line.type === 'check') {
        const check = document.createElement('span');
        check.textContent = '✓';
        check.style.cssText = 'color:var(--accent);font-size:10px;min-width:14px;';
        el.appendChild(check);
      }
      el.appendChild(document.createTextNode(line.text));
      container.appendChild(el);
    } else {
      clearInterval(tick);
      const cursor = document.createElement('span');
      cursor.className = 'blink-cursor';
      container.appendChild(cursor);
      setTimeout(() => {
        cursor.remove();
        setTimeout(() => {
          bootEl.style.opacity = '0';
          setTimeout(() => {
            bootEl.style.display = 'none';
            sessionStorage.setItem('dp_booted', '1');
            onComplete();
          }, 700);
        }, 600);
      }, 700);
    }
  }, 170);
}
