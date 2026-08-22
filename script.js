document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================
   Hero story reel — auto-cycles problem -> fix -> win.
   Placeholder for a real video later; swap the markup
   for a <video> tag and remove this block when ready.
   ============================================ */
(function heroReel() {
  const reel = document.getElementById('heroReel');
  const dotsWrap = document.getElementById('reelDots');
  if (!reel || !dotsWrap) return;

  const steps = reel.querySelectorAll('.reel-step');
  const dots = dotsWrap.querySelectorAll('.reel-dot');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  const durationMs = 2400;

  function show(i) {
    steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
    dots.forEach((d, n) => d.classList.toggle('is-active', n === i));
  }

  show(0);
  if (prefersReducedMotion) return;

  setInterval(() => {
    index = (index + 1) % steps.length;
    show(index);
  }, durationMs);
})();

/* ============================================
   Scroll reveal — fades/slides content in as it
   enters the viewport
   ============================================ */
(function scrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((el) => observer.observe(el));
})();

/* ============================================
   Mobile menu toggle
   ============================================ */
(function navToggle() {
  const btn = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ============================================
   SIGNATURE: rank ticker — climbs as the visitor
   scrolls through the page, from #47 down to #1
   ============================================ */
(function rankTicker() {
  const numberEl = document.getElementById('rankNumber');
  const fillEl = document.getElementById('rankFill');
  const widget = document.getElementById('rankWidget');
  if (!numberEl || !fillEl || !widget) return;

  const START = 47;
  const END = 1;
  let lastRank = START;

  function update() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(window.scrollY / docHeight, 0), 1);

    // Ease so movement feels earned, not linear
    const eased = 1 - Math.pow(1 - scrolled, 2);
    const rank = Math.round(START - (START - END) * eased);

    if (rank !== lastRank) {
      numberEl.textContent = rank;
      lastRank = rank;
      numberEl.classList.toggle('is-good', rank <= 10);
    }
    fillEl.style.width = `${4 + eased * 96}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ============================================
   Animated counters for the results section
   ============================================ */
(function counters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
})();

/* ============================================
   Niche switcher — same 3 packages, different
   emphasis per industry
   ============================================ */
(function nicheSwitcher() {
  const tabs = document.getElementById('nicheTabs');
  const panel = document.getElementById('nichePanel');
  if (!tabs || !panel) return;

  const data = {
    saas: [
      { tier: 'Starter', focus: 'Feature & pricing-page SEO', detail: 'Optimize core product pages and fix technical issues that stop your app from being indexed properly.' },
      { tier: 'Growth', focus: 'Comparison & alternative content', detail: '"X vs Y" and "best alternative to" pages — where SaaS buyers actually search before signing up.' },
      { tier: 'Pro', focus: 'Free tools & integration pages', detail: 'Link-worthy free tools and integration/use-case pages that compound authority across your whole domain.' },
    ],
    ecommerce: [
      { tier: 'Starter', focus: 'Product & category structure', detail: 'Clean up URL structure, product schema, and fix duplicate or thin category pages.' },
      { tier: 'Growth', focus: 'Buying-intent content', detail: 'Size guides, "best X for Y" pages, and collection content that captures people ready to buy.' },
      { tier: 'Pro', focus: 'Seasonal & scale campaigns', detail: 'Coordinated content and backlink pushes around your key selling seasons, plus ongoing catalog SEO.' },
    ],
    blog: [
      { tier: 'Starter', focus: 'Topical foundation', detail: 'Map your core topic clusters and fix any content cannibalizing its own rankings.' },
      { tier: 'Growth', focus: 'Content velocity', detail: 'Consistent publishing aimed at real search demand, not just what\'s interesting to write.' },
      { tier: 'Pro', focus: 'Authority & monetization', detail: 'Aggressive link building plus structuring content to support ads, affiliates, or products.' },
    ],
    agency: [
      { tier: 'Starter', focus: 'Service page optimization', detail: 'Make sure each service you offer has a page that can actually rank and convert.' },
      { tier: 'Growth', focus: 'Case studies & proof content', detail: 'Turn client wins into search-optimized case studies — proof that also ranks.' },
      { tier: 'Pro', focus: 'Multi-service, multi-location scale', detail: 'Structured SEO across every service and location combination you operate in.' },
    ],
    local: [
      { tier: 'Starter', focus: 'Google Business Profile & citations', detail: 'Get your profile and local listings fully optimized and consistent everywhere.' },
      { tier: 'Growth', focus: 'Local content & reviews strategy', detail: 'Location-specific pages and a system for earning the reviews that drive local rankings.' },
      { tier: 'Pro', focus: 'Multi-location domination', detail: 'A dedicated, optimized presence for every location, plus local link building in each area.' },
    ],
  };

  function render(niche) {
    const items = data[niche];
    panel.innerHTML = items.map(item => `
      <div class="niche-panel-card">
        <h4>${item.tier} — ${item.focus}</h4>
        <p>${item.detail}</p>
      </div>
    `).join('');
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.niche-tab');
    if (!btn) return;
    tabs.querySelectorAll('.niche-tab').forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    render(btn.dataset.niche);
  });

  render('saas');
})();
