(async function () {
  const slots = [...document.querySelectorAll('[data-section]')];

  // Load all section partials in parallel, keep page order.
  await Promise.all(slots.map(async (slot) => {
    const file = slot.dataset.section;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error('Could not load ' + file);
      slot.innerHTML = await res.text();
    } catch (err) {
      slot.innerHTML = '<p>Unable to load <strong>' + file + '</strong>.</p>';
      console.error(err);
    }
  }));

  // Jump to a deep link (e.g. #projects) now that content exists.
  if (location.hash) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
  }

  // Highlight the current section in the sidebar nav.
  const links = [...document.querySelectorAll('nav a')];
  if (!('IntersectionObserver' in window) || !links.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('main section').forEach((s) => io.observe(s));
})();
