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
    const numStars = 200;
    const numNebulas = 12;
    const numStarDust = 15; // Changed to star dust particles

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
            animation: cosmicTwinkle ${Math.random() * 4 + 2}s ease-in-out infinite,
                       starFloat ${Math.random() * 20 + 15}s linear infinite;
            animation-delay: ${Math.random() * 3}s, ${Math.random() * 10}s;
            box-shadow: 0 0 ${size * 2}px rgba(240, 246, 252, 0.8);
        `;
        container.appendChild(star);
    }    // Create star dust particles
    for (let i = 0; i < numStarDust; i++) {
        const starDust = document.createElement('div');
        starDust.className = 'star-dust';
        const size = Math.random() * 2 + 1;
        starDust.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -20px;
            width: ${size}px;
            height: ${size}px;
            background: #F0F6FC;
            border-radius: 50%;
            animation: starDustFall ${Math.random() * 8 + 12}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            opacity: ${Math.random() * 0.6 + 0.3};
            box-shadow: 0 0 ${size * 3}px rgba(240, 246, 252, 0.4);
        `;
        container.appendChild(starDust);
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
    const numLeaves = 25; // Falling leaves
    const numFlowers = 15; // Falling flowers
    const numStaticFlowers = 20; // Static flowers    // Create floating leaves with enhanced movement
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
            background: linear-gradient(45deg, #4CAF50, #81C784, #A5D6A7);
            border-radius: 0 100% 0 100%;
            animation: leafFall ${Math.random() * 8 + 12}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            opacity: 0.8;
            transform-origin: center;
        `;
        container.appendChild(leaf);
    }    // Create static flower accents
    for (let i = 0; i < numStaticFlowers; i++) {
        const flower = document.createElement('div');
        flower.className = 'nature-flower';
        const colors = ['#FF7043', '#FFA726', '#FF8A65', '#FFAB40', '#FF6F00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 18 + 10;

        flower.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${color}, ${color}80);
            border-radius: 50%;
            animation: flowerGlow ${Math.random() * 10 + 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            opacity: 0.8;
        `;

        // Add petals effect
        flower.innerHTML = `
            <div style="position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; 
                        background: radial-gradient(circle, ${color}40, transparent); 
                        border-radius: 50%; animation: petalSway 4s ease-in-out infinite;"></div>
        `;
        container.appendChild(flower);
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
            animation: flowerFall ${Math.random() * 6 + 10}s linear infinite;
            animation-delay: ${Math.random() * 8}s;
            box-shadow: 0 0 4px ${color}80;
        `;
        container.appendChild(fallingFlower);
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
            25% { opacity: 0.8; transform: scale(1.3); }
            50% { opacity: 1; transform: scale(1.5); }
            75% { opacity: 0.6; transform: scale(1.2); }
        }
        
        @keyframes starFloat {
            0% { transform: translateX(0) translateY(0) rotate(0deg); }
            25% { transform: translateX(10px) translateY(-5px) rotate(90deg); }
            50% { transform: translateX(-5px) translateY(8px) rotate(180deg); }
            75% { transform: translateX(-8px) translateY(-3px) rotate(270deg); }
            100% { transform: translateX(0) translateY(0) rotate(360deg); }
        }        @keyframes starDustFall {
            0% { 
                transform: translateX(0) translateY(0) rotate(0deg); 
                opacity: 0; 
            }
            10% { 
                opacity: 0.8; 
            }
            90% { 
                opacity: 0.6; 
            }
            100% { 
                transform: translateX(15px) translateY(100vh) rotate(180deg); 
                opacity: 0; 
            }
        }
        
        .star-trail {
            position: absolute;
            width: 30px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #F0F6FC, transparent);
            transform: rotate(45deg);
            transform-origin: left;
            opacity: 0.7;
        }
        
        @keyframes nebulaFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0.3; }
            25% { transform: translate(30px, -15px) rotate(90deg) scale(1.1); opacity: 0.6; }
            50% { transform: translate(-20px, 20px) rotate(180deg) scale(0.9); opacity: 0.4; }
            75% { transform: translate(-25px, -10px) rotate(270deg) scale(1.05); opacity: 0.5; }
        }
          @keyframes leafFall {
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
                transform: translateX(30px) translateY(100vh) rotate(180deg); 
                opacity: 0; 
            }
        }
        
        @keyframes flowerFall {
            0% { 
                transform: translateX(0) translateY(0) rotate(0deg); 
                opacity: 0; 
            }
            10% { 
                opacity: 0.9; 
            }
            90% { 
                opacity: 0.9; 
            }
            100% { 
                transform: translateX(20px) translateY(100vh) rotate(360deg); 
                opacity: 0; 
            }
        }
        
        @keyframes flowerGlow {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            33% { opacity: 1; transform: scale(1.2) rotate(120deg); }
            66% { opacity: 0.8; transform: scale(1.1) rotate(240deg); }
        }
          @keyframes petalSway {
            0%, 100% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(5deg) scale(1.05); }
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
