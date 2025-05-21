// Theme toggle functionality with performance optimizations
const ThemeManager = {
    createOverlay() {
        if (document.getElementById('theme-transition-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'theme-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0);
            pointer-events: none;
            transition: background-color 0.3s ease;
            z-index: 9999;
        `;
        document.body.appendChild(overlay);
    },

    animateThemeChange(callback) {
        const overlay = document.getElementById('theme-transition-overlay');
        if (!overlay) return callback();

        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        setTimeout(() => {
            callback();
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }, 200);
    },

    init() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const htmlElement = document.documentElement;

        // Create theme transition overlay
        this.createOverlay();

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme, themeToggle);

        // Toggle theme with optimized event handling and animation
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Trigger animation
            this.animateThemeChange(() => {
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme, themeToggle);

                // Dispatch theme change events
                const events = ['data-theme-changed', 'themeChanged'];
                events.forEach(eventName => {
                    const event = new CustomEvent(eventName, { detail: { theme: newTheme } });
                    htmlElement.dispatchEvent(event);
                });
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
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }
});
