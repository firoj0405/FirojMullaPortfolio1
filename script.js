document.addEventListener('DOMContentLoaded', function() {
    // 1. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the anchor is part of the header navigation
            if (this.closest('nav') || this.classList.contains('view-project-workflow')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calculate target position, accounting for the fixed header height
                    const headerHeight = document.getElementById('main-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20; // -20 for extra margin

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 2. Image Modal (Lightbox) Functionality
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close-btn')[0];

    // Function to open the modal
    function openModal(src) {
        modal.style.display = "block";
        modalImage.src = src;
    }

    // Attach click listener to all gallery images
    document.querySelectorAll('.gallery-image, .view-project-workflow').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            let imgSrc = '';
            
            if (this.classList.contains('gallery-image')) {
                // For gallery images (SEO, Certs, Awards)
                imgSrc = this.src;
            } else if (this.classList.contains('view-project-workflow')) {
                // For 'View Project Workflow' link
                imgSrc = this.href;
            }

            if (imgSrc) {
                openModal(imgSrc);
            }
        });
    });

    // Function to close the modal
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking anywhere outside of the image
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
