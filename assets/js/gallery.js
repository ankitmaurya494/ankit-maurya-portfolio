// Gallery and Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.lightbox-controls .prev');
    const nextBtn = document.querySelector('.lightbox-controls .next');
    const viewButtons = document.querySelectorAll('.view-btn');

    let currentImageIndex = 0;
    let visibleImages = [];

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Update visible images array
            updateVisibleImages();
        });
    });

    // Add smooth fade transition
    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease';
    });

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const img = visibleImages[index].querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // View buttons
    viewButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Find the index of this button in visible images
            const parentItem = this.closest('.gallery-item');
            const visibleIndex = visibleImages.indexOf(parentItem);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });

    // Close button
    closeBtn.addEventListener('click', closeLightbox);

    // Previous button
    prevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        const img = visibleImages[currentImageIndex].querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
    });

    // Next button
    nextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        const img = visibleImages[currentImageIndex].querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Update visible images array
    function updateVisibleImages() {
        visibleImages = Array.from(galleryItems).filter(item => {
            return item.style.display !== 'none';
        });
    }

    // Initial setup
    updateVisibleImages();
});
