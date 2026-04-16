/**
 * Global Navbar Component
 * Creates and manages the navigation bar across all pages
 */

// Navbar configuration - can be customized per page/role
const NAVBAR_CONFIG = {
  employee: {
    links: [
      { text: 'Home', href: '/employee' },
      { text: 'View Questionnaires', href: '/employee/questionnaires' },
      { text: 'View Your Team', href: '/employee/team' },
      { text: 'Contact Us', href: '#contact', position: 'right' },
      { text: 'About', href: '#about', position: 'right' },
    ],
  },
  manager: {
    links: [
      { text: 'Home', href: '/manager' },
      { text: 'Contact Us', href: '#contact', position: 'right' },
      { text: 'About', href: '#about', position: 'right' },
    ],
  },
  default: {
    links: [
      { text: 'Home', href: '#home' },
      { text: 'Contact Us', href: '#contact', position: 'right' },
      { text: 'About', href: '#about', position: 'right' },
    ],
  },
};

/**
 * Creates the navbar HTML structure
 * @param {string} role - The user role ('employee', 'manager', or 'default')
 * @returns {HTMLElement} The navbar element
 */
function createNavbar(role = 'default') {
  const config = NAVBAR_CONFIG[role] || NAVBAR_CONFIG.default;
  
  const navbar = document.createElement('div');
  navbar.className = 'topnav';
  
  let firstRightFound = false;
  config.links.forEach((link, index) => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.text;
    if (index === 0) {
      anchor.classList.add('active');
    }
    if (link.position === 'right' && !firstRightFound) {
      anchor.classList.add('right');
      firstRightFound = true;
    }
    navbar.appendChild(anchor);
  });
  
  // Add logout button
  const logoutBtn = document.createElement('a');
  logoutBtn.id = 'logout';
  logoutBtn.textContent = 'Log out';
  navbar.appendChild(logoutBtn);
  
  return navbar;
}

/**
 * Injects the navbar at the top of the page
 * @param {string} role - The user role ('employee', 'manager', or 'default')
 */
function injectNavbar(role = 'default') {
  const navbar = createNavbar(role);
  const body = document.body;
  body.insertBefore(navbar, body.firstChild);
}

/**
 * Replaces existing navbar with the global one
 * @param {string} role - The user role ('employee', 'manager', or 'default')
 */
function replaceNavbar(role = 'default') {
  const existingNavbar = document.querySelector('.topnav');
  if (existingNavbar) {
    const newNavbar = createNavbar(role);
    existingNavbar.replaceWith(newNavbar);
  } else {
    injectNavbar(role);
  }
}
