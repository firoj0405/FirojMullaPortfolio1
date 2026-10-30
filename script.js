document.addEventListener('DOMContentLoaded', function () {

  /* ===== 1. Header scroll effect ===== */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* ===== 2. Mobile menu toggle ===== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.getElementById('navbar');
  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  /* ===== 3. Lightbox with zoom, pan and pinch ===== */
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImage');
  const stage = document.getElementById('lbStage');
  const levelLabel = document.getElementById('zoomLevel');
  if (!lightbox || !img || !stage || !levelLabel) return;

  const MIN = 1, MAX = 8;
  let scale = 1, x = 0, y = 0;
  const pointers = new Map();
  let lastDist = 0, dragStart = null, lastFocus = null;

  const apply = () => {
    img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    levelLabel.textContent = Math.round(scale * 100) + '%';
  };
  const reset = () => { scale = 1; x = 0; y = 0; apply(); };

  const zoomAt = (newScale, cx, cy) => {
    newScale = Math.min(MAX, Math.max(MIN, newScale));
    const r = stage.getBoundingClientRect();
    const px = cx - (r.left + r.width / 2);
    const py = cy - (r.top + r.height / 2);
    const k = newScale / scale;
    x = px - (px - x) * k;
    y = py - (py - y) * k;
    scale = newScale;
    if (scale === 1) { x = 0; y = 0; }
    apply();
  };
  const zoomCenter = (factor) => {
    const r = stage.getBoundingClientRect();
    zoomAt(scale * factor, r.left + r.width / 2, r.top + r.height / 2);
  };

  const open = (url, alt) => {
    lastFocus = document.activeElement;
    reset();
    img.src = url;
    img.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  // Click on any section image opens the viewer (add class "no-zoom" to skip one)
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.open-modal, section img:not(.no-zoom):not(.profile-img)');
    if (!t || t.closest('#lightbox')) return;
    const url = t.tagName === 'A'
      ? t.getAttribute('href')
      : (t.dataset.full || t.currentSrc || t.src);
    if (!url) return;
    if (t.tagName === 'A' && !/\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i.test(url)) return;
    e.preventDefault();
    open(url, t.getAttribute('aria-label') || t.alt || 'Full-size image');
  });

  // Toolbar buttons
  document.getElementById('zoomIn')?.addEventListener('click', () => zoomCenter(1.4));
  document.getElementById('zoomOut')?.addEventListener('click', () => zoomCenter(1 / 1.4));
  document.getElementById('zoomReset')?.addEventListener('click', reset);
  lightbox.querySelector('.close-btn')?.addEventListener('click', close);

  // Click empty backdrop to close
  stage.addEventListener('click', (e) => { if (e.target === stage) close(); });

  // Mouse wheel / trackpad zoom
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);
  }, { passive: false });

  // Double-click / double-tap toggles 1x <-> 2.5x
  img.addEventListener('dblclick', (e) => {
    scale > 1 ? reset() : zoomAt(2.5, e.clientX, e.clientY);
  });

  // Drag to pan + two-finger pinch
  img.addEventListener('pointerdown', (e) => {
    img.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      dragStart = { px: e.clientX, py: e.clientY, x, y };
      img.classList.add('dragging');
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      lastDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  img.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastDist) zoomAt(scale * (dist / lastDist), (a.x + b.x) / 2, (a.y + b.y) / 2);
      lastDist = dist;
    } else if (pointers.size === 1 && dragStart && scale > 1) {
      x = dragStart.x + (e.clientX - dragStart.px);
      y = dragStart.y + (e.clientY - dragStart.py);
      apply();
    }
  });
  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    lastDist = 0;
    dragStart = null;
    img.classList.remove('dragging');
  };
  img.addEventListener('pointerup', endPointer);
  img.addEventListener('pointercancel', endPointer);

  // Keyboard: Esc close, + / - zoom, 0 reset
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === '+' || e.key === '=') zoomCenter(1.4);
    else if (e.key === '-') zoomCenter(1 / 1.4);
    else if (e.key === '0') reset();
  });
});
