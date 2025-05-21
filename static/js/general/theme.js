// Theme toggle functionality with performance optimizations
const ThemeManager = {
    init() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const htmlElement = document.documentElement;

        // Create theme transition overlay
        this.createOverlay();

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme, themeToggle);        // Toggle theme with optimized event handling and animation
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Trigger animation
            this.animateThemeChange(() => {
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme, themeToggle);

                // Dispatch theme change event
                const event = new CustomEvent('data-theme-changed', { detail: { theme: newTheme } });
                htmlElement.dispatchEvent(event);
            });
        });
    },

    updateThemeIcon(theme, themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (!icon) return;

        // Update icon classes efficiently
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    },    // Method to apply theme without waiting for DOMContentLoaded
    // This prevents flash of wrong theme
    applyThemeImmediately() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    },

    createOverlay() {
        if (!document.querySelector('.theme-transition-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'theme-transition-overlay';
            document.body.appendChild(overlay);
        }
    },

    animateThemeChange(callback) {
        const overlay = document.querySelector('.theme-transition-overlay');
        if (!overlay) return callback();

        // Start animation
        overlay.classList.add('active');

        // Add a slight rotation to the theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 500);
        }

        // Execute theme change halfway through the animation
        setTimeout(() => {
            callback();

            // End animation
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 250);
        }, 250);
    }
};

// Apply theme immediately to prevent flashing
ThemeManager.applyThemeImmediately();

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
