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
    const numStars = 30; // Reduced from 200
    const numNebulas = 3; // Reduced from 12

    // Create regular stars with enhanced movement
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'cosmic-star';
        const size = Math.random() * 4 + 1;
        star.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: #F0F6FC;
            border-radius: 50%;
            animation: simpleTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s, ${Math.random() * 10}s;
            box-shadow: 0 0 ${size * 2}px rgba(240, 246, 252, 0.8);
        `;
        container.appendChild(star);
    }

    // Create nebula effects
    for (let i = 0; i < numNebulas; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'cosmic-nebula';
        const colors = ['#2196F3', '#1976D2', '#03DAC6', '#7C4DFF', '#E91E63'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        nebula.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 300 + 150}px;
            height: ${Math.random() * 300 + 150}px;
            background: radial-gradient(circle, ${color}15 0%, transparent 70%);
            border-radius: 50%;
            animation: nebulaFloat ${Math.random() * 25 + 20}s ease-in-out infinite;
            animation-delay: ${Math.random() * 8}s;
        `;
        container.appendChild(nebula);
    }
}

// Create nature effects for grass theme
function createGrassBackground(container) {
    const numLeaves = 10; // Reduced from 25
    const numFlowers = 5; // Reduced from 15    // Create floating leaves with enhanced movement
    for (let i = 0; i < numLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'nature-leaf';
        const size = Math.random() * 25 + 12;
        leaf.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -20px;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, #4CAF50, #81C784);
            border-radius: 0 100% 0 100%;
            animation: simpleFall ${Math.random() * 6 + 8}s linear infinite;
        `;
        container.appendChild(leaf);
    }

    // Create falling flowers
    for (let i = 0; i < numFlowers; i++) {
        const fallingFlower = document.createElement('div');
        fallingFlower.className = 'falling-flower';
        const colors = ['#E91E63', '#F06292', '#FF4081', '#C2185B'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        fallingFlower.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -20px;
            width: 12px;
            height: 12px;
            background: ${color};
            border-radius: 50%;
            animation: simpleFall ${Math.random() * 5 + 8}s linear infinite;
        `;
        container.appendChild(fallingFlower);
    }
}

// Add simplified CSS animations
function addBackgroundAnimations() {
    if (document.getElementById('background-animations')) return;

    const style = document.createElement('style');
    style.id = 'background-animations';
    style.textContent = `
        @keyframes simpleTwinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        @keyframes nebulaFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            50% { transform: translate(10px, -5px) rotate(180deg); opacity: 0.6; }
        }
        
        @keyframes simpleFall {
            0% { 
                transform: translateX(0) translateY(0) rotate(0deg); 
                opacity: 0; 
            }
            10% { 
                opacity: 0.8; 
            }
            90% { 
                opacity: 0.8; 
            }
            100% { 
                transform: translateX(20px) translateY(100vh) rotate(180deg); 
                opacity: 0; 
            }
        }
    `;
    document.head.appendChild(style);
}

// Listen for theme changes
document.addEventListener('data-theme-changed', () => {
    setTimeout(createThemeAwareBackground, 200); // Reduced delay
});

// Initialize background when the page loads
document.addEventListener('DOMContentLoaded', () => {
    addBackgroundAnimations();
    createThemeAwareBackground();
});
