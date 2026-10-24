/* ===== 1. Reduce left/right blank space ===== */
html, body { margin: 0; padding: 0; overflow-x: hidden; }

.container,
section > .container,
.section-container,
.wrapper {
  width: 94%;
  max-width: 1400px;      /* was probably 1000-1200px */
  margin-inline: auto;
  padding-inline: 0;      /* remove extra side padding */
}

section {
  padding: 60px 0;        /* tighter vertical rhythm */
}

/* Full-width header/footer content */
#header .container,
footer .container {
  max-width: 1400px;
  width: 94%;
}

/* ===== 2. Bigger, clearer images ===== */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Project / SEO / certification galleries: fewer columns = bigger images */
.projects-grid,
.seo-grid,
.certification-grid,
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
}

.seo-image-card img,
.certification-card img,
.project-card img {
  width: 100%;
  height: auto;
  max-height: none;
  object-fit: contain;    /* shows the full image, no cropping */
  border-radius: 10px;
  cursor: zoom-in;
}

.seo-image-card,
.certification-card,
.project-card {
  padding: 12px;
}

/* ===== 3. Lightbox: show images as large as possible ===== */
#lightboxImage {
  max-width: 95vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

// ------------------------------------------
// 4. Lightbox with zoom, pan and pinch
// ------------------------------------------
const lightbox = document.getElementById('lightbox');
const img = document.getElementById('lightboxImage');
const stage = document.getElementById('lbStage');
const levelLabel = document.getElementById('zoomLevel');
if (lightbox && img && stage) {
  const MIN = 1, MAX = 8;
  let scale = 1, x = 0, y = 0;
  const pointers = new Map();
  let lastDist = 0, dragStart = null, lastFocus = null;

  const apply = () => {
    img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    levelLabel.textContent = Math.round(scale * 100) + '%';
  };
  const reset = () => { scale = 1; x = 0; y = 0; apply(); };

  // Zoom keeping the point under (cx, cy) fixed
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
    lightbox.querySelector('.close-btn')?.focus();
  };
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    lastFocus?.focus?.();
  };

  // Open on click of any body image (add class "no-zoom" to skip one)
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.open-modal, section img:not(.no-zoom)');
    if (!t || t.closest('#lightbox')) return;
    let url = t.tagName === 'A' ? t.getAttribute('href')
            : (t.dataset.full || t.currentSrc || t.src);
    if (!url) return;
    if (t.tagName === 'A' && !/\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i.test(url)) return;
    e.preventDefault();
    open(url, t.getAttribute('aria-label') || t.alt || 'Full-size image');
  });

  // Toolbar
  document.getElementById('zoomIn').addEventListener('click', () => zoomCenter(1.4));
  document.getElementById('zoomOut').addEventListener('click', () => zoomCenter(1 / 1.4));
  document.getElementById('zoomReset').addEventListener('click', reset);
  lightbox.querySelector('.close-btn').addEventListener('click', close);

  // Click empty backdrop to close
  stage.addEventListener('click', (e) => { if (e.target === stage) close(); });

  // Mouse wheel / trackpad zoom
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);
  }, { passive: false });

  // Double-click / double-tap: toggle 1x <-> 2.5x
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
}
