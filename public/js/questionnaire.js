export async function renderQuestionnairePage(container) {
  await loadParameters();

  container.innerHTML = `
    <h1>Questionnaire</h1>

    <button id="addRow">Add Question</button>
    <button id="saveQuestionnaire">Save</button>
    <button id="loadSavedQuestionnaire">Load</button>
    <button id="clearQuestionnaire">Clear</button>

    <br></br>
    <input id="questionnaireTitle" placeholder="Enter questionnaire title" />

    <table id="questionnaire">
      <tr>
        <th>Question</th>
        <th>Parameter</th>
        <th>Action</th>
      </tr>
    </table>
  `;

  document.getElementById("addRow").onclick = addRow;
  document.getElementById("saveQuestionnaire").onclick = sendQuestionnaire;
  document.getElementById("loadSavedQuestionnaire").onclick = loadSavedQuestionnaire;
  document.getElementById("clearQuestionnaire").onclick = clearQuestionnaire;
}

// EMPLOYEE QUESTIONNAIRES
export async function renderQuestionnaires(container) {
  try {
    const response = await fetch("/api/questionnaires");

    if (!response.ok) {
      container.innerHTML = "<h1>Server error loading questionnaires</h1>";
      return;
    }

    const result = await response.json();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<h1>Questionnaires</h1>`;

    const listContainer = document.createElement("div");
    wrapper.appendChild(listContainer);

    container.innerHTML = "";
    container.appendChild(wrapper);

    result.questionnaires.forEach((q) => {
      const box = document.createElement("div");
      box.className = "questionnaireBox";

      const table = document.createElement("table");

      table.innerHTML = `
        <tr>
          <th>Question</th>
          <th>Answer</th>
        </tr>
      `;

      q.questions.forEach((item) => {
        const row = table.insertRow();

        row.innerHTML = `
          <td>${item.text}</td>
          <td>
            <div class="slidecontainer">
              <input type="range" min="1" max="5" value="1" class="slider">
              <span class="slider-value">1</span>
            </div>
          </td>
        `;

        const slider = row.querySelector(".slider");
        const output = row.querySelector(".slider-value");

        slider.addEventListener("input", () => {
          output.textContent = slider.value;
        });
      });

      box.innerHTML = `<h2>${q.title}</h2>`;
      box.appendChild(table);

      const button = document.createElement("button");
      button.textContent = "Save Answers";

      button.addEventListener("click", () => {
        saveAnswers(table);
      });

      box.appendChild(button);
      listContainer.appendChild(box);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<h1>Error loading questionnaires</h1>";
  }
}

// PARAMETERS from DB (Currently Seeded)
let parameters = [];

async function loadParameters() {
  const res = await fetch("/api/parameters");
  const data = await res.json();
  parameters = data.parameters;
}

// EMPLOYEE + SAVE ANSWERS
async function getEmployee() {
  const res = await fetch("/api/employee");

  if (!res.ok) return null;

  const data = await res.json();
  return data.employee;
}

async function saveAnswers(table) {
  const employee = await getEmployee();

  if (!employee) {
    window.location.href = "/";
    return;
  }

  const id = employee.id;
  const questions = [];

  const rows = table.querySelectorAll("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    const question = row.cells[0].innerText;
    const slider = row.querySelector(".slider");

    if (!slider) continue;

    questions.push({
      question,
      answer: Number(slider.value)
    });
  }

  const payload = { id, questions };

  const response = await fetch("/api/response", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (response.ok) {
    alert("Saved!");
    await loadSavedQuestionnaire();
  } else {
    console.error(result.error);
  }
}

// UI HELPERS (Manager side)
function addDropDownOptions(selected = "") {
  return parameters
    .map(
      (p) =>
        `<option value="${p.id}" ${
          p.id == selected ? "selected" : ""
        }>${p.name}</option>`
    )
    .join("");
}


function clearQuestionnaire() {
  const table = document.getElementById("questionnaire");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}


function addRow() {
  const table = document.getElementById("questionnaire");
  const row = table.insertRow(-1);

  row.innerHTML = `
    <td><input type="text" placeholder="Enter question"></td>
    <td><select>${addDropDownOptions()}</select></td>
    <td><button class="deleteRow">Delete</button></td>
  `;

  row.querySelector(".deleteRow").onclick = () => row.remove();
}

// SAVE QUESTIONNAIRE
async function sendQuestionnaire() {
  const table = document.getElementById("questionnaire");
  const title = document.getElementById("questionnaireTitle").value;

  if (!title.trim()) {
    alert("Please enter a questionnaire title");
    return;
  }

  const questions = [];

  for (let i = 1; i < table.rows.length; i++) {
    const text = table.rows[i].cells[0].querySelector("input").value;
    const parameterId =
      table.rows[i].cells[1].querySelector("select").value;

    if (text.trim()) {
      questions.push({
        text: text.trim(),
        parameterId: Number(parameterId),
      });
    }
  }

  const payload = { title, questions };

  const response = await fetch("/api/questionnaires", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (response.ok) {
    alert("Saved!");
    await loadSavedQuestionnaire();
  } else {
    console.error(result.error);
  }
}

// LOAD QUESTIONNAIRES (Manager view)
async function loadSavedQuestionnaire() {
  clearQuestionnaire();

  try {
    const response = await fetch("/api/questionnaires");
    const result = await response.json();

    if (!response.ok) {
      console.log(result.error);
      return;
    }

    const table = document.getElementById("questionnaire");

    result.questionnaires.forEach((q) => {
      const titleRow = table.insertRow(-1);
      titleRow.innerHTML = `
        <td colspan="3"><strong>${q.title}</strong></td>
      `;

      q.questions.forEach((item) => {
        const row = table.insertRow(-1);

        row.innerHTML = `
          <td><input type="text" value="${item.text}"></td>
          <td><select>${addDropDownOptions("")}</select></td>
          <td><button class="deleteRow">Delete</button></td>
        `;

        row.querySelector(".deleteRow").onclick = () => row.remove();
      });
    });

    alert("Loaded questionnaires!");
  } catch (err) {
    console.error(err);
  }
}