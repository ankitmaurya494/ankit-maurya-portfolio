// Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.navbar-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navbarMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });
});

// Dynamically load shared interaction script (home.js) when navbar.js is present
(function loadSharedScript(){
    try {
        const scripts = document.getElementsByTagName('script');
        let navbarScript = null;
        for (let i=0;i<scripts.length;i++){
            const s = scripts[i];
            if (s.src && s.src.indexOf('navbar.js') !== -1) { navbarScript = s; break; }
        }
        if (!navbarScript) return;
        const base = navbarScript.src.replace(/navbar\.js(\?.*)?$/,'');
        const shared = base + 'home.js';
        const el = document.createElement('script');
        el.src = shared;
        el.defer = true;
        el.onload = function(){};
        document.head.appendChild(el);
    } catch(e){ /* ignore */ }
})();
