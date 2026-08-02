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

  function openItem(item) {
    items.forEach(function (i) { i.classList.remove('is-active'); });
    item.classList.add('is-active');

    var type = item.dataset.type;
    var src = item.dataset.full || item.querySelector('img').src;

    mediaWrap.innerHTML = '';
    if (type === 'video') {
      var video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = false;
      video.poster = item.querySelector('img').src;
      mediaWrap.appendChild(video);
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
    panel.classList.remove('is-open');
    items.forEach(function (i) { i.classList.remove('is-active'); });
  });
});