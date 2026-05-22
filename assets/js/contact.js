// Contact and Review Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const reviewForm = document.getElementById('reviewForm');
    const reviewList = document.getElementById('reviewList');
    const reviewFormBanner = document.getElementById('reviewFormBanner');
    const contactMessage = document.getElementById('contactMessage');
    const reviewMessage = document.getElementById('reviewMessage');

    const currentUser = getCurrentUser();

    initializePage();

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('photographyCurrentUser') || 'null');
    }

    function initializePage() {
        renderReviews();
        updateFormVisibility();

        if (contactForm) {
            setupContactForm();
        }

        if (reviewForm) {
            setupReviewForm();
        }
    }

    function updateFormVisibility() {
        const contactSubmit = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
        const reviewSubmit = reviewForm ? reviewForm.querySelector('button[type="submit"]') : null;

        if (!currentUser) {
            if (reviewFormBanner) {
                reviewFormBanner.classList.remove('hidden');
                reviewFormBanner.innerHTML = `You must <a href="login.html">log in</a> or register before submitting a review.`;
            }
            if (contactForm) {
                contactForm.classList.add('blocked-form');
            }
            if (reviewForm) {
                reviewForm.classList.add('blocked-form');
            }
            if (contactSubmit) {
                contactSubmit.disabled = true;
            }
            if (reviewSubmit) {
                reviewSubmit.disabled = true;
            }
            return;
        }

        if (reviewFormBanner) {
            reviewFormBanner.classList.add('hidden');
            reviewFormBanner.innerHTML = '';
        }

        if (contactForm) {
            contactForm.classList.remove('blocked-form');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            if (nameInput) {
                nameInput.value = currentUser.name || '';
            }
            if (emailInput) {
                emailInput.value = currentUser.email;
                emailInput.readOnly = true;
            }
        }

        if (reviewForm) {
            reviewForm.classList.remove('blocked-form');
            const reviewName = document.getElementById('reviewName');
            if (reviewName) {
                reviewName.value = currentUser.name || '';
            }
        }

        if (reviewFormBanner) {
            reviewFormBanner.classList.add('hidden');
            reviewFormBanner.innerHTML = '';
        }
        if (contactSubmit) {
            contactSubmit.disabled = false;
        }
        if (reviewSubmit) {
            reviewSubmit.disabled = false;
        }
    }

    function setupContactForm() {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors(contactForm);

            if (!currentUser) {
                showFormMessage(contactMessage, 'Please log in or register first to send a message.', 'error');
                return;
            }

            if (!validateForm(contactForm, 'contact')) {
                showFormMessage(contactMessage, 'Please fix the errors above.', 'error');
                return;
            }

            const messageData = {
                id: Date.now(),
                name: document.getElementById('name').value.trim(),
                email: currentUser.email,
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim(),
                userEmail: currentUser.email,
                timestamp: new Date().toISOString()
            };

            saveContactMessage(messageData);
            showFormMessage(contactMessage, 'Your message has been saved locally and is visible to admin in the dashboard.', 'success');
            contactForm.reset();
            updateFormVisibility();
        });
    }

    function setupReviewForm() {
        reviewForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors(reviewForm);

            if (!currentUser) {
                showFormMessage(reviewMessage, 'Please log in or register first to leave a review.', 'error');
                return;
            }

            if (!validateForm(reviewForm, 'review')) {
                showFormMessage(reviewMessage, 'Please fix the errors above.', 'error');
                return;
            }

            const reviewData = {
                id: Date.now(),
                name: document.getElementById('reviewName').value.trim(),
                rating: document.getElementById('rating').value,
                message: document.getElementById('reviewMessageField').value.trim(),
                timestamp: new Date().toISOString()
            };

            saveReview(reviewData);
            showFormMessage(reviewMessage, 'Thank you! Your review is now visible on the website.', 'success');
            reviewForm.reset();
            updateFormVisibility();
            renderReviews();
        });
    }

    function saveContactMessage(message) {
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.unshift(message);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }

    function saveReview(review) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.unshift(review);
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    function renderReviews() {
        if (!reviewList) {
            return;
        }

        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviewList.innerHTML = '';

        if (reviews.length === 0) {
            reviewList.innerHTML = '<p>No reviews yet. Be the first to leave feedback!</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-card-header">
                    <h4>${escapeHtml(review.name)}</h4>
                    <span class="review-rating">${renderStars(review.rating)}</span>
                </div>
                <p>${escapeHtml(review.message)}</p>
                <div class="review-meta">Posted on ${new Date(review.timestamp).toLocaleDateString()}</div>
            `;
            reviewList.appendChild(reviewCard);
        });
    }

    function renderStars(rating) {
        const maxRating = 5;
        let stars = '';
        for (let i = 1; i <= maxRating; i += 1) {
            stars += i <= rating ? '★' : '☆';
        }
        return stars;
    }

    function validateForm(form, type) {
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (!validateField(field, type)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function clearErrors(form) {
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const id = field.id;

        if (id === 'name' || id === 'reviewName') {
            if (!value) {
                showError(field, 'Name is required');
                return false;
            }
        }

        if (id === 'email') {
            if (!value) {
                showError(field, 'Email is required');
                return false;
            } else if (!isValidEmail(value)) {
                showError(field, 'Please enter a valid email');
                return false;
            }
        }

        if (id === 'subject') {
            if (!value) {
                showError(field, 'Please select a subject');
                return false;
            }
        }

        if (id === 'message') {
            if (!value) {
                showError(field, 'Message is required');
                return false;
            } else if (value.length < 10) {
                showError(field, 'Message must be at least 10 characters');
                return false;
            }
        }

        if (id === 'rating') {
            if (!value) {
                showError(field, 'Please select a rating');
                return false;
            }
        }

        if (id === 'reviewMessageField') {
            if (!value) {
                showError(field, 'Review is required');
                return false;
            } else if (value.length < 10) {
                showError(field, 'Review must be at least 10 characters');
                return false;
            }
        }

        field.parentElement.classList.remove('error');
        return true;
    }

    function showError(field, message) {
        const formGroup = field.parentElement;
        formGroup.classList.add('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = message;
        }
    }

    function showFormMessage(element, message, type = 'success') {
        if (!element) {
            return;
        }
        element.textContent = message;
        element.classList.remove('error', 'success');
        element.classList.add(type);
        element.style.display = 'block';
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function escapeHtml(text) {
        return String(text).replace(/["&'<>]/g, function(match) {
            return {
                '"': '&quot;',
                '&': '&amp;',
                "'": '&#39;',
                '<': '&lt;',
                '>': '&gt;'
            }[match];
        });
    }
});
