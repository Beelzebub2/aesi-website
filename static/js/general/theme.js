// Enhanced Theme Manager with Galaxy and Grass themes
const ThemeManager = {
    themes: {
        light: {
            name: 'Grass Theme',
            icon: 'fas fa-seedling',
            description: 'Natural grass-inspired light theme'
        },
        dark: {
            name: 'Galaxy Theme',
            icon: 'fas fa-moon',
            description: 'Cosmic galaxy-inspired dark theme'
        }
    },

    createLoadingOverlay() {
        if (document.getElementById('theme-loading-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'theme-loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spiral-container">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="loading-text">Switching theme...</div>
            </div>
        `;

        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Add CSS for the loading animation
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                text-align: center;
                color: white;
            }
            
            .spiral-container {
                --size: 60px;
                --color: #4CAF50;
                --speed: 0.9s;
                --center: calc(var(--size) / 2 - var(--size) / 5 / 2);
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: var(--size);
                width: var(--size);
                margin-bottom: 20px;
                animation: rotate calc(var(--speed) * 3) linear infinite;
            }
            
            .spiral-container .dot {
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                height: 100%;
                width: 100%;
            }
            
            .spiral-container .dot::before {
                content: '';
                height: 20%;
                width: 20%;
                border-radius: 50%;
                background-color: var(--color);
                animation: oscillate var(--speed) ease-in-out infinite alternate;
                transition: background-color 0.3s ease;
            }
            
            .spiral-container .dot:nth-child(1)::before {
                transform: translateX(var(--center));
            }
            
            .spiral-container .dot:nth-child(2) {
                transform: rotate(45deg);
            }
            
            .spiral-container .dot:nth-child(2)::before {
                transform: translateX(var(--center));
                animation-delay: calc(var(--speed) * -0.125);
            }
            
            .spiral-container .dot:nth-child(3) {
                transform: rotate(90deg);
            }
            
            .spiral-container .dot:nth-child(3)::before {
                transform: translateX(var(--center));
                animation-delay: calc(var(--speed) * -0.25);
            }
            
            .spiral-container .dot:nth-child(4) {
                transform: rotate(135deg);
            }
            
            .spiral-container .dot:nth-child(4)::before {
                transform: translateX(var(--center));
                animation-delay: calc(var(--speed) * -0.375);
            }
            
            .spiral-container .dot:nth-child(5) {
                transform: rotate(180deg);
            }
            
            .spiral-container .dot:nth-child(5)::before {
                transform: translateX(var(--center));
                animation-delay: calc(var(--speed) * -0.5);
            }
            
            .spiral-container .dot:nth-child(6) {
                transform: rotate(225deg);
            }
            
            .spiral-container .dot:nth-child(6)::before {
                transform: translateX(var(--center));
                animation-delay: calc(var(--speed) * -0.625);
            }
            
            .spiral-container .dot:nth-child(7) {
                transform: rotate(270deg);
            }
            
            .spiral-container .dot:nth-child(7)::before {
                transform: translateX(var(--center));
                animation-delay: calc(var(--speed) * -0.75);
            }
            
            .spiral-container .dot:nth-child(8) {
                transform: rotate(315deg);
            }
            
            .spiral-container .dot:nth-child(8)::before {
                transform: translateX(var(--center));
                animation-delay: calc(var(--speed) * -0.875);
            }
            
            @keyframes oscillate {
                0% {
                    transform: translateX(var(--center)) scale(0);
                    opacity: 0.25;
                }
                100% {
                    transform: translateX(0) scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes rotate {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            
            .loading-text {
                font-size: 16px;
                font-weight: 500;
                opacity: 0.9;
            }
            
            /* Theme-specific spinner colors */
            [data-theme="dark"] .spiral-container {
                --color: #2196F3;
            }
            
            [data-theme="light"] .spiral-container {
                --color: #4CAF50;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);
    },

    showLoadingOverlay() {
        const overlay = document.getElementById('theme-loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            // Force reflow then show
            overlay.offsetHeight;
            overlay.style.opacity = '1';
        }
    },

    hideLoadingOverlay() {
        const overlay = document.getElementById('theme-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    },

    animateThemeTransition(fromTheme, toTheme, callback) {
        // Show loading overlay
        this.showLoadingOverlay();

        // Wait a bit to show the loading animation, then apply theme changes
        setTimeout(() => {
            callback();

            // Wait for theme to fully apply, then hide loading
            setTimeout(() => {
                this.hideLoadingOverlay();
            }, 500);
        }, 800);
    },

    updateThemeIcon(theme, themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (!icon) return;

        // Add transition effect to icon change
        icon.style.transform = 'scale(0.8) rotate(180deg)';
        icon.style.opacity = '0.5';

        setTimeout(() => {
            if (theme === 'dark') {
                icon.className = 'fas fa-seedling'; // Show grass icon in galaxy theme
            } else {
                icon.className = 'fas fa-moon'; // Show moon icon in grass theme
            }

            icon.style.transform = 'scale(1) rotate(0deg)';
            icon.style.opacity = '1';
        }, 200);
    },

    dispatchThemeEvents(theme) {
        const events = [
            new CustomEvent('data-theme-changed', {
                detail: {
                    theme,
                    themeData: this.themes[theme],
                    timestamp: Date.now()
                }
            }),
            new CustomEvent('themeChanged', {
                detail: {
                    theme,
                    themeData: this.themes[theme]
                }
            })
        ];

        events.forEach(event => {
            document.documentElement.dispatchEvent(event);
            document.dispatchEvent(event);
        });
    },

    addThemeAccessibility(themeToggle, theme) {
        const themeData = this.themes[theme];
        themeToggle.setAttribute('aria-label', `Switch to ${this.themes[theme === 'light' ? 'dark' : 'light'].name}`);
        themeToggle.setAttribute('title', `Current: ${themeData.name}. Click to switch theme.`);
    }, init() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const htmlElement = document.documentElement;

        // Create loading overlay
        this.createLoadingOverlay();

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme, themeToggle);
        this.addThemeAccessibility(themeToggle, savedTheme);

        // Add CSS transition class to icon
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.style.transition = 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
        }

        // Enhanced theme toggle with smooth animations
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Trigger enhanced animation
            this.animateThemeTransition(currentTheme, newTheme, () => {
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme, themeToggle);
                this.addThemeAccessibility(themeToggle, newTheme);
                this.dispatchThemeEvents(newTheme);
            });
        });

        // Add hover effects to theme toggle
        themeToggle.addEventListener('mouseenter', () => {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(15deg)';
            }
        });

        themeToggle.addEventListener('mouseleave', () => {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    },

    // Method to apply theme without waiting for DOMContentLoaded
    // This prevents flash of wrong theme
    applyThemeImmediately() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
};

// Apply theme immediately to prevent flashing
ThemeManager.applyThemeImmediately();

// Initialize ThemeManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
