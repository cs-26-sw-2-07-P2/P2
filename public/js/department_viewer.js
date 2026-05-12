


export async function renderDepartmentViewerPage(container){
    container.innerHTML = `
    <h1>View Your Teams!</h1>
    <h2>System score for compatibility; ${mockData.systemScore*100}%</h2>
    <button id="loadTeams">Load Teams</button>
    <button id="saveTeams">Save Teams</button>

    <div id="sortableList">
        <div id="departmentTable" style="min-height: 50px; display: flex; flex-wrap: wrap; gap: 16px;">
          ${createDepartmentTables(departments)}
        </div>
    </div>
    `

    makeSortable(departments);
    countAndDisplayEmployees();

    document.getElementById("loadTeams").onclick = loadTeams;
    document.getElementById("saveTeams").onclick = saveTeams;

}

function loadTeams(){
  return;
}

function saveTeams(){
  return;
}


const mockData = {
  systemScore: 0.7875,
  jobMap: {
      '1': { id: 1, name: 'Cleaning', capacity: 20, amount: 4, employees: [
          { compatibility: 0.85, employee: { username: "Alice" } },
          { compatibility: 0.78, employee: { username: "Bob" } },
          { compatibility: 0.82, employee: { username: "Charlie" } },
          { compatibility: 0.76, employee: { username: "Diana" } },
      ], averageCompatibility: 0.80625, fillRate: 0.2 },
      '2': { id: 2, name: 'Ride Operator', capacity: 20, amount: 6, employees: [
          { compatibility: 0.91, employee: { username: "Eve" } },
          { compatibility: 0.74, employee: { username: "Frank" } },
          { compatibility: 0.80, employee: { username: "Grace" } },
          { compatibility: 0.77, employee: { username: "Hank" } },
          { compatibility: 0.79, employee: { username: "Ivy" } },
          { compatibility: 0.72, employee: { username: "Jack" } },
      ], averageCompatibility: 0.7833, fillRate: 0.3 },
      '3': { id: 3, name: 'Restaurant', capacity: 10, amount: 2, employees: [
          { compatibility: 0.88, employee: { username: "Karen" } },
          { compatibility: 0.82, employee: { username: "Leo" } },
      ], averageCompatibility: 0.85, fillRate: 0.2 },
      '4': { id: 4, name: 'Security', capacity: 10, amount: 5, employees: [
          { compatibility: 0.79, employee: { username: "Mia" } },
          { compatibility: 0.75, employee: { username: "Ned" } },
          { compatibility: 0.77, employee: { username: "Olivia" } },
          { compatibility: 0.74, employee: { username: "Paul" } },
          { compatibility: 0.76, employee: { username: "Quinn" } },
      ], averageCompatibility: 0.765, fillRate: 0.5 },
      '5': { id: 5, name: 'Maintenance', capacity: 5, amount: 5, employees: [
          { compatibility: 0.78, employee: { username: "Rose" } },
          { compatibility: 0.75, employee: { username: "Sam" } },
          { compatibility: 0.76, employee: { username: "Tina" } },
          { compatibility: 0.74, employee: { username: "Uma" } },
          { compatibility: 0.77, employee: { username: "Victor" } },
      ], averageCompatibility: 0.76, fillRate: 1 },
      '6': { id: 6, name: 'Sales', capacity: 10, amount: 5, employees: [
          { compatibility: 0.80, employee: { username: "Wendy" } },
          { compatibility: 0.77, employee: { username: "Xander" } },
          { compatibility: 0.76, employee: { username: "Yara" } },
          { compatibility: 0.75, employee: { username: "Zoe" } },
          { compatibility: 0.78, employee: { username: "Aaron" } },
      ], averageCompatibility: 0.7750, fillRate: 0.5 },
      '7': { id: 7, name: 'Ticket Scanner', capacity: 10, amount: 7, employees: [
          { compatibility: 0.84, employee: { username: "Beth" } },
          { compatibility: 0.79, employee: { username: "Carl" } },
          { compatibility: 0.81, employee: { username: "Deb" } },
          { compatibility: 0.80, employee: { username: "Erik" } },
          { compatibility: 0.82, employee: { username: "Faye" } },
          { compatibility: 0.78, employee: { username: "Glen" } },
          { compatibility: 0.83, employee: { username: "Hope" } },
      ], averageCompatibility: 0.8071, fillRate: 0.7 },
      '8': { id: 8, name: 'Customer Service', capacity: 20, amount: 1, employees: [
          { compatibility: 0.875, employee: { username: "Ian" } },
      ], averageCompatibility: 0.875, fillRate: 0.05 },
      '9': { id: 9, name: 'Performer', capacity: 5, amount: 5, employees: [
          { compatibility: 0.78, employee: { username: "Jade" } },
          { compatibility: 0.75, employee: { username: "Kyle" } },
          { compatibility: 0.77, employee: { username: "Luna" } },
          { compatibility: 0.76, employee: { username: "Mark" } },
          { compatibility: 0.77, employee: { username: "Nina" } },
      ], averageCompatibility: 0.7700, fillRate: 1 }
    }
  }

const departments = mockData.jobMap;

function createEmployeeDivs(employees){
  let html = "";
  if (employees.length === 0){
    html +=
    `<div class="placeholder">Empty</div>`
  }

  employees.forEach(employee => {
    html += 
    `<div class="employee">
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

function makeSortable(departments){
  Object.values(departments).forEach(department => {
    new Sortable(document.getElementById(department.id), {
      animation: 150,
      group: "employees",
      draggable: ".employee, .placeholder",
      filter: ".placeholder",
      onEnd: function(){
        countAndDisplayEmployees();
        checkPlaceholders();
      }, 
      emptyInsertThreshold: 20,
    })
  })
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



