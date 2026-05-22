// Game Loader Functionality
function initializeGameLoader() {
    const canvas = document.getElementById('gameCanvas');
    const gameLoader = document.getElementById('gameLoader');
    
    if (!canvas || !gameLoader) return;

    const ctx = canvas.getContext('2d');
    const pixels = [];
    const particleCount = 40;
    let score = 0;
    let gameTime = 0;
    let animationFrameId;

    class Pixel {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.color = `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50 + 50}%)`;
            this.life = 1;
            this.decay = Math.random() * 0.01 + 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
        }

        isAlive() {
            return this.life > 0;
        }
    }

    function initializePixels() {
        pixels.length = 0;
        for (let i = 0; i < particleCount; i++) {
            pixels.push(new Pixel());
        }
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 20;

        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    function drawConnections() {
        for (let i = 0; i < pixels.length; i++) {
            for (let j = i + 1; j < pixels.length; j++) {
                const dx = pixels[i].x - pixels[j].x;
                const dy = pixels[i].y - pixels[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pixels[i].x, pixels[i].y);
                    ctx.lineTo(pixels[j].x, pixels[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGrid();

        for (let i = pixels.length - 1; i >= 0; i--) {
            if (pixels[i].isAlive()) {
                pixels[i].update();
                pixels[i].draw();
            } else {
                pixels.splice(i, 1);
            }
        }

        drawConnections();

        // Continuously spawn new pixels
        if (pixels.length < particleCount) {
            pixels.push(new Pixel());
        }

        gameTime++;
        animationFrameId = requestAnimationFrame(animate);
    }

    initializePixels();
    animate();

    // Hide loader after content loads
    function hideLoader() {
        gameLoader.classList.add('hidden');
        cancelAnimationFrame(animationFrameId);
    }

    // Hide loader when images are loaded or after timeout
    window.hideGameLoader = hideLoader;
    
    // Auto-hide after 5 seconds if not already hidden
    setTimeout(() => {
        if (!gameLoader.classList.contains('hidden')) {
            hideLoader();
        }
    }, 5000);
}

// Gallery and Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game loader
    initializeGameLoader();

    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.lightbox-controls .prev');
    const nextBtn = document.querySelector('.lightbox-controls .next');
    const adminToolbar = document.getElementById('adminToolbar');
    const adminToggleButton = document.getElementById('adminToggleButton');
    const adminGalleryPanel = document.getElementById('adminGalleryPanel');
    const adminUploadForm = document.getElementById('adminUploadForm');
    const adminGalleryMessage = document.getElementById('adminGalleryMessage');
    const staticGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    const STORAGE_KEY = 'galleryImages';
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    let galleryItems = [];
    let visibleImages = [];
    let currentImageIndex = 0;

    function getStoredImages() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    function setStoredImages(images) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"]+/g, function(match) {
            const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
            return entities[match] || match;
        });
    }

    function seedGalleryData() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            const items = staticGalleryItems.map((item, index) => {
                const img = item.querySelector('img');
                return {
                    id: Date.now() + index,
                    title: img.alt || `Photo ${index + 1}`,
                    category: item.dataset.category || 'all',
                    src: img.src,
                    alt: img.alt || `Photo ${index + 1}`
                };
            });
            setStoredImages(items);
        }
    }

    function renderGallery() {
        const images = getStoredImages();
        galleryGrid.innerHTML = '';

        images.forEach(image => {
            const item = document.createElement('div');
            item.className = `gallery-item ${image.category}-item`;
            item.dataset.category = image.category;
            item.dataset.id = image.id;
            item.innerHTML = `
                <img src="${image.src}" alt="${escapeHtml(image.alt)}">
                <div class="gallery-overlay">
                    <button class="view-btn">View</button>
                    ${isAdminLoggedIn ? `<button class="delete-btn admin-delete-btn" data-id="${image.id}" type="button">Delete</button>` : ''}
                </div>
            `;

            galleryGrid.appendChild(item);
        });

        galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        applyCurrentFilter();
        updateVisibleImages();
        attachViewListeners();
        attachDeleteListeners();

        // Hide game loader after gallery renders
        if (window.hideGameLoader) {
            window.hideGameLoader();
        }
    }

    function attachViewListeners() {
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                const parentItem = this.closest('.gallery-item');
                const visibleIndex = visibleImages.indexOf(parentItem);
                if (visibleIndex !== -1) {
                    openLightbox(visibleIndex);
                }
            });
        });
    }

    function attachDeleteListeners() {
        if (!isAdminLoggedIn) {
            return;
        }

        const deleteButtons = document.querySelectorAll('.admin-delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const id = parseInt(this.dataset.id, 10);
                deleteGalleryItem(id);
            });
        });
    }

    function applyCurrentFilter() {
        const activeButton = document.querySelector('.filter-btn.active');
        const filter = activeButton ? activeButton.dataset.filter : 'all';
        galleryItems.forEach(item => {
            const shouldShow = filter === 'all' || item.dataset.category === filter;
            item.style.display = shouldShow ? 'block' : 'none';
            item.style.opacity = shouldShow ? '1' : '0';
        });
        updateVisibleImages();
    }

    function updateVisibleImages() {
        visibleImages = galleryItems.filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        if (!visibleImages.length) {
            return;
        }
        currentImageIndex = index;
        const img = visibleImages[index].querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function deleteGalleryItem(id) {
        if (!confirm('Are you sure you want to delete this photo from the gallery?')) {
            return;
        }

        const images = getStoredImages().filter(image => image.id !== id);
        setStoredImages(images);
        showAdminGalleryMessage('Photo deleted successfully.', 'success');
        renderGallery();
    }

    function showAdminGalleryMessage(message, type = 'success') {
        if (!adminGalleryMessage) {
            return;
        }
        adminGalleryMessage.textContent = message;
        adminGalleryMessage.style.color = type === 'success' ? '#1a7a1f' : '#d32f2f';
        adminGalleryMessage.style.display = 'block';
        setTimeout(() => {
            adminGalleryMessage.textContent = '';
            adminGalleryMessage.style.display = 'none';
        }, 4000);
    }

    function setupFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                applyCurrentFilter();
            });
        });
    }

    function setupAdminPanel() {
        if (!adminToolbar || !adminToggleButton || !adminGalleryPanel || !adminUploadForm) {
            return;
        }

        adminToolbar.style.display = isAdminLoggedIn ? 'block' : 'none';

        adminToggleButton.addEventListener('click', function() {
            adminGalleryPanel.style.display = adminGalleryPanel.style.display === 'block' ? 'none' : 'block';
        });

        adminUploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const title = document.getElementById('adminPhotoTitle').value.trim();
            const category = document.getElementById('adminPhotoCategory').value;
            const file = document.getElementById('adminPhotoFile').files[0];

            if (!title || !category || !file) {
                showAdminGalleryMessage('Please provide title, category, and a photo file.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const images = getStoredImages();
                images.push({
                    id: Date.now(),
                    title: title,
                    category: category,
                    src: event.target.result,
                    alt: title
                });
                setStoredImages(images);
                showAdminGalleryMessage('Photo uploaded successfully.', 'success');
                adminUploadForm.reset();
                renderGallery();
            };
            reader.readAsDataURL(file);
        });
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (!visibleImages.length) {
            return;
        }
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        const img = visibleImages[currentImageIndex].querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
    });

    nextBtn.addEventListener('click', function() {
        if (!visibleImages.length) {
            return;
        }
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        const img = visibleImages[currentImageIndex].querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
    });

    document.addEventListener('keydown', function(event) {
        if (!lightbox.classList.contains('active')) {
            return;
        }
        if (event.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (event.key === 'ArrowRight') {
            nextBtn.click();
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    });

    seedGalleryData();
    renderGallery();
    setupFilters();
    setupAdminPanel();
});
