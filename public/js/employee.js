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
  insertedButton.addEventListener("click", generateQuestionaire);
  navigate("home");
});

function navigate(route) {
  render(route);
}

function render(route) {
  switch (route) {
    case "home":
      app.innerHTML = `<h1>Home Page</h1>
      <p>Hi USERNAME</p>
      <p>Click the buttons at the top to navigate through the website.</p>
      <h2>Your Tasks</h2>
      <p>Here you can view your tasks.</p>
      <p>Ongoing tasks are shown in green, completed tasks are shown in grey, and your overdue tasks are shown at the top in red.</p>
      <hr></hr>
      <div id="containerOverdue" class="alignItems"></div>
      <hr></hr>
      <div id="containerOngoing" class="alignItems"></div>
      <hr></hr>
      <div id="containerCompleted" class="alignItems"></div>
      `;
      renderTasks();
      break;

    /*case "tasks":
      app.innerHTML = `<h1>Your Tasks</h1>
      <p>Here you can view your tasks.</p>
      <p>Ongoing tasks are shown in green, completed tasks are shown in grey.</p>
      <div id="containerOngoing" class="alignItems"></div>
      <div id="containerCompleted" class="alignItems"></div>
      `;
      renderTasks();
      break;*/

    case "teams":
      app.innerHTML = `<h1>Your Team</h1>
      <p>Here you can view your assigned team.</p>
      <h4>Teamname: Team AAA</h4>
      <div id="containerTeam"></div>
      `;
      renderTeam();
      break;

    /*case "questionnaires":
      app.innerHTML = `<div id="empContainerQuestionnaires" class="alignItems" style="flex-direction: column;">
      <button id="employeeQuestionnaires" class="empQuestionnaire" style="display: none;"></button>
      </div>`;
      generateQuestionaire();
      break;*/

    default: // if no route found
      app.innerHTML = `<h1>404</h1>`;
  }
}

function renderTasks() {
  const overdue = document.getElementById("containerOverdue");
  const ongoing = document.getElementById("containerOngoing");
  const completed = document.getElementById("containerCompleted");

  for (let i = 0; i < 1; i++) {
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
  for (let i = 0; i < 2; i++) {
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
  for (let i = 0; i < 7; i++) {
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

function renderTeam() {
  const teamContainer = document.getElementById("containerTeam");

  for (let i = 1; i < 6; i++) {
    const div = document.createElement("div");
    div.className = "boxTeam";
    div.textContent = "Team Member " + i;
    teamContainer.appendChild(div);
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