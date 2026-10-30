(function () {
  function init() {

    /* ===== Header scroll + mobile menu ===== */
    var header = document.getElementById('header');
    if (header) {
      var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 50); };
      window.addEventListener('scroll', onScroll); onScroll();
    }
    var menuToggle = document.querySelector('.menu-toggle');
    var navbar = document.getElementById('navbar');
    if (menuToggle && navbar) {
      menuToggle.addEventListener('click', function () {
        navbar.classList.toggle('active');
        var ic = menuToggle.querySelector('i');
        if (ic) { ic.classList.toggle('fa-bars'); ic.classList.toggle('fa-times'); }
      });
      navbar.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navbar.classList.remove('active');
          var ic = menuToggle.querySelector('i');
          if (ic) { ic.classList.add('fa-bars'); ic.classList.remove('fa-times'); }
        });
      });
    }

    /* ===== Image viewer (self-contained) ===== */
    if (document.getElementById('pvBox')) return;

    var style = document.createElement('style');
    style.textContent =
      '#pvBox{display:none;position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.95)}' +
      '#pvBox.pv-open{display:block}' +
      '#pvBar{position:absolute;top:12px;right:12px;z-index:3;display:flex;align-items:center;gap:8px;background:rgba(30,30,30,.9);padding:8px 12px;border-radius:999px;color:#fff;font:14px sans-serif}' +
      '#pvBar button{background:#fff;color:#111;border:0;min-width:36px;height:36px;padding:0 12px;border-radius:999px;font-size:20px;line-height:1;cursor:pointer}' +
      '#pvBar button:hover{background:#dbe9ff}' +
      '#pvBar #pvClose{background:#ff4d4d;color:#fff}' +
      '#pvLevel{min-width:52px;text-align:center}' +
      '#pvStage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;touch-action:none}' +
      '#pvImg{max-width:96vw;max-height:90vh;width:auto;height:auto;object-fit:contain;transform-origin:center center;cursor:grab;user-select:none;-webkit-user-drag:none;touch-action:none;border-radius:0}' +
      '#pvImg.pv-drag{cursor:grabbing}' +
      'img:not(.no-zoom):not(.profile-img){cursor:zoom-in}';
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.id = 'pvBox';
    box.innerHTML =
      '<div id="pvBar">' +
        '<button id="pvOut" aria-label="Zoom out">&minus;</button>' +
        '<span id="pvLevel">100%</span>' +
        '<button id="pvIn" aria-label="Zoom in">+</button>' +
        '<button id="pvReset">Reset</button>' +
        '<button id="pvClose" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div id="pvStage"><img id="pvImg" alt=""></div>';
    document.body.appendChild(box);

    var img = document.getElementById('pvImg');
    var stage = document.getElementById('pvStage');
    var label = document.getElementById('pvLevel');
    var MIN = 1, MAX = 8, scale = 1, x = 0, y = 0;
    var pointers = new Map(), lastDist = 0, dragStart = null;

    function apply() {
      img.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
      label.textContent = Math.round(scale * 100) + '%';
    }
    function reset() { scale = 1; x = 0; y = 0; apply(); }
    function zoomAt(ns, cx, cy) {
      ns = Math.min(MAX, Math.max(MIN, ns));
      var r = stage.getBoundingClientRect();
      var px = cx - (r.left + r.width / 2), py = cy - (r.top + r.height / 2);
      var k = ns / scale;
      x = px - (px - x) * k; y = py - (py - y) * k; scale = ns;
      if (scale === 1) { x = 0; y = 0; }
      apply();
    }
    function zoomCenter(f) {
      var r = stage.getBoundingClientRect();
      zoomAt(scale * f, r.left + r.width / 2, r.top + r.height / 2);
    }
    function openViewer(url, alt) {
      reset();
      img.src = url; img.alt = alt || 'Full-size image';
      box.classList.add('pv-open');
      document.body.style.overflow = 'hidden';
    }
    function closeViewer() {
      box.classList.remove('pv-open');
      document.body.style.overflow = '';
      img.removeAttribute('src');
    }

    /* Click any image on the page (capture phase, so nothing blocks it) */
    document.addEventListener('click', function (e) {
      if (box.contains(e.target)) return;
      var t = e.target;
      var pic = t.tagName === 'IMG' ? t : null;
      if (!pic) {
        var card = t.closest('.seo-image-card, .certification-card, .project-image-preview, figure');
        if (card) pic = card.querySelector('img');
      }
      if (!pic) return;
      if (pic.closest('#header, header, nav') || pic.classList.contains('no-zoom') || pic.classList.contains('profile-img')) return;
      if (pic.naturalWidth && pic.naturalWidth < 60) return;
      var url = pic.dataset.full || pic.currentSrc || pic.src;
      if (!url) return;
      e.preventDefault();
      e.stopPropagation();
      openViewer(url, pic.alt);
    }, true);

    document.getElementById('pvIn').addEventListener('click', function () { zoomCenter(1.4); });
    document.getElementById('pvOut').addEventListener('click', function () { zoomCenter(1 / 1.4); });
    document.getElementById('pvReset').addEventListener('click', reset);
    document.getElementById('pvClose').addEventListener('click', closeViewer);
    stage.addEventListener('click', function (e) { if (e.target === stage) closeViewer(); });

    stage.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoomAt(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);
    }, { passive: false });

    img.addEventListener('dblclick', function (e) {
      if (scale > 1) reset(); else zoomAt(2.5, e.clientX, e.clientY);
    });

    img.addEventListener('pointerdown', function (e) {
      img.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragStart = { px: e.clientX, py: e.clientY, x: x, y: y };
        img.classList.add('pv-drag');
      } else if (pointers.size === 2) {
        var p = Array.from(pointers.values());
        lastDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      }
    });
    img.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        var p = Array.from(pointers.values());
        var d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        if (lastDist) zoomAt(scale * (d / lastDist), (p[0].x + p[1].x) / 2, (p[0].y + p[1].y) / 2);
        lastDist = d;
      } else if (pointers.size === 1 && dragStart && scale > 1) {
        x = dragStart.x + (e.clientX - dragStart.px);
        y = dragStart.y + (e.clientY - dragStart.py);
        apply();
      }
    });
    function endPointer(e) {
      pointers.delete(e.pointerId); lastDist = 0; dragStart = null;
      img.classList.remove('pv-drag');
    }
    img.addEventListener('pointerup', endPointer);
    img.addEventListener('pointercancel', endPointer);

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('pv-open')) return;
      if (e.key === 'Escape') closeViewer();
      else if (e.key === '+' || e.key === '=') zoomCenter(1.4);
      else if (e.key === '-') zoomCenter(1 / 1.4);
      else if (e.key === '0') reset();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
