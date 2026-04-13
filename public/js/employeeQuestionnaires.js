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