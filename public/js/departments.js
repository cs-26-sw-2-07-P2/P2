export async function renderDepartmentsPage(container) {
  await loadParameters();

  container.innerHTML = `
    <h1>Department Management</h1>

    <button id="newDepartment">New Department</button>
    <button id="addParameter">Add Parameter</button>
    <button id="saveDepartment">Save Department</button>
    <button id="loadSavedDepartment">Load Departments</button>
    <button id="clearDepartments">Clear</button>

    <br><br>
    <input id="DepartmentTitle" placeholder="Enter Department title" />

    <table id="Department">
      <tr>
        <th>Parameter</th>
        <th>Weight</th>
        <th>Action</th>
      </tr>
    </table>
  `;

  document.getElementById("newDepartment").onclick = newDepartment;
  document.getElementById("addParameter").onclick = addParameterRow;
  document.getElementById("saveDepartment").onclick = saveDepartment;
  document.getElementById("loadSavedDepartment").onclick = loadSavedDepartment;
  document.getElementById("clearDepartments").onclick = clearDepartments;
}

let parameters = [];

// LOAD PARAMETERS from DB
async function loadParameters() {
  const res = await fetch("/api/parameters");
  const data = await res.json();
  parameters = data.parameters;
}

// UI HELPER Functions
function addParameterOptions(selected = "") {
  return parameters.map(p =>
    `<option value="${p.id}" ${p.id == selected ? "selected" : ""}>${p.name}</option>`
  ).join("");
}

function newDepartment() {
  clearDepartments();
  document.getElementById("DepartmentTitle").value = "";
}

function addParameterRow() {
  const table = document.getElementById("Department");
  const row = table.insertRow(-1);

  row.innerHTML = `
    <td><select>${addParameterOptions()}</select></td>
    <td><input type="number" min="1" max="5" value="3" /></td>
    <td><button class="deleteRow">Delete</button></td>
  `;

  row.querySelector(".deleteRow").onclick = () => row.remove();
}

function clearDepartments() {
  const table = document.getElementById("Department");

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

async function saveDepartment() {
  const table = document.getElementById("Department");
  const name = document.getElementById("DepartmentTitle").value;

  if (!name.trim()) {
    alert("Enter department name");
    return;
  }

  const parametersData = [];
  const seen = new Set();

  for (let i = 1; i < table.rows.length; i++) {
    const parameterId = Number(
      table.rows[i].cells[0].querySelector("select").value
    );

    const weight = Number(
      table.rows[i].cells[1].querySelector("input").value
    );

    if (seen.has(parameterId)) {
      alert("Duplicate parameter not allowed");
      return;
    }

    seen.add(parameterId);

    parametersData.push({
      parameterId,
      weight
    });
  }

  if (parametersData.length === 0) {
    alert("Add at least one parameter");
    return;
  }

  const payload = {
    name,
    parameters: parametersData
  };

  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await res.json();

  if (res.ok) {
    alert("Department saved!");
    newDepartment();
  } else {
    console.error(result.error);
  }
}

async function loadSavedDepartment() {
  clearDepartments();

  const res = await fetch("/api/jobs");
  const data = await res.json();

  const table = document.getElementById("Department");

  data.jobs.forEach(job => {
    const titleRow = table.insertRow(-1);
    titleRow.innerHTML = `<td colspan="3"><strong>${job.name}</strong></td>`;

    job.parameters.forEach(p => {
      const row = table.insertRow(-1);

      row.innerHTML = `
        <td><select>${addParameterOptions(p.parameter.id)}</select></td>
        <td><input type="number" min="1" max="5" value="${p.weight}" /></td>
        <td><button class="deleteRow">Delete</button></td>
      `;

      row.querySelector(".deleteRow").onclick = () => row.remove();
    });
  });
}