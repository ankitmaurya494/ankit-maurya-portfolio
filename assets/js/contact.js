// Contact and Review Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const reviewForm = document.getElementById('reviewForm');
    const reviewList = document.getElementById('reviewList');
    const contactMessage = document.getElementById('contactMessage');
    const reviewMessage = document.getElementById('reviewMessage');

    initializePage();

    function initializePage() {
        renderReviews();

        if (contactForm) {
            setupContactForm();
        }

        if (reviewForm) {
            setupReviewForm();
        }
    }

    function setupContactForm() {
        const contactSubmitButton = contactForm.querySelector('.submit-button');

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors(contactForm);

            if (!validateForm(contactForm, 'contact')) {
                showFormMessage(contactMessage, 'Please fix the errors above.', 'error');
                return;
            }

            const messageData = {
                id: Date.now(),
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toISOString()
            };

            setSubmitLoading(contactSubmitButton, true);
            showFormMessage(contactMessage, 'Sending your booking request...', 'success');

            setTimeout(() => {
                saveContactMessage(messageData);
                showFormMessage(contactMessage, 'Your message has been saved locally and is visible to admin in the dashboard.', 'success');
                setSubmitLoading(contactSubmitButton, false);
                contactForm.reset();
            }, 900);
        });
    }

    function setupReviewForm() {
        reviewForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors(reviewForm);

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

    function setSubmitLoading(button, isLoading) {
        if (!button) {
            return;
        }
        button.dataset.originalText = button.dataset.originalText || button.textContent;

        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.textContent = 'Sending...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.textContent = button.dataset.originalText;
        }
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
