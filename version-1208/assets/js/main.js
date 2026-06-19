
(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 420) {
        backTop.classList.add('is-visible');
      } else {
        backTop.classList.remove('is-visible');
      }
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 0) {
    var active = 0;
    var showSlide = function (index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    showSlide(0);
    setInterval(function () {
      showSlide(active + 1);
    }, 5000);
  }

  var input = document.querySelector('[data-search-input]');
  var clear = document.querySelector('[data-clear-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var empty = document.querySelector('[data-empty-search]');
  var applySearch = function () {
    if (!input || cards.length === 0) {
      return;
    }
    var term = input.value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
      var match = !term || text.indexOf(term) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) {
        visible += 1;
      }
    });
    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  };
  if (input) {
    input.addEventListener('input', applySearch);
  }
  if (clear && input) {
    clear.addEventListener('click', function () {
      input.value = '';
      applySearch();
      input.focus();
    });
  }
})();

function initMoviePlayer(source) {
  var shell = document.querySelector('[data-player-shell]');
  var video = document.querySelector('[data-player-video]');
  var play = document.querySelector('[data-player-play]');
  var mute = document.querySelector('[data-player-mute]');
  var full = document.querySelector('[data-player-full]');
  if (!shell || !video || !source) {
    return;
  }

  var hls = null;
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  } else if (window.Hls && window.Hls.isSupported()) {
    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(source);
    hls.attachMedia(video);
  } else {
    video.src = source;
  }

  var sync = function () {
    if (video.paused) {
      shell.classList.remove('is-playing');
      if (play) {
        play.textContent = '▶';
      }
    } else {
      shell.classList.add('is-playing');
      if (play) {
        play.textContent = 'Ⅱ';
      }
    }
    if (mute) {
      mute.textContent = video.muted ? '🔇' : '🔊';
    }
  };

  var togglePlay = function () {
    if (video.paused) {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    } else {
      video.pause();
    }
  };

  if (play) {
    play.addEventListener('click', togglePlay);
  }
  video.addEventListener('click', togglePlay);
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  if (mute) {
    mute.addEventListener('click', function () {
      video.muted = !video.muted;
      sync();
    });
  }
  if (full) {
    full.addEventListener('click', function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    });
  }
  sync();
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
