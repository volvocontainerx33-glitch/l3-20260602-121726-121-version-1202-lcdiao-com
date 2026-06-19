(function () {
  var root = document.querySelector('[data-player]');

  if (!root) {
    return;
  }

  var video = root.querySelector('video');
  var cover = root.querySelector('[data-cover]');
  var button = root.querySelector('[data-play]');
  var stream = root.getAttribute('data-stream');
  var hlsInstance = null;
  var loaded = false;

  function loadStream() {
    if (!video || !stream || loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = stream;
  }

  function start() {
    loadStream();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    if (video) {
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  }
})();
