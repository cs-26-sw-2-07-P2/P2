let departments = {};
let employeeIndex = {}; 

function renderDepartments() {
  const container = document.getElementById("departmentTable");

  container.innerHTML = createDepartmentTables(departments);

  makeSortable(departments);
  countAndDisplayEmployees();
  checkPlaceholders();
  updateSystemScore();
}

export async function renderDepartmentViewerPage(container){

  container.innerHTML = `
    <h1>View Your Teams!</h1>
    <h2 id="systemScore">System score: --</h2>

    <button id="loadTeams">Load Teams</button>
    <button id="saveTeams">Save Teams</button>
    <button id="runAlgorithm">Run Algorithm</button>

    <div id="sortableList">
      <div id="departmentTable"></div>
    </div>
  `;

  document.getElementById("loadTeams").onclick = loadTeams;
  document.getElementById("saveTeams").onclick = saveTeams;
  document.getElementById("runAlgorithm").onclick = runAlgorithm;
}

// Helper function to convert Assigments to jobMap for visual display
function transformAssignments(assignments) {

  const jobMap = {};
  employeeIndex = {};

  for (const a of assignments) {

    if (!jobMap[a.jobId]) {
      jobMap[a.jobId] = {
        id: a.jobId,
        name: a.job?.name || `Job ${a.jobId}`,
        capacity: a.job?.capacity || 0,
        employees: [],
        amount: 0,
        averageCompatibility: 0
      };
    }

    const employeeObj = {
      employeeId: a.employeeId,
      compatibility: a.compatibility,
      employee: {
        username: a.employee?.user?.username || "Unknown"
      }
    };

    jobMap[a.jobId].employees.push(employeeObj);

    // store global mapping for saving
    employeeIndex[a.employeeId] = {
      jobId: a.jobId,
      compatibility: a.compatibility,
      priorityRank: a.priorityRank,
      username: a.employee?.user?.username
    };
  }

  for (const job of Object.values(jobMap)) {
    job.amount = job.employees.length;
  }

  return jobMap;
}

// Load teams currently assigned in DB
async function loadTeams() {
  try {
    const response = await fetch("/api/assignments");
    const result = await response.json();

    if (!response.ok) {
      console.log(result.error);
      return;
    }

    departments = transformAssignments(result.assignments);

    employeeIndex = {}; // Reset employee index before loading

    renderDepartments();

  } catch (error) {
    console.error(error);
  }
}

// Save teams -> allows manager to reassign assignments reads from frontend.
async function saveTeams() {
  try {
    const assignments = [];
    const seen = new Set();

    Object.values(departments).forEach(job => {
      const jobDiv = document.getElementById(job.id);
      const employeeDivs = jobDiv.querySelectorAll(".employee[data-employee-id]");

      employeeDivs.forEach(div => {
        const id = Number(div.dataset.employeeId);

        if (seen.has(id)) return;
        seen.add(id);

        assignments.push({
          employeeId: id,
          jobId: job.id,
          compatibility: employeeIndex[id]?.compatibility ?? 0,
          priorityRank: employeeIndex[id]?.priorityRank ?? 0
        });
      });
    });

    const response = await fetch("/api/assignments/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignments })
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(result.error);
      return;
    }

    console.log("Saved!");
  } catch (err) {
    console.error(err);
  }
}

// Use algorithm API to calculate compatibility (Will overwrite assignments)
async function runAlgorithm() {
  try {
    const response = await fetch("/api/run-algorithm", {
      method: "POST"
    });

    const result = await response.json();

    // refresh UI after backend changes DB
    await loadTeams();

  } catch (error) {
    console.error(error);
  }
}

// ===========================
// Visual functions and sortable implementation
// ===========================
function createEmployeeDivs(employees){
  let html = "";
  if (employees.length === 0){
    html +=
    `<div class="placeholder">Empty</div>`
  }

  employees.forEach(employee => {
    html += 
    `<div class="employee" data-employee-id="${employee.employeeId}">
      ${employee.employee.username} // Compatibility: ${employee.compatibility*100}%
    </div>`
  })
  return html;
}

function checkPlaceholders(){
  Object.values(departments).forEach(department => {
    let currentDepartmentDiv = document.getElementById(`${department.id}`)
    
    let placeholders = currentDepartmentDiv.querySelector(".placeholder");
    let realEmployees = currentDepartmentDiv.querySelector(".employee");
    
    // If there is no placerholder div and no employee divs;
    if (!placeholders && !realEmployees){
      let placeholder = document.createElement("div");
      placeholder.classList.add("placeholder");
      placeholder.textContent = "Empty";
      currentDepartmentDiv.appendChild(placeholder);
    }
    else if (placeholders && realEmployees){
      placeholders.remove();
    }
    
  });
}

function countAndDisplayEmployees(){
  
  Object.values(departments).forEach(department => {
    let currentDepartmentDiv = document.getElementById(`${department.id}`);
    let employeeCount = currentDepartmentDiv.querySelectorAll(".employee").length; 

    let counter = document.getElementById(`${department.id}-count`);
    counter.innerHTML = `${employeeCount} / ${department.capacity}`;

  })

}

function makeSortable(departments) {

  Object.values(departments).forEach(department => {

    const el = document.getElementById(department.id);

    if (el._sortable) el._sortable.destroy();

    el._sortable = new Sortable(el, {
      animation: 150,
      group: "employees",
      draggable: ".employee, .placeholder",
      filter: ".placeholder",

      onEnd: function (evt) {
        syncDepartmentsFromDOM(); // sync from frontend
        countAndDisplayEmployees();
        checkPlaceholders();
        updateSystemScore(); // live update systemScore
      }
    });

  });
}

function createDepartmentTables(departments){
  let html = "";
  Object.values(departments).forEach(department => {
    html += 
    `<div id="${department.id}" class="departmentcard">
      <div class="departmentheader">
        <div class="departmentname"> ${department.name} </div>
        <span id="${department.id}-count" class="departmentcount"> ${department.amount}/${department.capacity} </span>
      </div>
      ${createEmployeeDivs(department.employees)} 
    </div> \n`;
  })
  return html;
}

// Will recalculate the systemScore and display it live
function updateSystemScore() {
  let total = 0;
  let count = 0;

  Object.values(departments).forEach(job => {
    const jobDiv = document.getElementById(job.id);
    const employeeDivs = jobDiv.querySelectorAll(".employee");

    employeeDivs.forEach(div => {
      const id = Number(div.dataset.employeeId);
      total += employeeIndex[id]?.compatibility ?? 0;
      count++;
    });
  });

  const score = count ? total / count : 0;

  document.getElementById("systemScore").innerText =
    `System score: ${(score * 100).toFixed(2)}%`;
}

// This will update visual compatibilities and employee names from DOM
function syncDepartmentsFromDOM() {
  Object.values(departments).forEach(job => {
    const jobDiv = document.getElementById(job.id);

    const employeeDivs = jobDiv.querySelectorAll(".employee");

    job.employees = Array.from(employeeDivs).map(div => ({
      employeeId: Number(div.dataset.employeeId),
      compatibility: employeeIndex[Number(div.dataset.employeeId)]?.compatibility ?? 0,
      employee: {
        username: employeeIndex[Number(div.dataset.employeeId)]?.username ?? "Unknown"
      }
    }));
  });
}