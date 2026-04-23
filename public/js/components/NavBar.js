const NAVBAR_CONFIG = {
  employee: {
    links: [
      { text: 'Home', route: 'home' },
      { text: 'Questionnaires', route: 'questionnaires' },
      { text: 'Team', route: 'team' },
    ],
  },
  manager: {
    links: [
      { text: 'Home', route: 'home' },
      { text: 'Tasks', route: 'tasks' },
      { text: 'Departments', route: 'departments' },
      { text: 'Questionnaires', route: 'questionnaires' },
    ],
  },
};

export function renderNavbar(role, navigate) {
  const config = NAVBAR_CONFIG[role];

  const navbar = document.createElement("div");
  navbar.className = "topnav";

  config.links.forEach(link => {
    const a = document.createElement("a");
    a.textContent = link.text;

    a.addEventListener("click", () => {
      navigate(link.route);
    });

    navbar.appendChild(a);
  });

  const logoutBtn = document.createElement("a");
  logoutBtn.textContent = "Logout";
  logoutBtn.id = "logout";

  navbar.appendChild(logoutBtn);

  return navbar;
}