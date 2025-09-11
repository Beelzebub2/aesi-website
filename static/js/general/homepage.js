// Homepage specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Create background elements based on theme
    createBackground();

    // Listen for theme changes
    document.documentElement.addEventListener('data-theme-changed', createBackground);
});

function createBackground() {
    const background = document.querySelector('.home-background');
    if (!background) return;

    // Clear existing elements
    background.innerHTML = '';

    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        createStarfield(background);
    } else {
        createGrassfield(background);
    }
}

function createStarfield(container) {
    const numStars = 30; // Reduced from 100
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

function createGrassfield(container) {
    const numGrass = 20; // Reduced from 50
    for (let i = 0; i < numGrass; i++) {
        const grass = document.createElement('div');
        grass.className = 'grass';
        grass.style.left = `${Math.random() * 100}%`;
        grass.style.height = `${Math.random() * 30 + 20}px`;
        grass.style.width = '2px';
        grass.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(grass);
    }
}

// This function is now in the global theme.js file
