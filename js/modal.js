// js/modal.js
const overlay = () => document.getElementById('modalOverlay');
const modalBody = () => document.getElementById('modalBody');
const modalTitle = () => document.getElementById('modalTitle');

function openModalFromTemplateId(tid) {
  const tpl = document.getElementById(tid);
  if (!tpl) return console.warn('No modal template:', tid);

  // Title is optional; fall back to h5/h3 in template if present
  const h = tpl.querySelector('h1, h2, h3, h4, h5, h6');
  if (h) modalTitle().textContent = h.textContent;
  modalBody().innerHTML = tpl.innerHTML;
  overlay().setAttribute('aria-hidden', 'false');
  overlay().classList.add('open');
}

function closeModal() {
  overlay().classList.remove('open');
  overlay().setAttribute('aria-hidden', 'true');
  modalBody().innerHTML = '';
}

// Global click handlers (delegated)
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-modal-source]');
  if (btn) {
    const tid = btn.getAttribute('data-modal-source');
    openModalFromTemplateId(tid);
    return;
  }
  // close on overlay bg or close button
  if (ev.target.id === 'modalOverlay' || ev.target.id === 'modalClose') {
    closeModal();
  }
});

// ESC to close
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && overlay()?.classList.contains('open')) closeModal();
});

// If you have any code that *queries* modal templates immediately, delay it:
document.addEventListener('partials:loaded', () => {
  // nothing needed if you use delegation, but this ensures order.
});
