// ---------------- Theme ----------------

// 1) Read & apply preferred theme ASAP (respects saved choice, else OS)
function getSavedTheme() {
  return localStorage.getItem('theme'); // 'light' | 'dark' | null
}
function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark' : 'light';
}
function applyTheme(theme) {
  const body = document.body;
  body.setAttribute('data-theme', theme);

  // swap any <img> with data-light / data-dark
  document.querySelectorAll('img[data-light][data-dark]').forEach(img => {
    const wanted = img.getAttribute(theme === 'dark' ? 'data-dark' : 'data-light');
    if (wanted && img.getAttribute('src') !== wanted) {
      img.setAttribute('src', wanted);
    }
  });
}

// Apply as soon as scripts run (defer ensures DOM is parsed)
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getSavedTheme() || getSystemTheme());
});

// 2) Delegate clicks so it works even if the button comes from partials
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('#themeToggle');
  if (!btn) return;

  const current = document.body.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

// 3) If you want the small icon inside the button to update (id="themeIcon"),
//    the applyTheme() already swaps it thanks to data-light/data-dark.
//    Just ensure the icon has BOTH data-light and data-dark attributes.
// --------------------------------------


// ---------------- Tabs (delegation) ----------------
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.tab-btn');
  if (!btn) return;
  const tabs = btn.closest('.tab-box');
  if (!tabs) return;

  tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
  const targetId = btn.getAttribute('data-target');
  tabs.querySelectorAll('.tab-pane').forEach(p =>
    p.classList.toggle('active', p.id === targetId)
  );
});





// pfp effect
document.addEventListener('partials:loaded', () => {

  const wrap = document.querySelector('.pfp-wrap');
  if (!wrap) return;

  const HOLD_MS = 750;
  wrap.style.setProperty('--hold-ms', HOLD_MS + 'ms');
  let timer = null;

  const startPending = () => {
    wrap.classList.add('pending');
    wrap.style.setProperty('--angle', '0deg');
    void wrap.offsetWidth;                 // restart the CSS transition
    wrap.style.setProperty('--angle', '360deg');

    timer = setTimeout(() => {
      const next = wrap.getAttribute('data-state') === 'base' ? 'alt' : 'base';
      wrap.setAttribute('data-state', next);
      stopPending();
    }, HOLD_MS);
  };

  const stopPending = () => {
    clearTimeout(timer);
    timer = null;
    wrap.classList.remove('pending');
    wrap.style.setProperty('--angle', '0deg');
  };

  wrap.addEventListener('mouseenter', startPending);
  wrap.addEventListener('mouseleave', stopPending);

  // Touch support (press & hold)
  let touchActive = false;
  wrap.addEventListener('touchstart', () => { touchActive = true; startPending(); }, { passive: true });
  wrap.addEventListener('touchend',   () => { if (touchActive) stopPending(); touchActive = false; });
});
