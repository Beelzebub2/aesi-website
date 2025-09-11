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
                <div class="simple-spinner"></div>
                <div class="loading-text">${window.translations?.general?.switching_theme || 'Switching theme...'}</div>
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

        // Add simple CSS for the loading animation
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                text-align: center;
                color: white;
            }
            
            .simple-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: simpleSpin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes simpleSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                font-size: 16px;
                font-weight: 500;
                opacity: 0.9;
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
    }
};

// Initialize ThemeManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
