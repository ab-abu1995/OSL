// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard initialized');

    /* =======================
       DOM ELEMENTS
    ======================== */
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const profileToggle = document.getElementById('profileToggle');
    const profilePanel = document.getElementById('profilePanel');
    const profileClose = document.getElementById('profileClose');
    const profileOverlay = document.getElementById('profileOverlay');
    const logoutBtn = document.getElementById('logoutBtn');
    const notificationBtn = document.querySelector('.notification-btn');
    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.getElementById('mainContent'); // Changed from dashboardContent

    /* =======================
       MOBILE CHECK
    ======================== */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    /* =======================
       SIDEBAR INIT
    ======================== */
    function initSidebar() {
        if (isMobile()) {
            sidebar.style.left = '-250px';
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            menuToggle.style.display = 'flex';
        } else {
            sidebar.style.left = '0';
            sidebar.classList.add('active');
            menuToggle.style.display = 'none';
            document.body.classList.remove('sidebar-open');
        }
    }

    /* =======================
       SIDEBAR TOGGLE (MOBILE)
    ======================== */
    menuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!isMobile()) return;

        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            sidebar.style.left = '-250px';
            document.body.classList.remove('sidebar-open');
        } else {
            sidebar.classList.add('active');
            sidebar.style.left = '0';
            document.body.classList.add('sidebar-open');
            closeProfilePanel();
        }
    });

    sidebarClose.addEventListener('click', function () {
        if (isMobile()) {
            sidebar.classList.remove('active');
            sidebar.style.left = '-250px';
            document.body.classList.remove('sidebar-open');
        }
    });

    /* =======================
       PAGE LOADER
    ======================== */
    function loadPage(page) {
        if (!mainContent) {
            console.error('mainContent element not found');
            return;
        }

        // Add loading state
        mainContent.classList.add('loading');
        mainContent.style.opacity = '0.5';

        fetch(page)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to load page: ${res.status}`);
                }
                return res.text();
            })
            .then(html => {
                setTimeout(() => {
                    mainContent.innerHTML = html;
                    mainContent.style.opacity = '1';
                    mainContent.classList.remove('loading');
                    
                    // Initialize any scripts in the loaded page if needed
                    initLoadedPage();
                }, 200);
            })
            .catch(err => {
                console.error('Error loading page:', err);
                mainContent.innerHTML = 
                    `<div class="error-message" style="padding: 2rem; text-align: center;">
                        <h3 style="color: var(--danger); margin-bottom: 1rem;">Page Not Found</h3>
                        <p style="color: var(--gray-600);">Unable to load "${page}". Please try again later.</p>
                        <button onclick="loadDefaultPage()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-blue); color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Return to Dashboard
                        </button>
                    </div>`;
                mainContent.style.opacity = '1';
                mainContent.classList.remove('loading');
            });
    }

    function initLoadedPage() {
        // This function can be used to initialize any JavaScript
        // that needs to run on the loaded page
        console.log('Page loaded and initialized');
        
        // Add event listeners for any interactive elements in the loaded page
        const interactiveElements = mainContent.querySelectorAll('button, [data-action]');
        if (interactiveElements.length > 0) {
            console.log(`Found ${interactiveElements.length} interactive elements in loaded page`);
        }
    }

    function loadDefaultPage() {
        const defaultPage = 'pages/dashboard-home.html';
        const defaultNavItem = document.querySelector(`.nav-item[data-page="${defaultPage}"]`);
        
        if (defaultNavItem) {
            defaultNavItem.click();
        } else {
            loadPage(defaultPage);
        }
    }

    /* =======================
       NAVIGATION CLICK
    ======================== */
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Load page if exists
            const page = this.getAttribute('data-page');
            if (page) {
                loadPage(page);
                
                // Update browser history
                history.pushState({ page: page }, '', `#${page}`);
            }

            // Close sidebar on mobile
            if (isMobile()) {
                setTimeout(() => {
                    sidebar.classList.remove('active');
                    sidebar.style.left = '-250px';
                    document.body.classList.remove('sidebar-open');
                }, 300);
            }
        });
    });

    /* =======================
       BROWSER HISTORY SUPPORT
    ======================== */
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
            
            // Update active nav item
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === event.state.page) {
                    item.classList.add('active');
                }
            });
        }
    });

    /* =======================
       NOTIFICATIONS
    ======================== */
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            // Create a simple notification dropdown
            const notificationPanel = document.createElement('div');
            notificationPanel.className = 'notification-panel';
            notificationPanel.innerHTML = `
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <button class="close-notifications">&times;</button>
                </div>
                <div class="notification-list">
                    <div class="notification-item">
                        <i class="fas fa-check-circle" style="color: var(--success);"></i>
                        <div class="notification-text">
                            <strong>Payment Received</strong>
                            <p>Your savings deposit has been processed.</p>
                            <small>2 hours ago</small>
                        </div>
                    </div>
                    <div class="notification-item">
                        <i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i>
                        <div class="notification-text">
                            <strong>Loan Payment Due</strong>
                            <p>Your next loan payment is due in 3 days.</p>
                            <small>Yesterday</small>
                        </div>
                    </div>
                    <div class="notification-item">
                        <i class="fas fa-info-circle" style="color: var(--primary-blue);"></i>
                        <div class="notification-text">
                            <strong>System Maintenance</strong>
                            <p>Scheduled maintenance on Saturday, 2 AM - 4 AM.</p>
                            <small>2 days ago</small>
                        </div>
                    </div>
                </div>
            `;
            
            // Position and show the notification panel
            const rect = notificationBtn.getBoundingClientRect();
            notificationPanel.style.position = 'fixed';
            notificationPanel.style.top = rect.bottom + 'px';
            notificationPanel.style.right = '20px';
            notificationPanel.style.background = 'white';
            notificationPanel.style.border = '1px solid var(--gray-200)';
            notificationPanel.style.borderRadius = '8px';
            notificationPanel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            notificationPanel.style.zIndex = '1000';
            notificationPanel.style.width = '320px';
            notificationPanel.style.maxHeight = '400px';
            notificationPanel.style.overflow = 'auto';
            
            document.body.appendChild(notificationPanel);
            
            // Close button functionality
            notificationPanel.querySelector('.close-notifications').addEventListener('click', function() {
                document.body.removeChild(notificationPanel);
            });
            
            // Close when clicking outside
            setTimeout(() => {
                const closeOnClickOutside = function(e) {
                    if (!notificationPanel.contains(e.target) && e.target !== notificationBtn) {
                        document.body.removeChild(notificationPanel);
                        document.removeEventListener('click', closeOnClickOutside);
                    }
                };
                document.addEventListener('click', closeOnClickOutside);
            }, 100);
        });
    }

    /* =======================
       PROFILE PANEL
    ======================== */
    function openProfilePanel() {
        profilePanel.classList.add('active');
        profileOverlay.classList.add('active');

        if (isMobile() && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            sidebar.style.left = '-250px';
            document.body.classList.remove('sidebar-open');
        }
    }

    function closeProfilePanel() {
        profilePanel.classList.remove('active');
        profileOverlay.classList.remove('active');
    }

    profileToggle.addEventListener('click', openProfilePanel);
    profileClose.addEventListener('click', closeProfilePanel);
    profileOverlay.addEventListener('click', closeProfilePanel);

    /* =======================
       OUTSIDE CLICK (MOBILE)
    ======================== */
    document.addEventListener('click', function (e) {
        if (
            isMobile() &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            sidebar.classList.remove('active');
            sidebar.style.left = '-250px';
            document.body.classList.remove('sidebar-open');
        }
    });

    /* =======================
       LOGOUT
    ======================== */
    logoutBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to logout?')) {
            // Show logout animation/loading
            const logoutBtnText = logoutBtn.innerHTML;
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
            logoutBtn.disabled = true;
            
            // Simulate logout process
            setTimeout(() => {
                alert('You have been logged out successfully.');
                // In a real application, you would redirect to login page:
                // window.location.href = 'login.html';
                
                // Reset button state (for demo purposes)
                logoutBtn.innerHTML = logoutBtnText;
                logoutBtn.disabled = false;
                closeProfilePanel();
            }, 1500);
        }
    });

    /* =======================
       WINDOW RESIZE
    ======================== */
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            initSidebar();
            closeProfilePanel();
        }, 250);
    });

    /* =======================
       KEYBOARD SHORTCUTS
    ======================== */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (isMobile() && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                sidebar.style.left = '-250px';
                document.body.classList.remove('sidebar-open');
            }
            closeProfilePanel();
            
            // Also close any notification panels
            const notificationPanel = document.querySelector('.notification-panel');
            if (notificationPanel) {
                document.body.removeChild(notificationPanel);
            }
        }
        
        // Ctrl/Cmd + 1-5 for navigation shortcuts
        if (e.ctrlKey || e.metaKey) {
            const key = parseInt(e.key);
            if (key >= 1 && key <= 5) {
                e.preventDefault();
                const navItem = document.querySelectorAll('.nav-item')[key - 1];
                if (navItem) {
                    navItem.click();
                }
            }
        }
    });

    /* =======================
       INITIALIZATION
    ======================== */
    function initializeDashboard() {
        initSidebar();
        
        // Load default dashboard page
        const defaultPage = 'pages/dashboard-home.html';
        const activeNavItem = document.querySelector('.nav-item.active');
        
        if (activeNavItem && activeNavItem.getAttribute('data-page')) {
            loadPage(activeNavItem.getAttribute('data-page'));
        } else {
            loadPage(defaultPage);
        }
        
        // Initialize with browser history state if available
        if (window.location.hash) {
            const pageFromHash = window.location.hash.substring(1);
            if (pageFromHash) {
                const navItemForHash = document.querySelector(`.nav-item[data-page="${pageFromHash}"]`);
                if (navItemForHash) {
                    navItemForHash.click();
                }
            }
        }
    }

    // Initialize the dashboard
    initializeDashboard();

    console.log('Dashboard fully functional');
});

// Add global function for error page button
window.loadDefaultPage = function() {
    document.dispatchEvent(new Event('DOMContentLoaded'));
};