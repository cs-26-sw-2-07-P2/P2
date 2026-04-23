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
let parameters = [];
async function loadParameters() {
  const res = await fetch("/api/parameters");
  const data = await res.json();
  parameters = data.parameters;
}

//
// Helper functions
//
function addDropDownOptions(selected = "") {
  return parameters.map(p =>
    `<option value="${p.id}" ${p.id == selected ? "selected" : ""}>
      ${p.name}
    </option>`
  ).join("");
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

// Sends answered questionnaire to DB
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
    const parameterId = table.rows[i].cells[1].querySelector("select").value;

    if (text.trim()) {
      questions.push({
        text: text.trim(),
        parameterId: Number(parameterId)
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
  } else {
    console.error(result.error);
  }
}

// Loads send questionnaire from DB
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

    result.questionnaires.forEach(q => {
      // Title row
      const titleRow = table.insertRow(-1);
      titleRow.innerHTML = `
        <td colspan="3"><strong>${q.title}</strong></td>
      `;
      // Questions
      q.questions.forEach(item => {
        const row = table.insertRow(-1);

        row.innerHTML = `
          <td><input type="text" value="${item.text}"></td>
          <td><select>${addDropDownOptions("")}</select></td>
          <td><button class="deleteRow">Delete</button></td>
        `;

        row.querySelector(".deleteRow").onclick = () => row.remove();
      });
    });
    alert("Loaded questionnaires!")
  } catch (err) {
    console.error(err);
  }
}