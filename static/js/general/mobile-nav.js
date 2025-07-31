// Mobile navigation functionality
document.addEventListener('DOMContentLoaded', function () {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sideMenu = document.querySelector('.side-menu');
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
            sideMenuNav.appendChild(mobileNavLinks);            // Highlight current page
            const currentPath = window.location.pathname;
            console.log("Mobile menu - current path:", currentPath);
            const mobileLinks = mobileNavLinks.querySelectorAll('a');

            // First, remove any existing active classes (in case they were cloned)
            mobileLinks.forEach(link => link.classList.remove('active'));

            mobileLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                const linkText = link.textContent.trim();
                console.log("Checking mobile link:", linkHref, linkText);

                // For main homepage '/'
                if (currentPath === '/' && linkHref === '/') {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
                // For subject homepage (e.g. '/probabilidade')
                else if (linkText.includes(window.translations?.general?.home || 'Início') &&
                    currentPath === linkHref &&
                    currentPath !== '/') {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
                // For feature pages
                else if (linkHref !== '/' &&
                    currentPath.startsWith(linkHref) &&
                    !linkText.includes(window.translations?.general?.home || 'Início')) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }

                // Add click handler to close menu when a link is clicked
                link.addEventListener('click', function () {
                    closeSideMenu();
                });
            });
        } else {
            // If there are no navigation links, add some default ones
            const currentPath = window.location.pathname;
            const isHomePage = currentPath === '/';
            const isProbabilidadePage = currentPath.startsWith('/probabilidade') &&
                !currentPath.includes('/probabilidade/');

            sideMenuNav.innerHTML = `
                <ul class="nav-links">
                    <li><a href="/" ${isHomePage ? 'class="active" aria-current="page"' : ''}><i class="fas fa-home"></i> ${window.translations?.general?.home || 'Início'}</a></li>
                    <li><a href="/probabilidade" ${isProbabilidadePage ? 'class="active" aria-current="page"' : ''}><i class="fas fa-chart-line"></i> ${window.translations?.subjects?.probabilidade?.name || 'Probabilidade'}</a></li>
                </ul>
            `;

            // Add click handler to close menu when a link is clicked
            const defaultLinks = sideMenuNav.querySelectorAll('a');
            defaultLinks.forEach(link => {
                link.addEventListener('click', function () {
                    closeSideMenu();
                });
            });
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
