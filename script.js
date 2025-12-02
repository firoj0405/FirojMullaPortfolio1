// script.js - minimal JS for smooth scroll and lightbox functionality
// Short comments: smooth scroll, accessible modal (Esc to close), arrow navigation.

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length>1) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({behavior:'smooth', block:'start'});
          // move focus for accessibility
          target.setAttribute('tabindex','-1');
          target.focus({preventScroll:true});
        }
      }
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  // collect all lightboxable items in order
  const items = Array.from(document.querySelectorAll('[data-lightbox]'));
  let currentIndex = -1;

  function openLightbox(index){
    const el = items[index];
    if(!el) return;
    const src = el.getAttribute('data-lightbox');
    lightboxContent.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = el.querySelector('img') ? el.querySelector('img').alt : 'Image';
    lightboxContent.appendChild(img);
    lightbox.setAttribute('aria-hidden','false');
    lightboxContent.focus();
    currentIndex = index;
  }
  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lightboxContent.innerHTML = '';
    currentIndex = -1;
  }
  function showPrev(){ if(currentIndex>0) openLightbox(currentIndex-1); }
  function showNext(){ if(currentIndex < items.length -1) openLightbox(currentIndex+1); }

  // bind openers
  items.forEach((it, idx) => {
    it.addEventListener('click', function(e){
      e.preventDefault();
      openLightbox(idx);
    });
    it.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // keyboard nav
  document.addEventListener('keydown', function(e){
    if(lightbox.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowLeft') showPrev();
      if(e.key === 'ArrowRight') showNext();
    }
  });

  // close by clicking background
  lightbox.addEventListener('click', function(e){
    if(e.target === lightbox) closeLightbox();
  });

  // set current year in footer
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
});
