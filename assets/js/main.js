document.addEventListener('DOMContentLoaded', () => {
  // ─── Mobile “hamburger” → #mobile-menu ──────────────────────────────
  const navBtn = document.querySelector('button[data-toggle][data-target="#mobile-menu"]');
  const mobileMenu = document.getElementById('mobile-menu');

  // SVG icons
  const hamSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                </svg>`;
  const closeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="size-4" fill="currentColor"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;

  // initialize
  navBtn.innerHTML = hamSVG;

  navBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navBtn.innerHTML = isOpen ? closeSVG : hamSVG;
  });

  // ─── Docs sidebar toggle → #docs-sidebar ─────────────────────────────
  const sideBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('docs-sidebar');

  sideBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('quanta-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = stored || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  document.querySelectorAll('.themeToggle').forEach(el => {
    el.addEventListener('click', toggleTheme);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // All in-page nav links (desktop + mobile)
  const desktopLinks = [...document.querySelectorAll('nav ul a[href^="#"]')];
  const mobileLinks  = [...document.querySelectorAll('#mobile-menu a[href^="#"]')];
  const allLinks = [...desktopLinks, ...mobileLinks];

  // Map sectionId -> [links...]
  const linksById = {};
  allLinks.forEach(a => {
    const id = a.getAttribute('href').replace(/^#/, '');
    if (!id) return;
    (linksById[id] = linksById[id] || []).push(a);
  });

  // Sections that actually exist on the page
  const sections = Object.keys(linksById)
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const clearActive = () => {
    allLinks.forEach(a => {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });
  };
  const setActiveId = (id) => {
    clearActive();
    (linksById[id] || []).forEach(a => {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    });
  };

  const navH = () => (nav ? nav.offsetHeight : 0);

  const scrollToId = (id) => {
	const el = document.getElementById(id);
	if (!el) return;

	// Detect if nav is fixed
	const navStyle = nav ? window.getComputedStyle(nav).position : "";
	const needsOffset = navStyle === "fixed" || navStyle === "sticky";

	const y = el.getBoundingClientRect().top + window.scrollY - (needsOffset ? navH() + 6 : 0);

	window.scrollTo({ top: y, behavior: 'smooth' });
	};

  // Click -> smooth scroll + active + close mobile
  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const id = href.slice(1);
      setActiveId(id);
      scrollToId(id);
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Mobile toggle
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // click outside to close
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('open')) return;
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll spy (IntersectionObserver)
  let io;
  const initObserver = () => {
    if (io) io.disconnect();
    io = new IntersectionObserver((entries) => {
      // choose the most visible intersecting section
      let best = null;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
      }
      if (best) setActiveId(best.target.id);
    }, {
      root: null,
      rootMargin: `-${navH() + 50}px 0px -40% 0px`,
      threshold: [0.15, 0.35, 0.6, 0.85],
    });
    sections.forEach(s => io.observe(s));
  };
  if (sections.length) initObserver();

  // Re-init observer on resize (nav height can change)
  let rAF;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(initObserver);
  });

  // Fallback if IO not supported
  if (!('IntersectionObserver' in window)) {
    const onScroll = () => {
      const offset = navH() + 10;
      let current = sections[0]?.id;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top - offset <= 0) current = s.id;
      }
      if (current) setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Respect existing hash on load
  const initial = location.hash && location.hash.slice(1);
  if (initial && document.getElementById(initial)) {
    setTimeout(() => scrollToId(initial), 0);
  } else if (sections[0]) {
    setActiveId(sections[0].id);
  }
});