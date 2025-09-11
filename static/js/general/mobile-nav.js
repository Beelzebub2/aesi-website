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
                else if (currentPath === linkHref && currentPath !== '/') {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
                // For feature pages
                else if (linkHref !== '/' &&
                    currentPath.startsWith(linkHref)) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }

                // Add click handler to close menu when a link is clicked
                link.addEventListener('click', function () {
                    closeSideMenu();
                });
            });
        } else {
            // If there are no navigation links, build dynamic navigation from available subjects
            const currentPath = window.location.pathname;
            
            let navHTML = `<ul class="nav-links">`;
            
            // Add all available subjects dynamically
            if (window.translations?.subjects) {
                // Sort subjects alphabetically by name
                const sortedSubjects = Object.keys(window.translations.subjects)
                    .sort((a, b) => {
                        const nameA = window.translations.subjects[a].name || '';
                        const nameB = window.translations.subjects[b].name || '';
                        return nameA.localeCompare(nameB);
                    });
                
                sortedSubjects.forEach(subjectId => {
                    const subject = window.translations.subjects[subjectId];
                    const isSubjectPage = currentPath.startsWith(`/${subjectId}`) && !currentPath.includes(`/${subjectId}/`);
                    const subjectIcon = subject.icon || 'fa-chart-line';
                    
                    navHTML += `<li><a href="/${subjectId}" ${isSubjectPage ? 'class="active" aria-current="page"' : ''}><i class="fas ${subjectIcon}"></i> ${subject.name}</a></li>`;
                });
            }
            
            navHTML += `</ul>`;
            sideMenuNav.innerHTML = navHTML;

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

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        // Close menu with Escape key
        if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeSideMenu();
        }

        // Open menu with Ctrl+M (accessibility shortcut)
        if (e.ctrlKey && e.key === 'm' && window.innerWidth <= 768) {
            e.preventDefault();
            if (sideMenu.classList.contains('active')) {
                closeSideMenu();
            } else {
                openSideMenu();
            }
        }
    });

    // Add focus trap for better accessibility
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function handleTabKey(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }

        element.addEventListener('keydown', handleTabKey);
        return function () {
            element.removeEventListener('keydown', handleTabKey);
        };
    }

    // Apply focus trap when menu opens
    let removeFocusTrap;
    function openSideMenu() {
        sideMenu.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus the first link for accessibility
        const firstLink = sideMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }

        // Add focus trap
        removeFocusTrap = trapFocus(sideMenu);
    }

    function closeSideMenu() {
        sideMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';

        // Remove focus trap
        if (removeFocusTrap) {
            removeFocusTrap();
        }

        // Return focus to toggle button
        if (mobileNavToggle) {
            mobileNavToggle.focus();
        }
    }

    mobileNavToggle?.addEventListener('click', openSideMenu);
    backdrop?.addEventListener('click', closeSideMenu);

    // Close side menu on window resize if it becomes larger than mobile breakpoint
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && sideMenu.classList.contains('active')) {
            closeSideMenu();
        }
    });
});
