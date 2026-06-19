(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }

    current = index % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      setSlide(current + 1);
    }, 5200);
  }

  setSlide(0);

  var searchInput = document.querySelector('[data-search-input]');
  var sortInput = document.querySelector('[data-sort-input]');
  var grid = document.querySelector('[data-movie-grid]');
  var noResult = document.querySelector('[data-no-result]');

  function applyFilter() {
    if (!grid) {
      return;
    }

    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
    var shown = 0;

    cards.forEach(function (card) {
      var text = card.getAttribute('data-search') || '';
      var matched = !keyword || text.toLowerCase().indexOf(keyword) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        shown += 1;
      }
    });

    if (sortInput) {
      var mode = sortInput.value;
      var visibleCards = cards.filter(function (card) {
        return card.style.display !== 'none';
      });

      visibleCards.sort(function (a, b) {
        if (mode === 'old') {
          return Number(a.getAttribute('data-year')) - Number(b.getAttribute('data-year'));
        }

        if (mode === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
        }

        return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
      });

      visibleCards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (noResult) {
      noResult.style.display = shown ? 'none' : 'block';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (sortInput) {
    sortInput.addEventListener('change', applyFilter);
  }

  applyFilter();
})();
