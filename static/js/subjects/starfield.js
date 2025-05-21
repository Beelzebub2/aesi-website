// Create starfield effect
function createStarfield(container) {
    const numStars = 50;
    const starfield = document.createElement('div');
    starfield.className = 'starfield-background';

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.setProperty('--twinkle-duration', `${Math.random() * 2 + 2}s`);
        starfield.appendChild(star);
    }

    container.insertBefore(starfield, container.firstChild);
}

// Initialize starfields when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const subjectBanners = document.querySelectorAll('.subject-banner');
    subjectBanners.forEach(banner => {
        createStarfield(banner);
    });
});
