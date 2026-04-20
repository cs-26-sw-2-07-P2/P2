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
        <h1>Welcome USERNAME</h1>
        <p>This is your employee dashboard where you can view your tasks, team and questionnaires.</p>
        <p>Use the navigation bar above to access different sections of the dashboard.</p>

        <h3>On this page you can see an overview of your current tasks:</h3>
        <div id="containerOngoing"></div>
      `;
      renderTasks();
      break;

    case "tasks":
      app.innerHTML = `<h1>Your Tasks</h1>
      <p>Here you can view your tasks.</p>
      <p>Ongoing tasks are shown in green, completed tasks are shown in grey.</p>
      <div id="containerOngoing"></div>
      <div id="containerCompleted"></div>
      `;
      renderTasks();
      break;

    case "teams":
      app.innerHTML = `<h1>Your Team</h1>
      <p>Here you can view your assigned team.</p>
      <h4>Teamname: Team AAA</h4>
      <div id="containerTeam"></div>
      `;
      renderTeam();
      break;

    case "questionnaires":
      app.innerHTML = `<h1>Questionnaires</h1>
      <p>Here you can view and fill out your questionnaires.</p>`;
      break;

    default: // if no route found
      app.innerHTML = `<h1>404</h1>`;
  }
}

function renderTasks() {
  const ongoing = document.getElementById("containerOngoing");
  const completed = document.getElementById("containerCompleted");

  for (let i = 0; i < 2; i++) {
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

function renderTeam() {
  const teamContainer = document.getElementById("containerTeam");

  for (let i = 1; i < 6; i++) {
    const div = document.createElement("div");
    div.className = "boxTeam";
    div.textContent = "Team Member " + i;
    teamContainer.appendChild(div);
  }
}