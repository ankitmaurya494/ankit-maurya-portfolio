// Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginError = document.getElementById('loginError');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const resetSection = document.getElementById('resetSection');
    const sendOtpButton = document.getElementById('sendOtpButton');
    const otpMessage = document.getElementById('otpMessage');
    const otpGroup = document.getElementById('otpGroup');
    const newPasswordGroup = document.getElementById('newPasswordGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    const resetPasswordButton = document.getElementById('resetPasswordButton');
    const cancelResetButton = document.getElementById('cancelResetButton');

    const adminInfoForm = document.getElementById('adminInfoForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const adminInfoMessage = document.getElementById('adminInfoMessage');
    const changePasswordMessage = document.getElementById('changePasswordMessage');

    const ADMIN_DATA_KEY = 'photographyAdminData';
    const DEFAULT_PASSWORD = 'admin123';
    let currentOtp = null;

    async function initAdminData() {
        let stored = localStorage.getItem(ADMIN_DATA_KEY);
        if (!stored) {
            const hash = await hashPassword(DEFAULT_PASSWORD);
            const data = {
                passwordHash: hash,
                email: '',
                mobile: ''
            };
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
        }
    }

    async function getAdminData() {
        await initAdminData();
        return JSON.parse(localStorage.getItem(ADMIN_DATA_KEY));
    }

    function saveAdminData(data) {
        localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function showResetSection() {
        if (resetSection) {
            resetSection.classList.remove('hidden');
        }
    }

    function hideResetSection() {
        if (resetSection) {
            resetSection.classList.add('hidden');
        }
        if (otpMessage) {
            otpMessage.textContent = '';
            otpMessage.classList.remove('success', 'error');
        }
        if (otpGroup) otpGroup.classList.add('hidden');
        if (newPasswordGroup) newPasswordGroup.classList.add('hidden');
        if (confirmPasswordGroup) confirmPasswordGroup.classList.add('hidden');
        if (resetPasswordButton) resetPasswordButton.classList.add('hidden');
        if (cancelResetButton) cancelResetButton.classList.add('hidden');
        currentOtp = null;
    }

    function showMessage(element, message, type = 'success') {
        if (!element) return;
        element.textContent = message;
        element.classList.remove('error', 'success');
        element.classList.add(type);
        element.style.display = 'block';
    }

    function clearMessage(element) {
        if (!element) return;
        element.textContent = '';
        element.classList.remove('error', 'success');
        element.style.display = 'none';
    }

    function generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async function populateSettings() {
        const adminData = await getAdminData();
        if (adminInfoForm) {
            const emailInput = document.getElementById('adminEmail');
            const mobileInput = document.getElementById('adminMobile');
            if (emailInput) emailInput.value = adminData.email || '';
            if (mobileInput) mobileInput.value = adminData.mobile || '';
        }
    }

    async function initializePage() {
        await initAdminData();
        if (sessionStorage.getItem('adminLoggedIn')) {
            showAdminPanel();
        }
    }

    initializePage();

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const adminData = await getAdminData();
            const passwordHash = await hashPassword(password);

            if (adminData && passwordHash === adminData.passwordHash) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                loginError.textContent = '';
                hideResetSection();
                showAdminPanel();
            } else {
                loginError.textContent = 'Invalid password';
                loginError.style.color = '#d32f2f';
            }
        });
    }

    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function() {
            showResetSection();
            if (cancelResetButton) cancelResetButton.classList.remove('hidden');
        });
    }

    if (sendOtpButton) {
        sendOtpButton.addEventListener('click', async function() {
            const email = document.getElementById('resetEmail').value.trim().toLowerCase();
            const mobile = document.getElementById('resetMobile').value.trim();
            const adminData = await getAdminData();

            if (!email || !mobile) {
                showMessage(otpMessage, 'Please enter both admin email and mobile.', 'error');
                return;
            }

            if (!adminData.email || !adminData.mobile) {
                showMessage(otpMessage, 'Please save admin email and mobile in Settings first.', 'error');
                return;
            }

            if (email !== adminData.email.toLowerCase() || mobile !== adminData.mobile) {
                showMessage(otpMessage, 'Email or mobile does not match admin settings.', 'error');
                return;
            }

            currentOtp = generateOtp();
            showMessage(otpMessage, `OTP has been sent to admin email/mobile. Your code is ${currentOtp}`, 'success');
            if (otpGroup) otpGroup.classList.remove('hidden');
            if (newPasswordGroup) newPasswordGroup.classList.remove('hidden');
            if (confirmPasswordGroup) confirmPasswordGroup.classList.remove('hidden');
            if (resetPasswordButton) resetPasswordButton.classList.remove('hidden');
            if (cancelResetButton) cancelResetButton.classList.remove('hidden');
        });
    }

    if (resetPasswordButton) {
        resetPasswordButton.addEventListener('click', async function() {
            const otp = document.getElementById('resetOtp').value.trim();
            const newPassword = document.getElementById('resetNewPassword').value;
            const confirmPassword = document.getElementById('resetConfirmPassword').value;

            if (!otp || !newPassword || !confirmPassword) {
                showMessage(otpMessage, 'Please complete all reset fields.', 'error');
                return;
            }

            if (otp !== currentOtp) {
                showMessage(otpMessage, 'Invalid OTP. Please try again.', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showMessage(otpMessage, 'Passwords do not match.', 'error');
                return;
            }

            const adminData = await getAdminData();
            adminData.passwordHash = await hashPassword(newPassword);
            saveAdminData(adminData);
            showMessage(otpMessage, 'Password reset successful. Please log in with your new password.', 'success');
            if (currentOtp) currentOtp = null;
            if (loginForm) loginForm.reset();
            if (resetSection) {
                resetSection.classList.add('hidden');
            }
        });
    }

    if (cancelResetButton) {
        cancelResetButton.addEventListener('click', function() {
            hideResetSection();
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('adminLoggedIn');
            loginError.textContent = '';
            showLoginPanel();
            document.getElementById('password').value = '';
        });
    }

    function showAdminPanel() {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        setupAdminTabs();
        loadDashboard();
        loadPhotos();
        loadMessages();
        loadProjects();
        populateSettings();
    }

    function showLoginPanel() {
        loginSection.style.display = 'flex';
        adminPanel.style.display = 'none';
    }

    // Tab Navigation
    function setupAdminTabs() {
        const menuItems = document.querySelectorAll('.menu-item');
        const panelButtons = document.querySelectorAll('.panel-actions [data-tab]');
        const tabContents = document.querySelectorAll('.tab-content');

        function activateTab(tabName) {
            menuItems.forEach(m => m.classList.toggle('active', m.dataset.tab === tabName));
            panelButtons.forEach(btn => btn.classList.toggle('btn-secondary', btn.dataset.tab === tabName));
            panelButtons.forEach(btn => btn.classList.toggle('btn-ghost', btn.dataset.tab !== tabName));
            tabContents.forEach(tab => tab.classList.toggle('active', tab.id === tabName));
        }

        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                activateTab(this.dataset.tab);
            });
        });

        panelButtons.forEach(button => {
            button.addEventListener('click', function() {
                activateTab(this.dataset.tab);
            });
        });

        const initialTab = document.querySelector('.menu-item.active')?.dataset.tab || 'dashboard';
        activateTab(initialTab);
    }

    // Dashboard
    function loadDashboard() {
        const photos = JSON.parse(localStorage.getItem('photos')) || [];
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        const projects = JSON.parse(localStorage.getItem('projects')) || [];

        document.getElementById('totalPhotos').textContent = photos.length;
        document.getElementById('totalMessages').textContent = messages.length;
        document.getElementById('totalProjects').textContent = projects.length;

        // Show recent messages
        const recentMessages = document.getElementById('recentMessages');
        recentMessages.innerHTML = '';

        if (messages.length === 0) {
            recentMessages.innerHTML = '<p>No messages yet</p>';
        } else {
            messages.slice(-5).reverse().forEach(msg => {
                const msgEl = document.createElement('div');
                msgEl.className = 'message-item';
                const date = new Date(msg.timestamp).toLocaleString();
                msgEl.innerHTML = `
                    <h4>${escapeHtml(msg.name)}</h4>
                    <p><strong>Email:</strong> ${escapeHtml(msg.email)}</p>
                    <p><strong>Subject:</strong> ${escapeHtml(msg.subject)}</p>
                    <p>${escapeHtml(msg.message)}</p>
                    <div class="message-meta">
                        <span>${date}</span>
                    </div>
                `;
                recentMessages.appendChild(msgEl);
            });
        }
    }

    // Photo Upload
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const titleInput = document.getElementById('photoTitle').value.trim();
            const category = document.getElementById('photoCategory').value;
            const files = Array.from(document.getElementById('photoFile').files || []);
            const uploadMessage = document.getElementById('uploadMessage');

            uploadMessage.classList.remove('success', 'error');
            uploadMessage.textContent = '';

            if (!files.length) {
                uploadMessage.textContent = 'Please select at least one file.';
                uploadMessage.classList.add('error');
                return;
            }

            if (!category) {
                uploadMessage.textContent = 'Please select a category.';
                uploadMessage.classList.add('error');
                return;
            }

            const photos = JSON.parse(localStorage.getItem('photos')) || [];
            const gallery = JSON.parse(localStorage.getItem('galleryImages')) || [];

            const readFile = file => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ file, data: reader.result });
                reader.onerror = () => reject(new Error('Unable to read file: ' + file.name));
                reader.readAsDataURL(file);
            });

            Promise.all(files.map(readFile))
                .then(results => {
                    results.forEach(({ file, data }) => {
                        const autoTitle = titleInput || file.name.replace(/\.[^/.]+$/, '');
                        const id = Date.now() + Math.floor(Math.random() * 1000);
                        const photo = {
                            id: id,
                            title: autoTitle,
                            category: category,
                            data: data,
                            timestamp: new Date().toISOString()
                        };

                        photos.push(photo);
                        gallery.push({ id: photo.id, title: photo.title, category: photo.category, src: photo.data, alt: photo.title });
                    });

                    localStorage.setItem('photos', JSON.stringify(photos));
                    localStorage.setItem('galleryImages', JSON.stringify(gallery));

                    uploadMessage.textContent = `${files.length} photo(s) uploaded successfully.`;
                    uploadMessage.classList.add('success');
                    uploadMessage.classList.remove('error');

                    uploadForm.reset();
                    loadPhotos();
                    loadDashboard();
                })
                .catch(error => {
                    uploadMessage.textContent = error.message;
                    uploadMessage.classList.add('error');
                    uploadMessage.classList.remove('success');
                });
        });
    }

    // Load Photos
    function loadPhotos() {
        const photosList = document.getElementById('photosList');
        const photos = JSON.parse(localStorage.getItem('photos')) || [];

        photosList.innerHTML = '';

        if (photos.length === 0) {
            photosList.innerHTML = '<p>No photos uploaded yet</p>';
        } else {
            photos.forEach(photo => {
                const photoEl = document.createElement('div');
                photoEl.className = 'photo-item';
                const date = new Date(photo.timestamp).toLocaleString();
                photoEl.innerHTML = `
                    <img src="${photo.data}" alt="${escapeHtml(photo.title)}" class="photo-image">
                    <div class="photo-item-content">
                        <div>
                            <p class="gallery-category">${escapeHtml(photo.category)}</p>
                            <h4>${escapeHtml(photo.title)}</h4>
                        </div>
                        <div class="photo-meta">
                            <span>${date}</span>
                            <button class="delete-btn" onclick="deletePhoto(${photo.id})">Delete</button>
                        </div>
                    </div>
                `;
                photosList.appendChild(photoEl);
            });
        }

        // Update total photos in dashboard
        if (document.getElementById('totalPhotos')) {
            document.getElementById('totalPhotos').textContent = photos.length;
        }
    }

    // Load Messages
    function loadMessages() {
        const messagesList = document.getElementById('messagesList');
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];

        messagesList.innerHTML = '';

        if (messages.length === 0) {
            messagesList.innerHTML = '<p>No messages yet</p>';
        } else {
            messages.reverse().forEach((msg, index) => {
                const msgEl = document.createElement('div');
                msgEl.className = 'message-item';
                const date = new Date(msg.timestamp).toLocaleString();
                msgEl.innerHTML = `
                    <h4>${escapeHtml(msg.name)}</h4>
                    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></p>
                    ${msg.phone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(msg.phone)}">${escapeHtml(msg.phone)}</a></p>` : ''}
                    <p><strong>Subject:</strong> ${escapeHtml(msg.subject)}</p>
                    <p>${escapeHtml(msg.message)}</p>
                    <div class="message-meta">
                        <span>${date}</span>
                        <button class="delete-btn" onclick="deleteMessage(${index})">Delete</button>
                    </div>
                `;
                messagesList.appendChild(msgEl);
            });
        }

        // Update total messages in dashboard
        if (document.getElementById('totalMessages')) {
            document.getElementById('totalMessages').textContent = messages.length;
        }
    }

    // Project Management
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('projectName').value;
            const category = document.getElementById('projectCategory').value;
            const description = document.getElementById('projectDescription').value;
            const date = document.getElementById('projectDate').value;
            const location = document.getElementById('projectLocation').value;
            const projectMessage = document.getElementById('projectMessage');

            const project = {
                id: Date.now(),
                name: name,
                category: category,
                description: description,
                date: date,
                location: location,
                timestamp: new Date().toISOString()
            };

            let projects = JSON.parse(localStorage.getItem('projects')) || [];
            projects.push(project);
            localStorage.setItem('projects', JSON.stringify(projects));

            projectMessage.textContent = 'Project added successfully!';
            projectMessage.classList.add('success');
            projectMessage.classList.remove('error');

            projectForm.reset();
            loadProjects();

            setTimeout(() => {
                projectMessage.textContent = '';
            }, 3000);
        });
    }

    if (adminInfoForm) {
        adminInfoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value.trim().toLowerCase();
            const mobile = document.getElementById('adminMobile').value.trim();

            if (!email || !mobile) {
                showMessage(adminInfoMessage, 'Please enter both email and mobile.', 'error');
                return;
            }

            const adminData = await getAdminData();
            adminData.email = email;
            adminData.mobile = mobile;
            saveAdminData(adminData);

            showMessage(adminInfoMessage, 'Admin contact information saved successfully.', 'success');
            setTimeout(() => clearMessage(adminInfoMessage), 3000);
        });
    }

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentAdminPassword').value;
            const newPassword = document.getElementById('newAdminPassword').value;
            const confirmPassword = document.getElementById('confirmAdminPassword').value;
            const adminData = await getAdminData();
            const currentHash = await hashPassword(currentPassword);

            if (!currentPassword || !newPassword || !confirmPassword) {
                showMessage(changePasswordMessage, 'Please complete all password fields.', 'error');
                return;
            }

            if (currentHash !== adminData.passwordHash) {
                showMessage(changePasswordMessage, 'Current password is incorrect.', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showMessage(changePasswordMessage, 'New passwords do not match.', 'error');
                return;
            }

            adminData.passwordHash = await hashPassword(newPassword);
            saveAdminData(adminData);
            showMessage(changePasswordMessage, 'Admin password updated successfully.', 'success');
            changePasswordForm.reset();
            setTimeout(() => clearMessage(changePasswordMessage), 3000);
        });
    }

    // Load Projects
    function loadProjects() {
        const projectsList = document.getElementById('projectsList');
        const projects = JSON.parse(localStorage.getItem('projects')) || [];

        projectsList.innerHTML = '';

        if (projects.length === 0) {
            projectsList.innerHTML = '<p>No projects added yet</p>';
        } else {
            projects.reverse().forEach((project, index) => {
                const projEl = document.createElement('div');
                projEl.className = 'project-item';
                projEl.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h4>${escapeHtml(project.name)}</h4>
                            <p><strong>Category:</strong> ${escapeHtml(project.category)}</p>
                            <p><strong>Description:</strong> ${escapeHtml(project.description)}</p>
                            <div class="project-meta">
                                <span>${escapeHtml(project.date)}</span>
                                <span>${escapeHtml(project.location)}</span>
                            </div>
                        </div>
                        <button class="delete-btn" onclick="deleteProject(${project.id})">Delete</button>
                    </div>
                `;
                projectsList.appendChild(projEl);
            });
        }

        // Update total projects in dashboard
        if (document.getElementById('totalProjects')) {
            document.getElementById('totalProjects').textContent = projects.length;
        }
    }

    // Make delete functions global
    window.deletePhoto = function(id) {
        if (confirm('Are you sure you want to delete this photo?')) {
            let photos = JSON.parse(localStorage.getItem('photos')) || [];
            photos = photos.filter(p => p.id !== id);
            localStorage.setItem('photos', JSON.stringify(photos));

            // Also remove from galleryImages if present
            let gallery = JSON.parse(localStorage.getItem('galleryImages')) || [];
            gallery = gallery.filter(g => g.id !== id);
            localStorage.setItem('galleryImages', JSON.stringify(gallery));

            loadPhotos();
            loadDashboard();
        }
    };

    window.deleteMessage = function(index) {
        if (confirm('Are you sure you want to delete this message?')) {
            let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            messages.splice(index, 1);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            loadMessages();
            loadDashboard();
        }
    };

    window.deleteProject = function(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            let projects = JSON.parse(localStorage.getItem('projects')) || [];
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem('projects', JSON.stringify(projects));
            loadProjects();
            loadDashboard();
        }
    };

    // Helper function to escape HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
});
