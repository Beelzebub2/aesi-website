// Mobile navigation functionality
document.addEventListener('DOMContentLoaded', function () {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const sideMenuClose = document.querySelector('.side-menu-close');
    const backdrop = document.querySelector('.side-menu-backdrop');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const sideMenuNav = document.querySelector('.side-menu-nav');

    // Clone navigation links to side menu
    if (navLinksContainer && sideMenuNav) {
        const navLinks = navLinksContainer.querySelector('.nav-links');
        if (navLinks) {
            // Create a copy of the navigation
            const mobileNavLinks = navLinks.cloneNode(true);

            // Make sure it has the right classes and styling
            mobileNavLinks.classList.add('nav-links');

            // Add to side menu
            sideMenuNav.appendChild(mobileNavLinks);

            // Add click handler to close menu when a link is clicked
            const links = mobileNavLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', function () {
                    closeSideMenu();
                });
            });
        } else {
            // If there are no navigation links, add some default ones
            sideMenuNav.innerHTML = `
                <ul class="nav-links">
                    <li><a href="/"><i class="fas fa-home"></i> ${window.translations?.general?.home || 'Início'}</a></li>
                    <li><a href="/probabilidade"><i class="fas fa-chart-line"></i> ${window.translations?.subjects?.probabilidade?.name || 'Probabilidade'}</a></li>
                </ul>
            `;
        }
    }

    function openSideMenu() {
        sideMenu.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSideMenu() {
        sideMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileNavToggle?.addEventListener('click', openSideMenu);
    sideMenuClose?.addEventListener('click', closeSideMenu);
    backdrop?.addEventListener('click', closeSideMenu);

    // Make mobile theme toggle work the same as desktop
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggleMobile && themeToggle) {
        themeToggleMobile.addEventListener('click', function () {
            themeToggle.click(); // Trigger the main theme toggle

            // Sync the icon
            const themeIcon = themeToggle.querySelector('i');
            const mobileThemeIcon = themeToggleMobile.querySelector('i');

            if (themeIcon && mobileThemeIcon) {
                mobileThemeIcon.className = themeIcon.className;
            }
        });
    }

    // Close side menu on window resize if it becomes larger than mobile breakpoint
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && sideMenu.classList.contains('active')) {
            closeSideMenu();
        }
    });
});
