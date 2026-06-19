(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    var input = document.querySelector('[data-search-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var regionSelect = document.querySelector('[data-region-filter]');
    var items = Array.prototype.slice.call(document.querySelectorAll('.searchable-item'));
    if (!items.length) {
      return;
    }
    var query = normalize(input && input.value);
    var year = yearSelect ? yearSelect.value : '';
    var region = regionSelect ? regionSelect.value : '';
    var visible = 0;

    items.forEach(function (item) {
      var haystack = normalize([
        item.getAttribute('data-title'),
        item.getAttribute('data-tags'),
        item.getAttribute('data-genre'),
        item.getAttribute('data-region'),
        item.getAttribute('data-year')
      ].join(' '));
      var matchedQuery = !query || haystack.indexOf(query) !== -1;
      var matchedYear = !year || item.getAttribute('data-year') === year;
      var matchedRegion = !region || item.getAttribute('data-region') === region;
      var matched = matchedQuery && matchedYear && matchedRegion;
      item.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    var empty = document.querySelector('[data-empty-filter]');
    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  var searchInput = document.querySelector('[data-search-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var regionFilter = document.querySelector('[data-region-filter]');

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
    }
    searchInput.addEventListener('input', applyFilters);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilters);
  }

  if (regionFilter) {
    regionFilter.addEventListener('change', applyFilters);
  }

  applyFilters();
})();
