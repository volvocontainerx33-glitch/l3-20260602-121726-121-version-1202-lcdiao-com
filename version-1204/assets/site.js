(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) return;
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    show(0);
    start();
  }

  function normalize(text) {
    return String(text || "").toLowerCase().trim();
  }

  function initFilters() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    blocks.forEach(function (scope) {
      var search = scope.querySelector("[data-search]");
      var year = scope.querySelector("[data-filter-year]");
      var type = scope.querySelector("[data-filter-type]");
      var region = scope.querySelector("[data-filter-region]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var empty = scope.querySelector("[data-empty]");
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-year-chip]"));

      function apply() {
        var q = normalize(search && search.value);
        var y = year && year.value ? year.value : "";
        var t = type && type.value ? type.value : "";
        var r = region && region.value ? region.value : "";
        var shown = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.genre,
            card.dataset.region,
            card.dataset.type
          ].join(" "));
          var ok = true;
          if (q && text.indexOf(q) === -1) ok = false;
          if (y && card.dataset.year !== y) ok = false;
          if (t && card.dataset.type !== t) ok = false;
          if (r && card.dataset.region !== r) ok = false;
          card.style.display = ok ? "" : "none";
          if (ok) shown += 1;
        });

        chips.forEach(function (chip) {
          chip.classList.toggle("active", y && chip.dataset.yearChip === y);
        });

        if (empty) empty.classList.toggle("show", shown === 0);
      }

      [search, year, type, region].forEach(function (control) {
        if (!control) return;
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      });

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          if (!year) return;
          year.value = year.value === chip.dataset.yearChip ? "" : chip.dataset.yearChip;
          apply();
        });
      });

      var params = new URLSearchParams(window.location.search);
      if (params.get("year") && year) year.value = params.get("year");
      apply();
    });
  }

  function attachHls(video, src, onReady, onError) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      if (onReady) onReady();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        if (onReady) onReady();
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
            if (onError) onError();
          }
        }
      });
      video._hls = hls;
      return;
    }

    if (onError) onError();
  }

  window.SitePlayer = {
    init: function (options) {
      var root = document.querySelector(options.selector);
      if (!root) return;
      var video = root.querySelector("video");
      var cover = root.querySelector(".play-cover");
      var error = root.querySelector("[data-player-error]");
      var loaded = false;
      if (!video || !options.src) return;

      function fail() {
        if (error) error.classList.add("show");
      }

      function playVideo() {
        var run = function () {
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {});
          }
        };
        if (video.readyState >= 1) {
          run();
        } else {
          video.addEventListener("loadedmetadata", run, { once: true });
        }
      }

      function start() {
        if (cover) cover.classList.add("hidden");
        video.setAttribute("controls", "controls");
        if (!loaded) {
          loaded = true;
          attachHls(video, options.src, playVideo, fail);
        } else {
          playVideo();
        }
      }

      if (cover) {
        cover.addEventListener("click", start);
      }

      video.addEventListener("click", function () {
        if (!loaded || video.paused) {
          start();
        } else {
          video.pause();
        }
      });
    }
  };

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
