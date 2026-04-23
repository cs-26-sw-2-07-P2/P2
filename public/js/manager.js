import { renderNavbar } from "./components/navbar.js";
import { renderQuestionnairePage } from "./questionnaire.js";
import { renderDepartmentsPage } from "./departments.js";
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
      app.innerHTML = `<h1>Welcome USERNAME</h1>
      <p>Welcome to your manager dashboard. Here you can manage your tasks, teams and questionnaires.</p>
      <p>Use the navigation bar above to access different sections of the dashboard.</p>`;
      break;

    case "tasks":
      renderTasks();
      break;

    case "departments":
      renderDepartmentsPage(app);
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
    <p>Here you are able to manage tasks and assign them to Teams.</p>
    <p>Use the buttons below to create, edit and view tasks.</p>

    <button id="createTask">Create New Task</button>
    <button id="editTask">Edit Existing Tasks</button>
    <button id="viewTask">Task Overview</button>
    <button id="viewCompletedTasks">View Completed Tasks</button>
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