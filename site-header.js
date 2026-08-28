(() => {
  const script = document.currentScript;
  if (!script || document.querySelector('[data-n1-site-header]')) return;

  const path = location.pathname.split('/').pop() || 'index.html';
  const current = path.startsWith('clinician-interview-')
    ? 'clinicians.html'
    : path === 'report-library.html'
      ? 'reports.html'
      : path;
  const videoPages = new Set(['index.html', 'clinicians.html', 'patients.html']);
  const links = [
    ['clinicians.html', 'For clinicians'],
    ['patients.html', 'For patients'],
    ['reports.html', 'Reports'],
    ['compliance.html', 'Compliance'],
    ['pricing.html', 'Pricing'],
    ['about.html', 'About'],
  ];
  const linkMarkup = links.map(([href, label]) =>
    `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`
  ).join('');

  const nav = document.createElement('nav');
  nav.className = `nav site-nav-v2${videoPages.has(path) ? '' : ' is-past-hero'}`;
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.setAttribute('data-n1-site-header', '');
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" aria-label="n1.care home"><span class="logo" aria-hidden="true"></span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="Open navigation"><span></span></button>
      <div class="nav-menu" id="primary-menu">
        <div class="nav-links">${linkMarkup}</div>
        <div class="nav-actions"><a class="login" href="https://app.n1.care/login">Log in</a><a class="button" href="https://app.n1.care/signup">Start free trial</a></div>
      </div>
    </div>`;
  script.insertAdjacentElement('afterend', nav);

  const toggle = nav.querySelector('.nav-toggle');
  const menu = nav.querySelector('.nav-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 1281px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  if (!videoPages.has(path)) return;
  const initializeVideoState = () => {
    const hero = document.querySelector('.tonal-hero, .doctor-hero, .patient-hero');
    if (!hero) return;
    let ticking = false;
    const update = () => nav.classList.toggle('is-past-hero', hero.getBoundingClientRect().bottom <= 0);
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVideoState, { once: true });
  } else {
    initializeVideoState();
  }
})();
