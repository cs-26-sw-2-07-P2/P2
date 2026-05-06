/** @jest-environment jsdom */
 
const nav = { go(url) { window.location.href = url; } };
 
// ─── Source under test ────────────────────────────────────────────────────────
 
let overdueTasks = 1, ongoingTasks = 2, completedTasks = 7;
let submittedTaskCounter = 0, submittedTasks = [];
 
function task(title, description, team, deadline, empNr) {
  this.title = title; this.description = description;
  this.team = team; this.deadline = deadline; this.empNr = empNr;
}
 
function renderTasks(app) {
  app.innerHTML = `
    <h1>Task Management</h1>
    <button id="createTask">Create New Task</button>
    <button id="taskOverview">View Ongoing and Overdue Tasks</button>
    <button id="completedTasks">View Completed Tasks</button>
    <div id="taskTable" style="display:none;"></div>`;
 
  document.getElementById("createTask").onclick = () => {
    document.getElementById("taskTable").style.display = "block";
    document.getElementById("taskTable").innerHTML = `
      <table><tr><th>Title</th><th>Description</th><th>Team</th><th>Deadline</th><th>Employees</th></tr>
      <tr>
        <th><input id="taskTitle"/></th><th><input id="taskDesc"/></th>
        <th><select id="managerTeams"><option value="choose">Select Team</option>
          <option value="cleaning">Cleaning</option></select></th>
        <th><input id="deadline" type="date"/></th>
        <th><input id="nrEmp" type="number"/></th>
      </tr></table>
      <button id="submitTask">Submit Task</button>`;
    document.getElementById("submitTask").onclick = () => {
      submittedTasks.push(new task(
        document.getElementById("taskTitle").value,
        document.getElementById("taskDesc").value,
        document.getElementById("managerTeams").value,
        document.getElementById("deadline").value,
        document.getElementById("nrEmp").value));
      submittedTaskCounter++;
    };
  };
 
  document.getElementById("taskOverview").onclick = () => {
    document.getElementById("taskTable").style.display = "block";
    document.getElementById("taskTable").innerHTML = `
      <div id="containerOverdue" class="alignItems"></div>
      <div id="containerOngoing" class="alignItems"></div>`;
    for (let i = 0; i < overdueTasks; i++) {
      const d = document.createElement("div");
      d.className = "box overdue"; d.textContent = `Overdue Task ${i}`;
      document.getElementById("containerOverdue").appendChild(d);
    }
    for (let i = 0; i < ongoingTasks; i++) {
      const d = document.createElement("div");
      d.className = "box ongoing"; d.textContent = `Task Number ${i}`;
      document.getElementById("containerOngoing").appendChild(d);
    }
    submittedTasks.forEach(t => {
      const d = document.createElement("div");
      d.className = "box ongoing"; d.textContent = t.title;
      document.getElementById("containerOngoing").appendChild(d);
    });
  };
 
  document.getElementById("completedTasks").onclick = () => {
    document.getElementById("taskTable").style.display = "block";
    document.getElementById("taskTable").innerHTML =
      `<div id="containerCompleted" class="alignItems"></div>`;
    for (let i = 0; i < completedTasks; i++) {
      const d = document.createElement("div");
      d.className = "box completed"; d.textContent = `Completed Task ${i}`;
      document.getElementById("containerCompleted").appendChild(d);
    }
  };
}
 
// ─── Tests ────────────────────────────────────────────────────────────────────
 
let app;
beforeEach(() => {
  document.body.innerHTML = `<div id="app"></div>`;
  app = document.getElementById("app");
  submittedTasks = []; submittedTaskCounter = 0;
  renderTasks(app);
});
 
test("renders task management buttons", () => {
  expect(document.getElementById("createTask")).not.toBeNull();
  expect(document.getElementById("taskOverview")).not.toBeNull();
  expect(document.getElementById("completedTasks")).not.toBeNull();
});
 
test("Create Task shows the form", () => {
  document.getElementById("createTask").click();
  expect(document.getElementById("taskTable").style.display).toBe("block");
  expect(document.getElementById("taskTitle")).not.toBeNull();
  expect(document.getElementById("submitTask")).not.toBeNull();
});
 
test("Submit Task creates a task object and increments counter", () => {
  document.getElementById("createTask").click();
  document.getElementById("taskTitle").value = "Fix Bug";
  document.getElementById("taskDesc").value = "Desc";
  document.getElementById("managerTeams").value = "cleaning";
  document.getElementById("deadline").value = "2025-01-01";
  document.getElementById("nrEmp").value = "3";
  document.getElementById("submitTask").click();
  expect(submittedTaskCounter).toBe(1);
  expect(submittedTasks[0]).toMatchObject({ title: "Fix Bug", team: "cleaning", empNr: "3" });
});
 
test("Task Overview shows overdue and ongoing containers", () => {
  document.getElementById("taskOverview").click();
  expect(document.querySelectorAll(".box.overdue").length).toBe(overdueTasks);
  expect(document.querySelectorAll(".box.ongoing").length).toBe(ongoingTasks);
});
 
test("Task Overview includes submitted tasks", () => {
  document.getElementById("createTask").click();
  document.getElementById("taskTitle").value = "My Task";
  document.getElementById("taskDesc").value = "Desc";
  document.getElementById("submitTask").click();
  document.getElementById("taskOverview").click();
  const ongoing = document.querySelectorAll(".box.ongoing");
  expect(ongoing.length).toBe(ongoingTasks + 1);
  expect([...ongoing].some(d => d.textContent.includes("My Task"))).toBe(true);
});
 
test("Completed Tasks shows correct number of boxes", () => {
  document.getElementById("completedTasks").click();
  expect(document.querySelectorAll(".box.completed").length).toBe(completedTasks);
});