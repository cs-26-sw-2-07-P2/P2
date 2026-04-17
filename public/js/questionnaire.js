// How data / questionnaires will look:
/*
const Data = [
  {
    id: 1,
    title: "Frontend questionnaire",
    questions: [
      { text: "How are your frontend skills?" },
      { text: "How comfortable are you with React?" }
    ]
  },
  {
    id: 2,
    title: "Backend questionnaire",
    questions: [
      { text: "How are your backend skills?" },
      { text: "Do you understand Prisma?" }
    ]
  }
];
*/

// Questionnaire page
export function renderQuestionnairePage(container) {
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
        <th>Team</th>
        <th>Action</th>
      </tr>
    </table>
  `;

  // Attaching events AFTERd render
  document.getElementById("addRow").onclick = addRow;
  document.getElementById("saveQuestionnaire").onclick = sendQuestionnaire;
  document.getElementById("loadSavedQuestionnaire").onclick = loadSavedQuestionnaire;
  document.getElementById("clearQuestionnaire").onclick = clearQuestionnaire;
}

//
// Helper functions
//
function addDropDownOptions(selected = "") {
  const teams = ["AAA", "BBB", "CCC"]; // temporary static values

  return teams.map(team =>
    `<option value="${team}" ${team === selected ? "selected" : ""}>${team}</option>`
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
    <td><select>${addDropDownOptions("")}</select></td>
    <td><button class="deleteRow">Delete</button></td>
  `;

  row.querySelector(".deleteRow").onclick = () => row.remove();
}

// Sends answered questionnaire to DB
async function sendQuestionnaire() {
  const table = document.getElementById("questionnaire");
  const title = document.getElementById("questionnaireTitle").value;
  const questions = [];

  if (!title.trim()) {
  alert("Please enter a questionnaire title");
  return;
}

  for (let i = 1; i < table.rows.length; i++) {
    const text = table.rows[i].cells[0].querySelector("input").value;
    if (text.trim() !== "") {
      questions.push({ text });
    }
  }

  const payload = {
    title: title, // later: add name of the questionnaire
    questions
  };

  try {
    const response = await fetch("/api/questionnaires", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Created!", result);
      alert("Saved!");
    } else {
      console.log(result.error);
    }
  } catch (err) {
    console.error(err);
  }
}

// Loads send questionnaire -> at them moment from savedData but its wrong format and things
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