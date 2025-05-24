// Enhanced background effects for galaxy and grass themes
function createThemeAwareBackground() {
    const container = document.querySelector('.home-background');
    if (!container) return;

    // Check current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    // Clear existing background elements
    container.innerHTML = '';

    if (currentTheme === 'dark') {
        createGalaxyBackground(container);
    } else {
        createGrassBackground(container);
    }
}

// Create starfield effect for galaxy theme
function createGalaxyBackground(container) {
    const numStars = 150;
    const numNebulas = 8;

    // Create stars
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'cosmic-star';
        star.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: #F0F6FC;
            border-radius: 50%;
            animation: cosmicTwinkle ${Math.random() * 4 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            box-shadow: 0 0 6px rgba(240, 246, 252, 0.8);
        `;
        container.appendChild(star);
    }

    // Create nebula effects
    for (let i = 0; i < numNebulas; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'cosmic-nebula';
        const colors = ['#2196F3', '#1976D2', '#03DAC6'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        nebula.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 200 + 100}px;
            height: ${Math.random() * 200 + 100}px;
            background: radial-gradient(circle, ${color}20 0%, transparent 70%);
            border-radius: 50%;
            animation: nebulaFloat ${Math.random() * 20 + 15}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(nebula);
    }
}

// Create nature effects for grass theme
function createGrassBackground(container) {
    const numLeaves = 25;
    const numFlowers = 12;

    // Create floating leaves
    for (let i = 0; i < numLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'nature-leaf';
        leaf.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 20 + 10}px;
            background: linear-gradient(45deg, #4CAF50, #81C784);
            border-radius: 0 100% 0 100%;
            animation: leafFloat ${Math.random() * 15 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            opacity: 0.6;
        `;
        container.appendChild(leaf);
    }

    // Create flower accents
    for (let i = 0; i < numFlowers; i++) {
        const flower = document.createElement('div');
        flower.className = 'nature-flower';
        flower.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 15 + 8}px;
            height: ${Math.random() * 15 + 8}px;
            background: radial-gradient(circle, #FF7043, #FFA726);
            border-radius: 50%;
            animation: flowerGlow ${Math.random() * 8 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            opacity: 0.7;
        `;
        container.appendChild(flower);
    }
}

// Add CSS animations for the effects
function addBackgroundAnimations() {
    if (document.getElementById('background-animations')) return;

    const style = document.createElement('style');
    style.id = 'background-animations';
    style.textContent = `
        @keyframes cosmicTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes nebulaFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            33% { transform: translate(20px, -10px) rotate(120deg); opacity: 0.6; }
            66% { transform: translate(-15px, 15px) rotate(240deg); opacity: 0.4; }
        }
        
        @keyframes leafFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-15px) rotate(10deg); }
            66% { transform: translateY(-5px) rotate(-5deg); }
        }
        
        @keyframes flowerGlow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Listen for theme changes
document.addEventListener('data-theme-changed', () => {
    setTimeout(createThemeAwareBackground, 300); // Delay to allow theme transition
});

// Initialize background when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addBackgroundAnimations();
    createThemeAwareBackground();
});
