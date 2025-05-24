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

    createThemeTransition() {
        if (document.getElementById('theme-transition-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'theme-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            pointer-events: none;
            transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
            z-index: 9999;
            backdrop-filter: blur(0px);
        `;
        document.body.appendChild(overlay);
    },

    animateThemeTransition(fromTheme, toTheme, callback) {
        const overlay = document.getElementById('theme-transition-overlay');
        if (!overlay) return callback();

        // Different transition effects for different theme switches
        if (fromTheme === 'light' && toTheme === 'dark') {
            // Grass to Galaxy: Fade to starry night
            overlay.style.background = 'radial-gradient(circle, #0D1117 0%, #161B22 100%)';
            overlay.style.backdropFilter = 'blur(10px)';
        } else if (fromTheme === 'dark' && toTheme === 'light') {
            // Galaxy to Grass: Fade to morning light
            overlay.style.background = 'radial-gradient(circle, #E8F5E8 0%, #F1F8E9 100%)';
            overlay.style.backdropFilter = 'blur(5px)';
        }

        setTimeout(() => {
            callback();

            // Fade out transition overlay
            overlay.style.background = 'transparent';
            overlay.style.backdropFilter = 'blur(0px)';
        }, 300);
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
    },

    init() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const htmlElement = document.documentElement;

        // Create enhanced theme transition overlay
        this.createThemeTransition();

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

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update icon in theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
}

// Apply theme immediately to prevent flashing
ThemeManager.applyThemeImmediately();

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return; // Safety check

    const themeIcon = themeToggle.querySelector('i');
    if (!themeIcon) return; // Safety check

    // Update icon based on current theme
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
});
