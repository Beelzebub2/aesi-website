// Ensure the minimized player stays on top of all elements

document.addEventListener('DOMContentLoaded', function () {
    // Function to ensure player stays on top
    function ensurePlayerOnTop() {
        const minimizedPlayer = document.querySelector('.minimized-player');
        if (minimizedPlayer && minimizedPlayer.style.display !== 'none') {
            // Force the highest z-index
            minimizedPlayer.style.zIndex = '99999';
            minimizedPlayer.style.position = 'fixed';
        }
    }

    // Check periodically to ensure player stays on top
    setInterval(ensurePlayerOnTop, 1000);

    // Also ensure on scroll and resize
    window.addEventListener('scroll', ensurePlayerOnTop);
    window.addEventListener('resize', ensurePlayerOnTop);

    // Enhanced keyboard controls for better audio navigation
    document.addEventListener('keydown', function (e) {
        const minimizedPlayer = document.querySelector('.minimized-player');
        if (minimizedPlayer && minimizedPlayer.style.display !== 'none') {
            // Only handle keyboard shortcuts when minimized player is visible
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        minimizedPlayer.querySelector('.mini-play-button').click();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        minimizedPlayer.querySelector('.mini-skip-back').click();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        minimizedPlayer.querySelector('.mini-skip-forward').click();
                        break;
                    case 'KeyM':
                        e.preventDefault();
                        minimizedPlayer.querySelector('.mini-volume-button').click();
                        break;
                }
            }
        }
    });
});
