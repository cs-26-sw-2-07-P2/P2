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
      app.innerHTML = `<h1>Welcome USERNAME</h1>
      <p>Welcome to your manager dashboard. Here you can manage your tasks, teams and questionnaires.</p>
      <p>Use the navigation bar above to access different sections of the dashboard.</p>`;
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
    <p>Here you are able to manage tasks and assign them to Teams.</p>
    <p>Use the buttons below to create, edit and view tasks.</p>

    <button id="createTask">Create New Task</button>
    <button id="taskOverview">View Ongoing and Overdue Tasks</button>
    <button id="completedTasks">View Completed Tasks</button>

    <div id="taskTable" style="margin-top: 20px; display: none;">
    <table>
        <tr>
            <th>Title</th><th>Description</th><th>Team</th><th>Deadline</th><th>Employees</th></tr>
      <tr>
        <th><input id="taskTitle" placeholder="Enter task title"/></th>
        <th><input id="taskDesc" placeholder="Enter task description"/></th>
        <!--Insert correct teams that have been made-->
        <th><select name="teams" id="managerTeams">
            <option value="choose">Select Team</option>
            <option value="cleaning">Cleaning</option>
            <option value="restaurant">Restaurant</option>
            <option value="parking">Parking</option>
        </select></th>
        <th><input type="date" value="2017-06-01" /></th>
        <th><input type="number" min="1"></th>
      </tr>      
    </table>
    <button id="submitTask">Submit Task</button></div>
  `;

  document.getElementById("createTask").onclick = () => {
    console.log("Create Task");
    document.getElementById("taskTable").style.display = "block";
    document.getElementById("taskTable").innerHTML =`
    <div id="taskTable" style="margin-top: 20px;">
    <table>
        <tr>
            <th>Title</th><th>Description</th><th>Team</th><th>Deadline</th><th>Employees</th></tr>
      <tr>
        <th><input id="taskTitle" placeholder="Enter task title"/></th>
        <th><input id="taskDesc" placeholder="Enter task description"/></th>
        <!--Insert correct teams that have been made-->
        <th><select name="teams" id="managerTeams">
            <option value="choose">Select Team</option>
            <option value="cleaning">Cleaning</option>
            <option value="restaurant">Restaurant</option>
            <option value="parking">Parking</option>
        </select></th>
        <th><input type="date" value="2017-06-01" /></th>
        <th><input type="number" min="1"></th>
      </tr>      
    </table>
    <button id="submitTask">Submit Task</button></div>
    `
    document.getElementById("submitTask").onclick = () => {
    console.log("Submitted.");
    document.getElementById("taskTable").style.display = "block";
    document.getElementById("taskTable").innerHTML =`
    `};
  };

  document.getElementById("taskOverview").onclick = () => {
    console.log("Edit Current Task");
      document.getElementById("taskTable").style.display = "block";
    document.getElementById("taskTable").innerHTML =`
      <h2>Your Tasks</h2>
      <p>Here you can view tasks belonging to every team you manage.</p>
      <p>Ongoing tasks are shown in green, overdue tasks are shown at the top in red.</p>
      <hr></hr>
      <div id="containerOverdue" class="alignItems"></div>
      <hr></hr>
      <div id="containerOngoing" class="alignItems"></div>`
    function generateTasks() {
    let overdueTasks = 1;
    let ongoingTasks = 2;
    const overdue = document.getElementById("containerOverdue");
    const ongoing = document.getElementById("containerOngoing");
        for (let i = 0; i < overdueTasks; i++) {
            const div = document.createElement("div");
            div.className = "boxOverdue";
            //Text Fields
            let title = "Overdue Task " + i;
            let description = "Lorem ipsum"
            let deadline = "Insert date here:"
            let team = "Team X"
            //final output
            div.innerHTML = `<div><b>${title}</b></div><br><br>${description}<br><br>${deadline}<br><br>${team}`;
            overdue.appendChild(div);
        }
        for (let i = 0; i < ongoingTasks; i++) {
            const div = document.createElement("div");
            div.className = "boxOngoing";
            //Text Fields
            let title = "Task Number " + i;
            let description = "Lorem ipsum"
            let deadline = "Insert date here:"
            let team = "Team X"
            //final output
            div.innerHTML = `<div><b>${title}</b></div><br><br>${description}<br><br>${deadline}<br><br>${team}`;
            ongoing.appendChild(div);
          }
        }
        generateTasks();
    };

  document.getElementById("completedTasks").onclick = () => {
    console.log("View Completed");
    document.getElementById("taskTable").style.display = "block";
    document.getElementById("taskTable").innerHTML =`
      <h2>Your Tasks</h2>
      <p>Here you can view the completed tasks. In the future these functions will be added:
      - Remove completed tasks automatically after X days. - Sort tasks by time completed.</p>
      <div id="containerCompleted" class="alignItems"></div>`
    function generateTasks() {
    let completedTasks = 7;
    const completed = document.getElementById("containerCompleted");
        for (let i = 0; i < completedTasks; i++) {
            const div = document.createElement("div");
            div.className = "boxCompleted";
            //Text Fields
            let title = "Completed Task " + i;
            let description = "Lorem ipsum"
            let deadline = "Insert date here:"
            let team = "Team X"
            //final output
            div.innerHTML = `<div><b>${title}</b></div><br><br>${description}<br><br>${deadline}<br><br>${team}`;
            completed.appendChild(div);
            }
        }
        generateTasks();
  };
}

function renderTeams() {
  app.innerHTML = `
    <h1>Team Management</h1>
    <p>Here you are able to manage your teams.</p>
    <p>Use the buttons below to create, edit and view teams.</p>
    <p>These teams will be assigned tasks to complete, through the 'Tasks' tab.</p>

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