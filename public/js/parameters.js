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

async function saveParameters() {
    
}
