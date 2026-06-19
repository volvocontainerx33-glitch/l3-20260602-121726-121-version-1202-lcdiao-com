(function () {
    var menuButton = document.querySelector('.nav-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    var searchInput = document.querySelector('.movie-search');
    var clearButton = document.querySelector('.search-clear');
    var searchableItems = Array.prototype.slice.call(document.querySelectorAll('.searchable-list .movie-card, .searchable-list .rank-item'));

    function filterItems() {
        if (!searchInput) {
            return;
        }
        var value = searchInput.value.trim().toLowerCase();
        searchableItems.forEach(function (item) {
            var haystack = [
                item.getAttribute('data-title'),
                item.getAttribute('data-year'),
                item.getAttribute('data-genre'),
                item.getAttribute('data-region'),
                item.textContent
            ].join(' ').toLowerCase();
            item.classList.toggle('is-hidden-by-search', value && haystack.indexOf(value) === -1);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }

    if (clearButton && searchInput) {
        clearButton.addEventListener('click', function () {
            searchInput.value = '';
            filterItems();
            searchInput.focus();
        });
    }

    var player = document.querySelector('[data-player]');
    if (player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('.player-cover');
        var button = player.querySelector('.play-button');
        var stream = video ? video.getAttribute('data-stream') : '';
        var loaded = false;
        var hlsInstance = null;

        function loadStream() {
            if (!video || loaded || !stream) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
            loaded = true;
        }

        function startPlayback() {
            loadStream();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            if (video) {
                video.controls = true;
                var playResult = video.play();
                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch(function () {
                        video.controls = true;
                    });
                }
            }
        }

        if (button) {
            button.addEventListener('click', startPlayback);
        }
        if (cover) {
            cover.addEventListener('click', startPlayback);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (!loaded) {
                    startPlayback();
                }
            });
        }
    }
})();
