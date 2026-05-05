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
      { text: "Parameters", route: "parameters" },
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

  const left = document.createElement("div");
  left.className = "nav-left";

  config.links.forEach(link => {
    const a = document.createElement("a");
    a.textContent = link.text;

    a.addEventListener("click", () => {
      document.querySelectorAll(".nav-left a").forEach(el => el.classList.remove("active"));
      a.classList.add("active");
      navigate(link.route);
    });

    left.appendChild(a);
  });

  // RIGHT SIDE (user + logout)
  const right = document.createElement("div");
  right.className = "nav-right";

  const userInfo = document.createElement("span");
  userInfo.className = "nav-user";
  userInfo.textContent = `${user.username} (${user.role})`;

  const logoutBtn = document.createElement("button");
  logoutBtn.className = "btn-logout";
  logoutBtn.textContent = "Logout";

  logoutBtn.addEventListener("click", async () => {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/";
  });

  right.appendChild(userInfo);
  right.appendChild(logoutBtn);

  navbar.appendChild(left);
  navbar.appendChild(right);

  return navbar;
}