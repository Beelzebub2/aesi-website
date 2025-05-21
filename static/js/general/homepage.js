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

function createStarfield(background) {
    const starCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 3000));
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Random size - slightly larger stars for better visibility
        const size = (Math.random() * 2.5) + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random twinkle speed - optimized range
        const duration = (Math.random() * 4) + 4; star.style.setProperty('--twinkle-duration', `${duration}s`);
        star.style.animationDelay = `${Math.random() * 3}s`;
        fragment.appendChild(star);
    }

    background.appendChild(fragment);
}

function createGrassfield(background) {
    const grassCount = Math.min(200, Math.floor(window.innerWidth / 8)); // One grass blade every 8px
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < grassCount; i++) {
        const grass = document.createElement('div');
        grass.className = 'grass';

        // Position grass along the bottom
        grass.style.left = `${(i / grassCount) * 100}%`;

        // Randomize grass properties
        const height = 30 + Math.random() * 20; // Height between 30-50px
        grass.style.height = `${height}px`;

        // Random animation delay and duration for natural movement
        grass.style.animationDelay = `${Math.random() * 2}s`;
        grass.style.animationDuration = `${3 + Math.random() * 2}s`;

        // Slight variation in color
        const greenHue = Math.floor(120 + (Math.random() * 10 - 5));
        const saturation = Math.floor(60 + (Math.random() * 20));
        grass.style.backgroundColor = `hsl(${greenHue}, ${saturation}%, 35%)`;

        fragment.appendChild(grass);
    }

    background.appendChild(fragment);
}

// This function is now in the global theme.js file
