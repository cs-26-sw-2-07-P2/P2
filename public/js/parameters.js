export function renderParametersPage(container) {
 
    container.innerHTML = `
    <h1>Parameter Management</h1>

    <input id="parameterName" placeholder="Enter parameter name" />
    <button id="newParameter">Add Parameter</button>
    <button id="saveParameter">Save Parameters</button>
    <button id="loadSavedParameter">Load Parameters</button>

    <br><br>

    <table id="Parameters">
      <tr>
        <th>Parameter</th>
        <th>Action</th>
      </tr>
    </table>
    `;

    document.getElementById("newParameter").onclick = addParameter;
    document.getElementById("saveParameter").onclick = saveParameters;
    document.getElementById("loadSavedParameter").onclick = () => loadParameters(container);
}

function addParameter() {
  const table = document.getElementById("Parameters");
  const row = table.insertRow(-1);
  const parameter = document.getElementById("parameterName").value;

  row.innerHTML = `
    <td><input type="text" value="${parameter}"></td>
    <td><button class="deleteRow">Delete</button></td>
  `;

  row.querySelector(".deleteRow").onclick = () => row.remove();
}

async function loadParameters(container) {
    try {
    const res = await fetch("/api/parameters");
    const data = await res.json();
    const parameters = data.parameters;

    if (!parameters) {
    container.innerHTML = "<h1>No questionnaire found</h1>";
    return;
    }

    const table = document.getElementById("Parameters");

    // Clear existing rows except header
    table.innerHTML = `
      <tr>
        <th>Parameter</th>
        <th>Action</th>
      </tr>
    `;

    parameters.forEach((item) => {
        const row = table.insertRow();

        row.dataset.parameterId = item.id;

        row.innerHTML = `
        <td><input type="text" value="${item.name}"></td>
        <td><button class="deleteRow">Delete</button></td>
      `;

        row.querySelector(".deleteRow").onclick = () => row.remove();
    }); 
    alert("Loaded parameters!");

    } catch (err) {
    console.error(err);
  }
}

// SAVE PARAMETERS
async function saveParameters() {
    const table = document.getElementById("Parameters");

    const parameters = [];

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];

    const input = row.cells[0]?.querySelector("input");
    const select = row.cells[1]?.querySelector("select");

    if (!input) continue;

    const name = input.value.trim();
    const parameterId = Number(select.value);

    if (!name) continue;

    parameters.push({
      id: row.dataset.parameterId || null, // IMPORTANT for old/existing parameters
      name,
    });
  }

  const payload = { parameters };

  const response = await fetch("/api/questionnaires", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (response.ok) {
    alert("Saved!");
    await loadParameters();
  } else {
    console.error(result.error);
  }
}