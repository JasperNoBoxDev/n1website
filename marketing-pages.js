(() => {
  // Nav CTA labels and footer links live in each page's static markup.
  // Group the desktop columns into one mobile panel, then drive its toggle.
  const nav = document.querySelector('.marketing-nav');
  const toggle = document.querySelector('.marketing-toggle');
  if (!nav || !toggle) return;

  const inner = nav.querySelector('.marketing-nav-inner');
  const links = nav.querySelector('.marketing-links');
  const actions = nav.querySelector('.marketing-actions');
  if (inner && links && actions && !nav.querySelector('.marketing-menu')) {
    const menu = document.createElement('div');
    menu.className = 'marketing-menu';
    menu.id = 'marketing-menu';
    inner.insertBefore(menu, links);
    menu.append(links, actions);
    toggle.setAttribute('aria-controls', menu.id);
  }

  const hero = document.querySelector('.page-hero, .interview-hero, .hero');
  const colourAtNav = () => {
    const candidates = document.elementsFromPoint(Math.round(innerWidth / 2), 32);
    let element = candidates.find((candidate) => candidate !== nav && !nav.contains(candidate));
    while (element) {
      const colour = getComputedStyle(element).backgroundColor;
      const values = colour.match(/[\d.]+/g)?.map(Number) || [];
      const alpha = values.length > 3 ? values[3] : 1;
      if (values.length >= 3 && alpha > .05) {
        const [r, g, b] = values.map((value) => value / 255);
        const linear = [r, g, b].map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
        return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
      }
      element = element.parentElement;
    }
    return 1;
  };

  const productWindow = document.querySelector('.product-hero-window');
  let navTicking = false;
  const updateNavState = () => {
    const pastHero = productWindow
      ? productWindow.getBoundingClientRect().top <= 76
      : hero ? hero.getBoundingClientRect().bottom <= 0 : scrollY > 64;
    nav.classList.toggle('is-past-hero', pastHero);
    nav.classList.toggle('is-over-dark', colourAtNav() < .38);
  };
  const scheduleNavUpdate = () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
      updateNavState();
      navTicking = false;
    });
  };
  addEventListener('scroll', scheduleNavUpdate, { passive: true });
  addEventListener('resize', scheduleNavUpdate);
  updateNavState();

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
  matchMedia('(min-width: 1281px)').addEventListener('change', (event) => {
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
