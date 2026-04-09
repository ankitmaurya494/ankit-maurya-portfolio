// Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginError = document.getElementById('loginError');

    const DEFAULT_PASSWORD = 'admin123';

    // Check if user is already logged in
    if (sessionStorage.getItem('adminLoggedIn')) {
        showAdminPanel();
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;

            if (password === DEFAULT_PASSWORD) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                loginError.textContent = '';
                showAdminPanel();
            } else {
                loginError.textContent = 'Invalid password';
                loginError.style.color = '#d32f2f';
            }
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
    }

    function showLoginPanel() {
        loginSection.style.display = 'flex';
        adminPanel.style.display = 'none';
    }

    // Tab Navigation
    function setupAdminTabs() {
        const menuItems = document.querySelectorAll('.menu-item');
        const tabContents = document.querySelectorAll('.tab-content');

        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const tabName = this.dataset.tab;

                // Update active menu item
                menuItems.forEach(m => m.classList.remove('active'));
                this.classList.add('active');

                // Update active tab
                tabContents.forEach(tab => tab.classList.remove('active'));
                const activeTab = document.getElementById(tabName);
                if (activeTab) {
                    activeTab.classList.add('active');
                }
            });
        });
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

            const title = document.getElementById('photoTitle').value;
            const category = document.getElementById('photoCategory').value;
            const file = document.getElementById('photoFile').files[0];
            const uploadMessage = document.getElementById('uploadMessage');

            if (!file) {
                uploadMessage.textContent = 'Please select a file';
                uploadMessage.classList.add('error');
                uploadMessage.classList.remove('success');
                return;
            }

            // Read file as Base64
            const reader = new FileReader();
            reader.onload = function(e) {
                const photo = {
                    id: Date.now(),
                    title: title,
                    category: category,
                    data: e.target.result,
                    timestamp: new Date().toISOString()
                };

                let photos = JSON.parse(localStorage.getItem('photos')) || [];
                photos.push(photo);
                localStorage.setItem('photos', JSON.stringify(photos));

                uploadMessage.textContent = 'Photo uploaded successfully!';
                uploadMessage.classList.add('success');
                uploadMessage.classList.remove('error');

                uploadForm.reset();
                loadPhotos();

                setTimeout(() => {
                    uploadMessage.textContent = '';
                }, 3000);
            };

            reader.readAsDataURL(file);
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
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h4>${escapeHtml(photo.title)}</h4>
                            <p><strong>Category:</strong> ${escapeHtml(photo.category)}</p>
                            <img src="${photo.data}" alt="${escapeHtml(photo.title)}" class="photo-image">
                            <div class="photo-meta">
                                <span>${date}</span>
                            </div>
                        </div>
                        <button class="delete-btn" onclick="deletePhoto(${photo.id})">Delete</button>
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
