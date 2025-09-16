// js/include.js
async function loadPartials() {
  // keep looping until no more [data-include] remain (handles nesting)
  for (let guard = 0; guard < 10; guard++) {
    const slots = [...document.querySelectorAll('[data-include]')];
    if (slots.length === 0) break;

    await Promise.all(slots.map(async (el) => {
      const url = el.getAttribute('data-include');
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`${url}: ${res.status} ${res.statusText}`);
      const html = await res.text();
      el.removeAttribute('data-include');    // prevent infinite loops
      el.innerHTML = html;
    }));
  }
  document.dispatchEvent(new CustomEvent('partials:loaded'));
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartials().catch(err => {
    console.error('Include error:', err);
    document.dispatchEvent(new CustomEvent('partials:loaded', { detail: { error: err } }));
  });
});
