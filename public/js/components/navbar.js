const NAVBAR_CONFIG = {
  EMPLOYEE: {
    links: [
      { text: "Home", route: "home" },
      { text: "Questionnaires", route: "questionnaires" },
      { text: "Team", route: "team" },
    ],
  },
  MANAGER: {
    links: [
      { text: "Home", route: "home" },
      { text: "Tasks", route: "tasks" },
      { text: "Departments", route: "departments" },
      { text: "Questionnaires", route: "questionnaires" },
    ],
  },
};

async function getCurrentUser() {
  const res = await fetch("/api/me");

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.user;
}

export async function renderNavbar(navigate) {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "/";
    return document.createElement("div");
  }

  const config = NAVBAR_CONFIG[user.role];

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

  logoutBtn.addEventListener("click", async () => {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/";
  });

  navbar.appendChild(logoutBtn);

  return navbar;
}