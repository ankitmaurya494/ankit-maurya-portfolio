document.addEventListener('DOMContentLoaded', function() {
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
});
