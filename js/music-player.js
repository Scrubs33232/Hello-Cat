(function () {
  var player = document.getElementById('musicPlayer');
  var toggle = document.getElementById('musicPlayerToggle');
  var audio = document.getElementById('musicPlayerAudio');
  var playBtn = document.getElementById('musicPlayerPlay');
  var progressFill = document.getElementById('musicPlayerProgressFill');
  var progressBar = progressFill ? progressFill.parentElement : null;
  if (!player || !toggle || !audio || !playBtn) return;

  var COLLAPSED_KEY = 'hc-music-player-collapsed';

  function setCollapsed(collapsed) {
    player.classList.toggle('is-collapsed', collapsed);
    try {
      localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0');
    } catch (e) {}
  }

  var stored;
  try {
    stored = localStorage.getItem(COLLAPSED_KEY);
  } catch (e) {
    stored = null;
  }
  setCollapsed(stored === '1');

  toggle.addEventListener('click', function () {
    setCollapsed(!player.classList.contains('is-collapsed'));
  });

  function updatePlayIcon() {
    var playing = !audio.paused && !audio.ended;
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    player.classList.toggle('is-playing', playing);
  }

  playBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', updatePlayIcon);
  audio.addEventListener('pause', updatePlayIcon);

  audio.addEventListener('timeupdate', function () {
    if (!audio.duration || !progressFill) return;
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
  });

  if (progressBar) {
    progressBar.addEventListener('click', function (e) {
      if (!audio.duration) return;
      var rect = progressBar.getBoundingClientRect();
      var ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * audio.duration;
    });
  }

  updatePlayIcon();

  function startPlayback() {
    audio.play().catch(function () {});
  }

  var gate = document.getElementById('gate');
  if (gate) {
    gate.addEventListener('click', startPlayback, { once: true });
  } else {
    startPlayback();
  }
})();
