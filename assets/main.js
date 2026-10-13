(() => {
  'use strict';

  const pages = [...document.querySelectorAll('main > .page')];
  const navigation = [...document.querySelectorAll('.navlinks a')];
  const publications = [...document.querySelectorAll('#publication-list .pub')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const pageIds = new Set(pages.map(page => page.id));

  function currentPage() {
    const id = location.hash.slice(1);
    return pageIds.has(id) ? id : 'about';
  }

  function showPage({ focus = false } = {}) {
    const id = currentPage();
    pages.forEach(page => { page.hidden = page.id !== id; });
    navigation.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const label = navigation.find(link => link.hash === `#${id}`).textContent.trim();
    document.title = `Che Hyun Lee | ${label}`;
    if (focus) {
      const heading = document.querySelector(`#${id} h1, #${id} h2`);
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }

  function filterPublications(filter) {
    let count = 0;
    publications.forEach(publication => {
      // Keep the representative list as a subset of the single publication source.
      const visible = filter === 'all' || publication.dataset.selected === 'true';
      publication.hidden = !visible;
      if (visible) count += 1;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    document.getElementById('publication-status').textContent = `Showing ${count} publications.`;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !pageIds.has(link.hash.slice(1))) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    showPage({ focus: true });
  });
  filters.forEach(button => button.addEventListener('click', () => filterPublications(button.dataset.filter)));
  window.addEventListener('popstate', () => showPage());
  window.addEventListener('hashchange', () => showPage());
  document.documentElement.classList.add('js');
  showPage();
  filterPublications('selected');
})();
