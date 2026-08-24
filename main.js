// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('is-open'); });
    });
  }

  // Highlight the nav link for whichever section is currently in view
  var sections = document.querySelectorAll('main section[id], section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  function setActiveLink(id) {
    navAnchors.forEach(function (a) {
      var linkId = a.getAttribute('href').split('#')[1];
      var isMatch = id ? linkId === id : (!linkId && a.getAttribute('href').indexOf('activities') === -1);
      a.classList.toggle('active', !!isMatch);
    });
  }

  if (sections.length && navAnchors.length) {
    var observer = new IntersectionObserver(function (entries) {
      // Pick the section most visible near the top of the viewport
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (visible.length) {
        visible.sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        setActiveLink(visible[0].target.id);
      }
    }, {
      root: null,
      rootMargin: '-45% 0px -50% 0px', // active once a section crosses the middle of the screen
      threshold: 0
    });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // Activities gallery: click a tile -> show enlarged media + description beside it
  var gallery = document.querySelector('.gallery-grid');
  if (!gallery) return;

  var panel = document.querySelector('.detail-panel');
  var mediaWrap = panel.querySelector('.detail-media');
  var tagEl = panel.querySelector('.detail-text .tag');
  var titleEl = panel.querySelector('.detail-text h3');
  var descEl = panel.querySelector('.detail-text p');
  var closeBtn = panel.querySelector('.detail-close');
  var items = gallery.querySelectorAll('.gallery-item');

  // Auto-play video previews directly inside their gallery tiles
  items.forEach(function (item) {
    if (item.dataset.type === 'video' && item.dataset.full) {
      var thumbImg = item.querySelector('img');
      var video = document.createElement('video');
      video.src = item.dataset.full;
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('muted', '');       // some mobile browsers need the attribute, not just the property
      video.setAttribute('playsinline', '');
      if (thumbImg) {
        video.poster = thumbImg.src;
        thumbImg.replaceWith(video);
      } else {
        item.insertBefore(video, item.firstChild);
      }
    }
  });

  function stopActiveVideo() {
    var activeVideo = mediaWrap.querySelector('video');
    if (activeVideo) {
      activeVideo.pause();
      activeVideo.currentTime = 0;
    }
  }

  function openItem(item) {
    stopActiveVideo();

    items.forEach(function (i) { i.classList.remove('is-active'); });
    item.classList.add('is-active');

    var type = item.dataset.type;
    var tileImg = item.querySelector('img'); // may be null for video tiles now that previews use <video>
    var tileVideo = item.querySelector('video');
    var src = item.dataset.full || (tileImg ? tileImg.src : '');

    mediaWrap.innerHTML = '';
    if (type === 'video') {
      var video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.muted = true;       // required by browsers for autoplay
      video.playsInline = true; // avoids fullscreen takeover on mobile
      if (tileVideo && tileVideo.poster) video.poster = tileVideo.poster;
      mediaWrap.appendChild(video);
      video.play().catch(function () { /* autoplay blocked — user can hit play */ });
    } else {
      var img = document.createElement('img');
      img.src = src;
      img.alt = item.dataset.title || '';
      mediaWrap.appendChild(img);
    }

    tagEl.textContent = type === 'video' ? 'Video' : 'Photo';
    titleEl.textContent = item.dataset.title || '';
    descEl.textContent = item.dataset.desc || '';

    panel.classList.add('is-open');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () { openItem(item); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(item); }
    });
  });

  closeBtn.addEventListener('click', function () {
    stopActiveVideo();
    panel.classList.remove('is-open');
    items.forEach(function (i) { i.classList.remove('is-active'); });
  });
});