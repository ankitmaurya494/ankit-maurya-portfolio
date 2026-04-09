// Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Remove preventDefault to allow form submission to Formspree
            // e.preventDefault();

            // Clear previous error messages
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });

            // Validate form
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const formMessage = document.getElementById('formMessage');

            let isValid = true;

            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            }

            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            }

            // Validate subject
            if (!subjectInput.value.trim()) {
                showError(subjectInput, 'Please select a subject');
                isValid = false;
            }

            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault(); // Prevent submission if invalid
                formMessage.textContent = 'Please fix the errors above';
                formMessage.classList.add('error');
                formMessage.classList.remove('success');
            } else {
                // Form is valid, allow submission to Formspree
                // Optionally show a submitting message
                formMessage.textContent = 'Sending message...';
                formMessage.classList.remove('error');
                formMessage.classList.add('success');
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
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

    function showError(field, message) {
        const formGroup = field.parentElement;
        formGroup.classList.add('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = message;
        }
    }

    function validateField(field) {
        const formGroup = field.parentElement;

        if (field.id === 'name') {
            if (!field.value.trim()) {
                showError(field, 'Name is required');
                return false;
            }
        } else if (field.id === 'email') {
            if (!field.value.trim()) {
                showError(field, 'Email is required');
                return false;
            } else if (!isValidEmail(field.value)) {
                showError(field, 'Please enter a valid email');
                return false;
            }
        } else if (field.id === 'subject') {
            if (!field.value.trim()) {
                showError(field, 'Please select a subject');
                return false;
            }
        } else if (field.id === 'message') {
            if (!field.value.trim()) {
                showError(field, 'Message is required');
                return false;
            } else if (field.value.trim().length < 10) {
                showError(field, 'Message must be at least 10 characters');
                return false;
            }
        }

        formGroup.classList.remove('error');
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
