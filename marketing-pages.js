(() => {
  // Nav CTA labels and footer links live in each page's static markup.
  // This script only drives the mobile navigation toggle.
  const nav = document.querySelector('.marketing-nav');
  const toggle = document.querySelector('.marketing-toggle');
  if (!nav || !toggle) return;

  const close = (returnFocus = false) => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => close()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) close(true);
  });
  matchMedia('(min-width: 1161px)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
})();

// Media bands. Kept in its own IIFE because the navigation block above returns
// early on pages without a nav toggle. When motion is unwelcome the video is
// simply never started and its poster frame stands in, which is why every band
// carries one. play() rejects under some autoplay policies; the poster is the
// fallback there too, so the rejection is nothing to handle.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('video[data-autoplay]').forEach((video) => video.play().catch(() => {}));
})();
