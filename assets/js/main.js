/**
* Template Name: Kelly
* Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Basic site config - change these to your info
   */
  const SITE_CONFIG = {
    fullName: 'Mercy Muchiri',
    linkedinUrl: 'https://www.linkedin.com/in/muchiri-mercy',
    githubUsername: 'mercymuchiri',
    // Optional: direct image URL; leave empty to use local assets/img/profile-img.jpg
    profileImageUrl: 'assets/img/IMG_9384 (3) (1).JPG',
    // Optional per-repo screenshot overrides (relative paths). Example:
    // screenshots: { 'ATS': 'assets/img/projects/ATS.jpg' }
    screenshots: {}
  };

  /**
   * Utilities for DOM updates
   */
  function setIfExists(selector, updater) {
    const el = document.querySelector(selector);
    if (el) updater(el);
  }

  function ensureGithubIconLink(container) {
    // Add a GitHub icon link next to existing social icons if not present
    const exists = container.querySelector('.github');
    if (!exists) {
      const a = document.createElement('a');
      a.href = `https://github.com/${SITE_CONFIG.githubUsername}`;
      a.className = 'github';
      a.setAttribute('aria-label', 'GitHub');
      a.innerHTML = '<i class="bi bi-github"></i>';
      container.appendChild(a);
    } else {
      exists.href = `https://github.com/${SITE_CONFIG.githubUsername}`;
    }
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Personalize header/footer names and social links
   */
  window.addEventListener('load', () => {
    // Site name
    document.querySelectorAll('.sitename').forEach(el => el.textContent = SITE_CONFIG.fullName);
    // Header social
    setIfExists('.header-social-links .linkedin', el => { el.href = SITE_CONFIG.linkedinUrl; });
    setIfExists('.header-social-links', ensureGithubIconLink);
    // Footer social
    setIfExists('footer .social-links .bi-linkedin', el => { el.parentElement.href = SITE_CONFIG.linkedinUrl; });
    setIfExists('footer .social-links', ensureGithubIconLink);
    // Hero title if present
    setIfExists('.index-page #hero h2', el => { el.textContent = SITE_CONFIG.fullName; });
  });

  /**
   * Swap profile image if external URL is configured
   */
  window.addEventListener('load', () => {
    // Default is local profile image; only swap when an external URL is provided
    if (!SITE_CONFIG.profileImageUrl) return;
    setIfExists('.about-page #about img', el => { el.src = SITE_CONFIG.profileImageUrl; });
    document.querySelectorAll('img[data-profile-img="true"]').forEach(img => { img.src = SITE_CONFIG.profileImageUrl; });
  });

  /**
   * Fetch and render GitHub repositories into portfolio grid
   */
  async function fetchGithubRepos(username) {
    const resp = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
    if (!resp.ok) return [];
    const data = await resp.json();
    return data
      .filter(r => !r.fork && r.name.toLowerCase() !== String(username).toLowerCase())
      .map(r => ({
        name: r.name,
        description: r.description || '',
        html_url: r.html_url,
        homepage: r.homepage,
        language: r.language,
        topics: r.topics || [],
        stargazers_count: r.stargazers_count
      }));
  }

  function buildRepoCard(repo) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 portfolio-item isotope-item';
    // Tag as web/app by language/topic for simple filter compatibility
    const tagClass = repo.language ? ` filter-${String(repo.language).toLowerCase()}` : '';
    col.className += tagClass;
    const siteUrl = repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage : repo.html_url;
    const localScreenshot = SITE_CONFIG.screenshots[repo.name] || `assets/img/projects/${repo.name}.jpg`;
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img class="card-img-top" src="${localScreenshot}" alt="${repo.name} screenshot" onerror="this.style.display='none'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-2">${repo.name}</h5>
          <p class="card-text small flex-grow-1">${repo.description || 'No description provided.'}</p>
          <div class="mb-2 repo-topics"></div>
          <div class="d-flex align-items-center justify-content-between mt-3">
            <div class="small text-muted">
              ${repo.language ? `<span class="me-2"><i class="bi bi-circle-fill text-primary me-1"></i>${repo.language}</span>` : ''}
              ${typeof repo.stargazers_count === 'number' ? `<span><i class="bi bi-star me-1"></i>${repo.stargazers_count}</span>` : ''}
            </div>
            <div class="d-flex gap-2">
              <a href="${siteUrl}" class="btn btn-sm btn-primary" target="_blank" rel="noopener">View</a>
              <a href="${repo.html_url}" class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener">Code</a>
            </div>
          </div>
        </div>
      </div>
    `;
    return col;
  }

  async function fetchRepoTopics(owner, repo) {
    try {
      const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/topics`, {
        headers: {
          'Accept': 'application/vnd.github+json'
        }
      });
      if (!resp.ok) return [];
      const json = await resp.json();
      return Array.isArray(json.names) ? json.names : [];
    } catch {
      return [];
    }
  }

  function renderTopicsPills(container, topics) {
    if (!container) return;
    if (!topics || topics.length === 0) {
      container.innerHTML = '';
      return;
    }
    const pills = topics.slice(0, 6).map(t => `<span class="badge text-bg-light border me-1 mb-1">${t}</span>`).join('');
    container.innerHTML = pills;
  }

  async function renderPortfolioFromGithub() {
    const container = document.querySelector('.portfolio-page .isotope-container, .index-page .isotope-container');
    if (!container) return;
    try {
      container.innerHTML = '';
      const repos = await fetchGithubRepos(SITE_CONFIG.githubUsername);
      const featured = repos.slice(0, 9);
      if (featured.length === 0) {
        container.innerHTML = '<p class="text-muted">No repositories to show yet.</p>';
        return;
      }
      const frag = document.createDocumentFragment();
      featured.forEach(repo => frag.appendChild(buildRepoCard(repo)));
      container.appendChild(frag);
      const isoLayout = container.closest('.isotope-layout');
      const isoInstance = isoLayout && isoLayout._isotopeInstance;
      if (isoInstance && typeof isoInstance.reloadItems === 'function') {
        isoInstance.reloadItems();
        const relayout = () => {
          isoInstance.arrange();
        };
        if (typeof imagesLoaded === 'function') {
          imagesLoaded(container, relayout);
        } else {
          relayout();
        }
      }
      // Fetch topics in parallel and render badges
      const cards = Array.from(container.querySelectorAll('.portfolio-item'));
      await Promise.all(featured.map(async (repo, idx) => {
        const topics = await fetchRepoTopics(SITE_CONFIG.githubUsername, repo.name);
        const card = cards[idx];
        if (card) {
          renderTopicsPills(card.querySelector('.repo-topics'), topics.length ? topics : repo.topics);
        }
      }));
      // Re-init AOS for new elements
      if (typeof AOS !== 'undefined') {
        AOS.refreshHard();
      }
    } catch (e) {
      container.innerHTML = '<p class="text-muted">Projects could not be loaded right now. Please try again later or visit <a href="https://github.com/' + SITE_CONFIG.githubUsername + '" target="_blank" rel="noopener">github.com/' + SITE_CONFIG.githubUsername + '</a>.</p>';
    }
  }

  window.addEventListener('load', renderPortfolioFromGithub);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
      isotopeItem._isotopeInstance = initIsotope;
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Rotate role titles in the about section
   */
  function initRoleRotators() {
    document.querySelectorAll('.role-rotator').forEach(rotator => {
      const rolesAttr = rotator.getAttribute('data-roles');
      if (!rolesAttr) return;

      let roles;
      try {
        roles = JSON.parse(rolesAttr);
      } catch {
        roles = rolesAttr.split(',').map(r => r.trim());
      }

      if (!Array.isArray(roles) || roles.length < 2) return;

      const textEl = rotator.querySelector('.role-text');
      if (!textEl) return;

      let index = 0;
      setInterval(() => {
        textEl.classList.add('fade-out');
        setTimeout(() => {
          index = (index + 1) % roles.length;
          textEl.textContent = roles[index];
          textEl.classList.remove('fade-out');
        }, 400);
      }, 3000);
    });
  }
  window.addEventListener('load', initRoleRotators);

})();