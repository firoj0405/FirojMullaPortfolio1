// --- Global DOM Selectors ---
const header = document.getElementById('main-header');
const navLinks = document.getElementById('nav-links');
const menuToggle = document.querySelector('.menu-toggle');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.open-lightbox');
const currentYearSpan = document.getElementById('current-year');

// --- 1. Header Scroll Effect ---
const handleScroll = () => {
    // Add shadow/translucency class to header on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled-header');
    } else {
        header.classList.remove('scrolled-header');
    }
};

window.addEventListener('scroll', handleScroll);


// --- 2. Mobile Menu Toggle ---
const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
};

menuToggle.addEventListener('click', toggleMenu);

// Close menu when a link is clicked (for smooth scroll)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu(); // Closes the mobile menu
        }
    });
});


// --- 3. Lightbox (Modal) Implementation ---

// Function to open the lightbox
const openLightbox = (imageSrc, imageAlt) => {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
};

// Function to close the lightbox
const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
    // Clear image source to free memory
    lightboxImage.src = "";
};

// Event listeners for opening the lightbox
galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const src = item.dataset.src || item.querySelector('img').src;
        const alt = item.dataset.alt || item.querySelector('img').alt;
        openLightbox(src, alt);
    });
});

// Event listeners for closing the lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxModal.addEventListener('click', (e) => {
    // Close only if clicking directly on the dark overlay
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

// Keyboard navigation (ESC key to close)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
    }
});


// --- 4. Smooth Scrolling (Built-in HTML smooth scroll is used, this is supplemental) ---
// This ensures cross-browser compatibility for on-page navigation if the CSS property fails.
// Note: Modern browsers support `scroll-behavior: smooth` CSS, which is preferred.

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
             // Calculate the position, accounting for the fixed header height
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 10; // -10 for extra padding

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


// --- 5. Initializations ---
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    currentYearSpan.textContent = new Date().getFullYear();
});
