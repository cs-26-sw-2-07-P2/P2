import { renderNavbar } from "./components/navbar.js";
import { renderQuestionnairePage } from "./questionnaire.js";
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
      app.innerHTML = `<h1>Manager Dashboard</h1>`;
      break;

    case "tasks":
      renderTasks();
      break;

    case "teams":
      renderTeams();
      break;

    case "questionnaires":
      renderQuestionnairePage(app);
      break;

    default: // if no route found
      app.innerHTML = `<h1>404</h1>`;
  }
}

function renderTasks() {
  app.innerHTML = `
    <h1>Task Management</h1>
    <p>Here you can manage tasks.</p>

    <button id="createTask">Create New Task</button>
    <button id="editTask">Edit Existing Tasks</button>
    <button id="viewTask">Task Overview</button>
  `;

  document.getElementById("createTask").onclick = () => {
    console.log("Create Task");
  };

  document.getElementById("editTask").onclick = () => {
    console.log("Edit Task");
  };

  document.getElementById("viewTask").onclick = () => {
    console.log("View Tasks");
  };
}

function renderTeams() {
  app.innerHTML = `
    <h1>Team Management</h1>
    <p>Manage your teams here.</p>

    <button id="createTeam">Create New Team</button>
    <button id="editTeam">Edit Teams</button>
    <button id="viewTeams">Team Overview</button>
  `;

  document.getElementById("createTeam").onclick = () => {
    console.log("Create Team");
  };

  document.getElementById("editTeam").onclick = () => {
    console.log("Edit Team");
  };

  document.getElementById("viewTeams").onclick = () => {
    console.log("View Teams");
  };
}