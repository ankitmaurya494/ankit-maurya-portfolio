document.addEventListener('DOMContentLoaded', function() {
    const clientLoginForm = document.getElementById('clientLoginForm');
    const clientRegisterForm = document.getElementById('clientRegisterForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const clientMessage = document.getElementById('clientMessage');
    const adminMessage = document.getElementById('adminMessage');
    const clientStatus = document.getElementById('clientStatus');
    const tabButtons = document.querySelectorAll('.tab-button');

    const USERS_KEY = 'photographyClientUsers';
    const CURRENT_USER_KEY = 'photographyCurrentUser';
    const ADMIN_PASSWORD = 'admin123';

    function getUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    }

    function setCurrentUser(user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    function clearCurrentUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    function ensureClientDatabase() {
        if (!localStorage.getItem(USERS_KEY)) {
            saveUsers({});
        }
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
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

    function showMessage(element, message, type = 'success') {
        element.textContent = message;
        element.style.color = type === 'success' ? '#1a7a1f' : '#d32f2f';
        element.style.display = 'block';
    }

    function clearMessage(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    function updateClientStatus() {
        const user = getCurrentUser();
        if (user) {
            clientStatus.innerHTML = `
                <p class="status-text">Logged in as <strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)})</p>
                <div class="status-actions">
                    <button id="logoutClientBtn" class="secondary-button">Logout</button>
                    <a href="contact.html" class="cta-button">Go to Contact</a>
                </div>
            `;
            const logoutBtn = document.getElementById('logoutClientBtn');
            logoutBtn.addEventListener('click', function() {
                clearCurrentUser();
                updateClientStatus();
                showMessage(clientMessage, 'You have been logged out.', 'success');
            });
        } else {
            clientStatus.innerHTML = '';
        }
    }

    function switchTab(targetId) {
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.target === targetId);
        });

        clientLoginForm.style.display = targetId === 'clientLoginForm' ? 'grid' : 'none';
        clientRegisterForm.style.display = targetId === 'clientRegisterForm' ? 'grid' : 'none';
        clearMessage(clientMessage);
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.target);
        });
    });

    if (clientLoginForm) {
        clientLoginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const users = getUsers();

            if (!email || !password) {
                showMessage(clientMessage, 'Please enter email and password.', 'error');
                return;
            }

            const passwordHash = await hashPassword(password);

            if (!users[email] || users[email].passwordHash !== passwordHash) {
                showMessage(clientMessage, 'Invalid login credentials.', 'error');
                return;
            }

            const userInfo = {
                name: users[email].name,
                email: users[email].email,
                mobile: users[email].mobile
            };
            setCurrentUser(userInfo);
            updateClientStatus();
            showMessage(clientMessage, 'You are now logged in. You can submit contact messages and reviews.', 'success');
            clientLoginForm.reset();
        });
    }

    if (clientRegisterForm) {
        clientRegisterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim().toLowerCase();
            const mobile = document.getElementById('registerMobile').value.trim();
            const password = document.getElementById('registerPassword').value;
            const users = getUsers();

            if (!name || !email || !mobile || !password) {
                showMessage(clientMessage, 'Please complete all fields.', 'error');
                return;
            }

            if (users[email]) {
                showMessage(clientMessage, 'This email is already registered. Please log in.', 'error');
                return;
            }

            const passwordHash = await hashPassword(password);
            users[email] = { name: name, email: email, mobile: mobile, passwordHash: passwordHash };
            saveUsers(users);

            setCurrentUser({ name: name, email: email, mobile: mobile });
            updateClientStatus();
            showMessage(clientMessage, 'Registration completed and logged in successfully.', 'success');
            clientRegisterForm.reset();
            switchTab('clientLoginForm');
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const password = document.getElementById('adminPassword').value;

            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin/index.html';
            } else {
                showMessage(adminMessage, 'Invalid admin password.', 'error');
            }
        });
    }

    ensureClientDatabase();
    updateClientStatus();
});
