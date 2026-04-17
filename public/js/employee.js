import { renderNavbar } from "./components/NavBar.js";
import { logout } from "./components/logout.js";

let app;
let navbarContainer;

document.addEventListener("DOMContentLoaded", () => {
  app = document.getElementById("app");
  navbarContainer = document.getElementById("navbar");

  const navbar = renderNavbar("manager", navigate);
  navbarContainer.appendChild(navbar);

  document.addEventListener("click", (e) => {
    if (e.target.id === "logout") logout();
  });

  navigate("home");
});

function navigate(route) {
  render(route);
}

function render(route) {
  switch (route) {
    case "home":
      app.innerHTML = `
        <h1>Welcome employee</h1>
        <div id="containerOngoing"></div>
        <div id="containerCompleted"></div>
      `;
      renderTasks();
      break;

    case "questionnaires":
      app.innerHTML = `<h1>Questionnaires</h1>`;
      break;

    case "team":
      app.innerHTML = `<h1>Your Team</h1>`;
      break;

    default: // if no route found
      app.innerHTML = `<h1>404</h1>`;
  }
}

function renderTasks() {
  const ongoing = document.getElementById("containerOngoing");
  const completed = document.getElementById("containerCompleted");

  for (let i = 0; i < 3; i++) {
    const div = document.createElement("div");
    div.className = "boxOngoing";
    div.textContent = "Task " + i;
    ongoing.appendChild(div);
  }

  for (let i = 0; i < 7; i++) {
    const div = document.createElement("div");
    div.className = "boxCompleted";
    div.textContent = "Completed " + i;
    completed.appendChild(div);
  }
}