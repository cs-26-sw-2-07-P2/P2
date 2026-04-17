'use strict'

let amountOfQuestionnaires = 2;
let insertedButton;
function generateQuestionaire() {
    window.location.pathname = "/employee/questionnaires/selected";
    console.log("Clicked");
}
if (window.location.pathname === "/employee/questionnaires" || 
    window.location.pathname === "/employee/questionnaires/") {
    document.addEventListener('DOMContentLoaded', function() {
        for (let i = 0; i < amountOfQuestionnaires; i++) {
            insertedButton = document.createElement("button");
            insertedButton.className = "empQuestionnaire";
            insertedButton.style.display = "block";
            insertedButton.textContent = "Questionnaire Name " + i;
            insertedButton.onclick = generateQuestionaire;  // ← add this
            document.getElementById("empContainerQuestionnaires").appendChild(insertedButton);
        }
    });
}