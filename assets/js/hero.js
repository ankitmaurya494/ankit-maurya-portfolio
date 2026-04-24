document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) return;

    const videos = [
        'assets/images/hero section/1.mp4',
        'assets/images/hero section/2.mp4'
    ];

    let currentIndex = Math.floor(Math.random() * videos.length);

    function loadVideo(index) {
        heroVideo.src = videos[index];
        heroVideo.load();
        heroVideo.play().catch(() => {
            // autoplay may be blocked on some browsers; mute is set by default.
        });
    }

    heroVideo.addEventListener('ended', function() {
        currentIndex = (currentIndex + 1) % videos.length;
        loadVideo(currentIndex);
    });

    loadVideo(currentIndex);
});