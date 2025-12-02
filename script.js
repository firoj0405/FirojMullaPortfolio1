document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. Smooth Scrolling for Navigation
    // ------------------------------------------
    document.querySelectorAll('.nav-links a, .menu-toggle, .cta-button').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if it's an internal link
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking a link
                    const navbar = document.getElementById('navbar');
                    if (navbar.classList.contains('active')) {
                        navbar.classList.remove('active');
                        document.querySelector('.menu-toggle i').classList.remove('fa-times');
                        document.querySelector('.menu-toggle i').classList.add('fa-bars');
                        document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // ------------------------------------------
    // 2. Fixed Header/Scroll Effect
    // ------------------------------------------
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ------------------------------------------
    // 3. Mobile Menu Toggle
    // ------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.getElementById('navbar');
    const menuIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        
        navbar.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        if (navbar.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times'); // Use 'X' icon for close
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
    
    // ------------------------------------------
    // 4. Lightbox/Modal Functionality
    // ------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.close-btn');
    const modalTriggers = document.querySelectorAll('.open-modal, .seo-image-card img, .certification-card img');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            
            let imageUrl = '';
            let altText = 'Full-size project or certification image';
            
            // Determine image source:
            if (trigger.tagName === 'A' && trigger.classList.contains('open-modal')) {
                // Main project link (download project)
                imageUrl = trigger.getAttribute('href');
                altText = trigger.getAttribute('aria-label') || altText;
            } else if (trigger.tagName === 'IMG') {
                // SEO image or Certification image
                imageUrl = trigger.getAttribute('src');
                altText = trigger.getAttribute('alt') || altText;
            }

            if (imageUrl) {
                lightbox.style.display = 'block';
                lightbox.setAttribute('aria-hidden', 'false');
                lightboxImage.setAttribute('src', imageUrl);
                lightboxImage.setAttribute('alt', altText);
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Close the lightbox when the close button is clicked
    closeBtn.addEventListener('click', () => {
        closeLightbox();
    });

    // Close the lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close the lightbox when the ESC key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore background scrolling
        lightboxImage.setAttribute('src', ''); // Clear image source
    }
});
