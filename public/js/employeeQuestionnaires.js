'use strict'
let amountOfQuestionnaires = 2;
let insertedButton;
function generateQuestionaire() {
    window.location.pathname = "/employee/questionnaires/selected";
    console.log("Clicked");
}

//empQuestionnaire.html relevant
if (window.location.pathname === "/employee/questionnaires"){
    document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < amountOfQuestionnaires; i++) {
        //create the button
        insertedButton = document.createElement("button");
        //insert the button
        document.getElementById("empContainerQuestionnaires").appendChild(insertedButton);
        //choose class and text content
        insertedButton.className = "empQuestionnaire";
        insertedButton.textContent = "Questionaire Name " + i;
        insertedButton.addEventListener("click", generateQuestionaire);
    }
})}