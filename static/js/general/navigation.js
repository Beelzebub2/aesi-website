// Navigation helpers for active page markers
document.addEventListener('DOMContentLoaded', function () {
    // Function to mark the correct navigation links as active
    function updateActiveNavLinks() {
        const currentPath = window.location.pathname;
        console.log('Navigation helper active on path:', currentPath);

        // Handle desktop navigation
        const desktopNavLinks = document.querySelectorAll('.navbar .nav-links li a');
        if (desktopNavLinks.length > 0) {
            // First remove all active classes
            desktopNavLinks.forEach(link => link.classList.remove('active'));

            // Handle specific pages
            desktopNavLinks.forEach(link => {
                const href = link.getAttribute('href');

                // For main homepage '/'
                if (currentPath === '/' && href === '/') {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
                // For subject homepage (e.g. '/probabilidade')
                else if (link.textContent.trim().includes('Início') &&
                    currentPath === href &&
                    currentPath !== '/') {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
                // For feature pages
                else if (href !== '/' &&
                    currentPath.startsWith(href) &&
                    !link.textContent.trim().includes('Início')) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    }

    // Update active links when page loads
    updateActiveNavLinks();

    // Update on navigation changes (if using client-side routing)
    window.addEventListener('popstate', updateActiveNavLinks);
});