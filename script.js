// script.js - minimal, accessible lightbox + smooth scroll
// Comment: keep JS lightweight and dependency-free.

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for nav links (native behavior fallback)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      if (href.startsWith('#')) {
        e.preventDefault();
        var el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
        history.replaceState(null, '', href);
      }
    });
  });

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const nextBtn = document.querySelector('.lightbox-next');
  const prevBtn = document.querySelector('.lightbox-prev');

  // Collect gallery images and workflow button
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item img, .cert-item img, .award-item img, .project-media img'));
  // Add workflow button target
  const workflowBtn = document.getElementById('view-workflow');

  let currentIndex = -1;
  function openLightbox(src, alt, idx) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = alt || '';
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.style.display = 'flex';
    currentIndex = (typeof idx === 'number') ? idx : -1;
    // trap focus minimally
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    currentIndex = -1;
  }

  // Click on gallery images
  galleryItems.forEach((img, i) => {
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', () => openLightbox(img.src, img.alt, i));
    img.addEventListener('keyup', (e) => { if (e.key === 'Enter') openLightbox(img.src, img.alt, i); });
  });

  // Workflow button opens specific image
  if (workflowBtn) {
    workflowBtn.addEventListener('click', () => {
      const src = workflowBtn.getAttribute('data-src') || 'assets/project_workflow.png';
      openLightbox(src, 'Project workflow — Internal Audit Management System');
    });
  }

  // Navigation in lightbox
  function showIndex(i) {
    if (i < 0) i = galleryItems.length - 1;
    if (i >= galleryItems.length) i = 0;
    const img = galleryItems[i];
    openLightbox(img.src, img.alt, i);
  }
  nextBtn.addEventListener('click', () => { if (currentIndex >= 0) showIndex(currentIndex + 1); });
  prevBtn.addEventListener('click', () => { if (currentIndex >= 0) showIndex(currentIndex - 1); });
  closeBtn.addEventListener('click', closeLightbox);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'ArrowLeft') prevBtn.click();
    }
  });

  // Update year in footer
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Small accessibility: focus visible outlines (already in CSS)
});
