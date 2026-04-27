import { renderNavbar } from "./components/navbar.js";
import { renderQuestionnaires } from "./questionnaire.js";
import { logout } from "./components/logout.js";

let app;
let navbarContainer;
let currentUser;

document.addEventListener("DOMContentLoaded", async () => {
  app = document.getElementById("app");
  navbarContainer = document.getElementById("navbar");

  const res = await fetch("/api/me");
  const data = await res.json();

  if (!data.authenticated) {
    window.location.href = "/";
    return;
  }

  currentUser = data.user;

  const navbar = await renderNavbar((route) => navigate(route));
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
  const routes = {
    home: renderHome,
    teams: renderTeams,
    questionnaires: renderQuestionnairesPage
  };

  if (routes[route]) {
    routes[route]();
  } else {
    app.innerHTML = `<h1>404</h1>`;
  }
}

function renderHome() {
  const username = currentUser?.username || "User";

  app.innerHTML = `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Welcome back, ${username}</p>
    </div>

    <div class="card">
      <h2>Your Tasks</h2>
      <p class="muted">
        Ongoing (green), completed (gray), overdue (red)
      </p>
    </div>

    <div class="task-section">
      <h3>Overdue</h3>
      <div id="containerOverdue" class="grid"></div>
    </div>

    <div class="task-section">
      <h3>Ongoing</h3>
      <div id="containerOngoing" class="grid"></div>
    </div>

    <div class="task-section">
      <h3>Completed</h3>
      <div id="containerCompleted" class="grid"></div>
    </div>
  `;

  renderTasks();
}

function renderTeams() {
  app.innerHTML = `
    <div class="page-header">
      <h1>Your Team</h1>
      <p class="muted">View your assigned team(s)</p>
    </div>

    <div class="card">
      <div id="containerTeam"></div>
    </div>
  `;

  renderTeam();
}

function renderQuestionnairesPage() {
  app.innerHTML = `
    <div class="page-header">
      <h1>Questionnaires</h1>
      <p class="muted">Manage and complete questionnaires</p>
    </div>

    <div class="card">
      <p>Loading questionnaires...</p>
    </div>
  `;

  renderQuestionnaires(app);
}

//DO NOT MOVE THESE. THESE WILL BE EDITED LATER TO TAKE INPUT FROM SERVER.
let overdueTasks = 1;
let ongoingTasks = 2;
let completedTasks = 7;
function renderTasks() {
  const overdue = document.getElementById("containerOverdue");
  const ongoing = document.getElementById("containerOngoing");
  const completed = document.getElementById("containerCompleted");

  for (let i = 0; i < overdueTasks; i++) {
    const div = document.createElement("div");
    div.className = "box overdue";
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
    div.className = "box ongoing";
    //Text Fields
    let title = "Task Number " + i;
    let description = "Lorem ipsum"
    let deadline = "Insert date here:"
    let team = "Team X"
    //final output
    div.innerHTML = `<div><b>${title}</b></div><br><br>${description}<br><br>${deadline}<br><br>${team}`;
    ongoing.appendChild(div);
  }
  for (let i = 0; i < completedTasks; i++) {
    const div = document.createElement("div");
    div.className = "box completed";
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

function renderTeam() {
  const teamContainer = document.getElementById("containerTeam");
  for (let j = 0; j < (overdueTasks+ongoingTasks); j++) {
    let div1 = document.createElement("div");
    div1.className = "boxTeamDiv1";
    div1.innerHTML = `<b>Team ${j}</b>`;
    teamContainer.appendChild(div1);
    for (let i = 1; i < 6; i++) {
    let div2 = document.createElement("div");
    div2.className = "boxTeamDiv2";
    //text fields
    let name = 'John Software den ' + i + '.';
    let email = 'johnnyboy@gmail.com'
    let phone = '+45 67676767'
    //evt tilføj skillset på hver employee????
    div2.innerHTML = `${name}<br>${email}<br>${phone}`;
    teamContainer.appendChild(div2);
    }
    let div3 = document.createElement("div");
    div3.innerHTML = `<hr>`;
    teamContainer.appendChild(div3);
  }
}

/*function generateQuestionaire() {
  let amountOfQuestionnaires = 2;
    for (let i = 0; i < amountOfQuestionnaires; i++) {
      //create the button
      let insertedButton = document.createElement("button");
      //insert the button
      document.getElementById("empContainerQuestionnaires").appendChild(insertedButton);
      insertedButton.className = "empQuestionnaire";
      insertedButton.textContent = "Questionaire Name " + i;
      insertedButton.style.display = "block";
    }
}*/