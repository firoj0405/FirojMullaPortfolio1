// script.js - interactions for portfolio
document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Image modal viewer (for gallery and workflow)
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImage');
  const caption = document.getElementById('caption');
  const closeBtn = document.getElementById('closeModal');

  function openModal(src, alt){
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden','false');
    modalImg.src = src;
    caption.textContent = alt || '';
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
    modalImg.src = '';
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });

  // hook: workflow button
  document.querySelectorAll('.view-workflow').forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const img = this.getAttribute('data-img');
      openModal(img, 'Project Workflow: IAMS');
    });
  });

  // gallery images
  document.querySelectorAll('.gallery-img, .cert-img, .award-img, .workflow-preview').forEach(img=>{
    img.addEventListener('click', function(){
      openModal(this.src, this.alt || 'Image');
    });
  });

  // Accessibility: close modal with ESC
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });

  // Lazy-loading hint (modern browsers do automatically)
  if('loading' in HTMLImageElement.prototype){
    document.querySelectorAll('img[loading]').forEach(img=>{
      // nothing special; attribute already present
    });
  }
});
