


export async function renderDepartmentViewerPage(container){
    container.innerHTML = `
    <h1>View Your Teams!</h1>
    <div id="sortableList">
        <div id="departmentTable" style="min-height: 50px; display: flex; flex-wrap: wrap; gap: 16px;">
          ${createDepartmentTables(departments)}
        </div>
    </div>
    `

    makeSortable(departments);
    countAndDisplayEmployees();



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
      ], averageCompatibility: 0.7700, fillRate: 1 },
      '10': { id: 10, name: 'Cleaning', capacity: 20, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '11': { id: 11, name: 'Ride Operator', capacity: 20, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '12': { id: 12, name: 'Restaurant', capacity: 10, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '13': { id: 13, name: 'Security', capacity: 10, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '14': { id: 14, name: 'Maintenance', capacity: 5, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '15': { id: 15, name: 'Sales', capacity: 10, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '16': { id: 16, name: 'Ticket Scanner', capacity: 10, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '17': { id: 17, name: 'Customer Service', capacity: 20, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
      '18': { id: 18, name: 'Performer', capacity: 5, amount: 0, employees: [], averageCompatibility: 0, fillRate: 0 },
    }
  }

const departments = mockData.jobMap;

function createEmployeeDivs(employees){
  let html = "";
  if (employees.length === 0){
    html +=
    `<div class="employee placeholder">Empty</div>`
  }

  employees.forEach(employee => {
    html += 
    `<div class="employee">
    ${employee.employee.username} // Compatibility: ${employee.compatibility*100}%
    </div>`
  })
  return html;
}

function countAndDisplayEmployees(){
  
  Object.values(departments).forEach(department => {
    let currentDepartmentDiv = document.getElementById(`${department.name}`);
    let employeeCount = currentDepartmentDiv.querySelectorAll(".employee").length; 

    let counter = document.getElementById(`${department.name}-count`);
    counter.innerHTML = `${employeeCount} / ${department.capacity}`;

  })

}

function makeSortable(departments){
  Object.values(departments).forEach(department => {
    new Sortable(document.getElementById(department.name), {
      animation: 150,
      group: "employees",
      draggable: ".employee",
      onEnd: countAndDisplayEmployees,
      emptyInsertThreshold: 20,
    })
  })
}

function createDepartmentTables(departments){
  let html = "";
  Object.values(departments).forEach(department => {
    html += 
    `<div id="${department.name}">
      <strong> ${department.name} </strong>
      <span id="${department.name}-count"> ${department.amount}/${department.capacity} </span>
      ${createEmployeeDivs(department.employees)} 
    </div> \n`;
  })
  return html;
}



