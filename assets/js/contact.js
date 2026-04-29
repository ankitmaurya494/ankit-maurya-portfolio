// Contact and Review Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const reviewForm = document.getElementById('reviewForm');

    if (contactForm) {
        setupForm(contactForm, 'contact');
    }

    if (reviewForm) {
        setupForm(reviewForm, 'review');
    }

    function setupForm(form, type) {
        const formMessage = document.getElementById(type === 'review' ? 'reviewMessage' : 'contactMessage');

        form.addEventListener('submit', function(e) {
            clearErrors(form);
            const isValid = validateForm(form, type);

            if (!isValid) {
                e.preventDefault();
                formMessage.textContent = 'Please fix the errors above.';
                formMessage.classList.add('error');
                formMessage.classList.remove('success');
                return;
            }

            if (type === 'contact') {
                updateBookingCount();
            } else {
                updateReviewCount();
            }

            formMessage.textContent = 'Sending your response...';
            formMessage.classList.remove('error');
            formMessage.classList.add('success');
        });

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    function clearErrors(form) {
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    }

    function validateForm(form, type) {
        let isValid = true;

        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function showError(field, message) {
        const formGroup = field.parentElement;
        formGroup.classList.add('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = message;
        }
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

        if (id === 'email' || id === 'reviewEmail') {
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

    function updateBookingCount() {
        const currentCount = parseInt(localStorage.getItem('bookingCount') || '0', 10);
        localStorage.setItem('bookingCount', currentCount + 1);
    }

    function updateReviewCount() {
        const currentCount = parseInt(localStorage.getItem('reviewCount') || '18', 10);
        localStorage.setItem('reviewCount', currentCount + 1);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
