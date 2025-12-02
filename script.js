
document.querySelectorAll('.pimg').forEach(img=>{
  img.addEventListener('click',()=>{
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox').style.display='flex';
  });
});
document.querySelector('.close').onclick=()=>document.getElementById('lightbox').style.display='none';
