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

/* ===== 4. Responsive ===== */
@media (max-width: 768px) {
  .container { width: 92%; }
  .projects-grid,
  .seo-grid,
  .certification-grid,
  .gallery {
    grid-template-columns: 1fr;   /* one big image per row on mobile */
  }
  section { padding: 40px 0; }
}

/* Fixes the header covering section titles when scrolling */
section[id] { scroll-margin-top: 80px; }
