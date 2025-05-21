// Create starfield effect for home page background
function createHomeBackground() {
    const container = document.querySelector('.home-background');
    if (!container) return;

    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.setProperty('--twinkle-duration', `${Math.random() * 2 + 2}s`);
        container.appendChild(star);
    }
}

// Initialize background when the page loads
document.addEventListener('DOMContentLoaded', createHomeBackground);
