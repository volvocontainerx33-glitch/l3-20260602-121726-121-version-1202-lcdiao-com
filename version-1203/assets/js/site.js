(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-nav-links]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var active = 0;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(active - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(active + 1);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll(".filter-scope"));
    scopes.forEach(function (scope) {
      var query = scope.querySelector('[data-filter="query"]');
      var year = scope.querySelector('[data-filter="year"]');
      var region = scope.querySelector('[data-filter="region"]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".filter-card"));

      function apply() {
        var q = query ? query.value.trim().toLowerCase() : "";
        var y = year ? year.value : "";
        var r = region ? region.value : "";
        cards.forEach(function (card) {
          var text = [card.dataset.title, card.dataset.region, card.dataset.year, card.dataset.genre, card.dataset.tags].join(" ").toLowerCase();
          var matched = (!q || text.indexOf(q) !== -1) && (!y || card.dataset.year === y) && (!r || card.dataset.region === r);
          card.classList.toggle("is-hidden", !matched);
        });
      }

      [query, year, region].forEach(function (control) {
        if (!control) {
          return;
        }
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      });
    });
  }

  window.setupPlayer = function (videoId, source) {
    ready(function () {
      var video = document.getElementById(videoId);
      if (!video || !source) {
        return;
      }
      var holder = video.closest(".player-card") || document;
      var button = holder.querySelector("[data-player-button]");
      var loaded = false;
      var hls = null;

      function loadSource() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function playVideo() {
        loadSource();
        if (button) {
          button.classList.add("is-hidden");
        }
        var playTask = video.play();
        if (playTask && typeof playTask.catch === "function") {
          playTask.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", playVideo);
      }
      video.addEventListener("click", function () {
        if (!loaded) {
          playVideo();
        }
      });
      video.addEventListener("play", function () {
        if (button) {
          button.classList.add("is-hidden");
        }
      });
      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
