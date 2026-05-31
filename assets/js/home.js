function runHomeScript() {
    const visitorCountEl = document.getElementById('visitorCount');
    const bookingCountEl = document.getElementById('bookingCount');

    function getStoredCount(key, defaultValue) {
        return parseInt(localStorage.getItem(key) || defaultValue, 10);
    }


    if (visitorCountEl) {
        let visitorCount = getStoredCount('websiteVisitorCount', '250');
        const hasTrackedVisitor = sessionStorage.getItem('visitorTracked');

        if (!hasTrackedVisitor) {
            visitorCount += 1;
            localStorage.setItem('websiteVisitorCount', visitorCount);
            sessionStorage.setItem('visitorTracked', 'true');
        }

        visitorCountEl.textContent = visitorCount.toLocaleString();
    }

    if (bookingCountEl) {
        const bookingCount = getStoredCount('bookingCount', '0');
        bookingCountEl.textContent = bookingCount.toLocaleString();
    }

    const reviewCountEl = document.getElementById('reviewCount');
    if (reviewCountEl) {
        const reviewCount = getStoredCount('reviewCount', '18');
        reviewCountEl.textContent = reviewCount.toLocaleString();
    }

    const liquidButtons = document.querySelectorAll('.liquid-button');
    liquidButtons.forEach(button => {
        button.addEventListener('click', event => {
            const rect = button.getBoundingClientRect();
            const drop = document.createElement('span');
            drop.className = 'liquid-drop';
            const size = Math.max(rect.width, rect.height) * 0.7;
            drop.style.width = `${size}px`;
            drop.style.height = `${size}px`;
            drop.style.left = `${event.clientX - rect.left - size / 2}px`;
            drop.style.top = `${event.clientY - rect.top - size / 2}px`;
            button.appendChild(drop);
            setTimeout(() => drop.remove(), 800);
        });
    });
    
        // 3D tilt / parallax interactions for glass cards and hero
        function supportsTouch() {
            return (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
        }
    
        if (!supportsTouch()) {
            const tiltElements = document.querySelectorAll('.featured-card, .review-card, .stat-card, .glass-card');
            tiltElements.forEach(el => el.classList.add('tilt'));
        
            document.querySelectorAll('.tilt').forEach(el => {
                let rect = null;
                let raf = null;
                function onMove(e) {
                    rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const rotY = x * 8; // degrees
                    const rotX = -y * 10;
                    const translateZ = 8 + Math.abs(x * 6) + Math.abs(y * 6);
                    if (raf) cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(() => {
                        el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${translateZ}px)`;
                    });
                }
    
                function onLeave() {
                    if (raf) cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(() => {
                        el.style.transform = '';
                    });
                }
    
                el.addEventListener('mousemove', onMove);
                el.addEventListener('mouseleave', onLeave);
            });
    
            // Hero parallax for background and content
            const hero = document.querySelector('.hero');
            const heroContent = document.querySelector('.hero-content');
            if (hero && heroContent) {
                hero.addEventListener('mousemove', e => {
                    const rect = hero.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width - 0.5;
                    const py = (e.clientY - rect.top) / rect.height - 0.5;
                    heroContent.style.transform = `translate3d(${px * 18}px, ${py * 12}px, 40px) rotateX(${py * -4}deg) rotateY(${px * 6}deg)`;
                });
                hero.addEventListener('mouseleave', () => {
                    heroContent.style.transform = '';
                });
            }
        }

    // Global ripple for other buttons (non .liquid-button)
    const otherButtons = Array.from(document.querySelectorAll('button, .btn, .link-button, .tab-button, .cta-button, .secondary-button, .submit-button, .upload-button'))
        .filter(b => !b.classList.contains('liquid-button'));

    otherButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            const rect = btn.getBoundingClientRect();
            const drop = document.createElement('span');
            drop.className = 'liquid-drop';
            const size = Math.max(rect.width, rect.height) * 0.5;
            drop.style.width = `${size}px`;
            drop.style.height = `${size}px`;
            drop.style.left = `${e.clientX - rect.left - size / 2}px`;
            drop.style.top = `${e.clientY - rect.top - size / 2}px`;
            drop.style.background = 'rgba(255,255,255,0.22)';
            btn.appendChild(drop);
            setTimeout(() => drop.remove(), 700);
        });
    });

    // Add input underline wrapper class to parent elements so CSS :focus-within works
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(inp => {
        const parent = inp.parentElement;
        if (parent && !parent.classList.contains('input-liquid-underline')) {
            parent.classList.add('input-liquid-underline');
        }
        // also mark parent as glass surface for sheen
        if (parent && !parent.classList.contains('glass-animated')) {
            parent.classList.add('glass-animated');
        }
        inp.addEventListener('focus', () => inp.classList.add('focused'));
        inp.addEventListener('blur', () => inp.classList.remove('focused'));
    });

    // Tag common buttons and cards with glass-animated for sheen overlay
    const glassElements = document.querySelectorAll('button, .btn, .featured-card, .review-card, .stat-card, .glass-card, .info-card, .auth-card, .login-card, .admin-panel, .upload-section, .contact-wrapper, .map-frame, .topbar-card, .footer');
    glassElements.forEach(el => {
        if (!el.classList.contains('glass-animated')) el.classList.add('glass-animated');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runHomeScript);
} else {
    runHomeScript();
}
