'use strict'
let amountOfQuestionnaires = 2;
let insertedDiv;

document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < amountOfQuestionnaires; i++) {
        //create the div
        insertedDiv = document.createElement("div");
        //insert the div
        document.getElementById("empContainerQuestionnaires").appendChild(insertedDiv);
        //choose class and text content
        insertedDiv.className = "empQuestionnaire";
        insertedDiv.textContent = "QUESTIONNAIRE NAME ";
        insertedDiv.textContent += (i);
    }
})



// Manager Side
document.querySelector("#addRow").addEventListener("click", addRow);
document.querySelector("#saveQuestionnaire").addEventListener("click", sendQuestionnaire);
document.querySelector("#loadSavedQuestionnaire").addEventListener("click", loadSavedQuestionnaire);
document.querySelector("#clearQuestionnaire").addEventListener("click", clearQuestionnaire);

// Syntetisk data der kan slettes senere
const savedData = [
    { question: "How are your backend skills?", team: "AAA" },
    { question: "How are your frontend skills?", team: "BBB" }
];

// Laver drop-down menu
function addDropDownOptions(selectedTeam){
    // Laver nyt array med kun teams ud fra større 'questions' og 'teams' array.
    const teamNames = savedData.map(data => data.team)

    let teamNamesSet = new Set(teamNames);
    let teamNamesSetArray = [...teamNamesSet];

    // laver først nyt array af html-options for hvert team og derefter samler det i en string
    return teamNamesSetArray.map(team =>
        `<option value="${team}" ${team === selectedTeam ? "selected" : ""}>${team}</option>`
    ).join("");
}


function clearQuestionnaire(){
    const table = document.getElementById("questionnaire");
    const rows = table.rows;
    for (let i = rows.length - 1; i > 0; i--){
        table.deleteRow(i);
    }
}

function loadSavedQuestionnaire(){
    const table = document.getElementById("questionnaire");

    clearQuestionnaire();

    for (let i = 0; i < savedData.length; i++){
        const newRow = table.insertRow(-1);
        newRow.innerHTML = 
        `<tr>
            <td><input type="text" value="${savedData[i].question}"></input></td>
            <td>
                <select>${addDropDownOptions(savedData[i].team)}</select>
                <td><button onclick="deleteRow(this)">Delete This Question...</button></td>
            </td>
        </tr>`
        ;
    }
}

async function sendQuestionnaire(){
    const table = document.getElementById("questionnaire");
    const rows = table.rows;
    const data = [];

    for (let i  = 1; i < rows.length; i++){
        const question = rows[i].cells[0].querySelector("input").value;
        const team = rows[i].cells[1].querySelector("select").value;

        data.push({question, team})
    }

    try {
        const response = await fetch("/sendQuestionnaire", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    
        const data = await response.json();

    if (response.ok) {
      console.log("Sent Questionnaire!");
    } else {
      console.log(data.error || "Failed to send questionnaire!");
    }
    } catch (error) {
        console.log("Error:", error);
    }
}

function addRow(){
    const table = document.getElementById("questionnaire");
    const newRow = table.insertRow(-1);
    newRow.innerHTML = 
            `<tr>
                <td><input type="text" placeholder="Enter Question"></input></td>
                <td>
                    <select>${addDropDownOptions("")}</select>
                    <td><button onclick="deleteRow(this)">Delete This Question...</button></td>
                </td>
            </tr>`
            ;
    }
function deleteRow(btn){
    const row = btn.closest("tr");
    row.parentElement.deleteRow(row.rowIndex);
}

