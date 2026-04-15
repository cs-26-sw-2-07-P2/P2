
import { logout } from "./logout.js"
// Select the buttons from the HTML using their class names
// NOTE: These class names should NOT contain spaces in real usage
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#logout").addEventListener("click", logout);

    const createtaskbtn = document.querySelector(".createTask");
    const edittaskbtn = document.querySelector(".editTask");
    const viewtaskbtn = document.querySelector(".taskOverview");

    createtaskbtn.addEventListener("click", createTask);
    edittaskbtn.addEventListener("click", editTask);
    viewtaskbtn.addEventListener("click", viewTaskOverview);

    // same for all other buttons...
});
// Function that runs when "Create Task" button is clicked
function createTask() {
    // Redirects the user to the "createtask.html" page
    window.location.href = "createtask.html";
}

// Function that runs when "Edit Task" button is clicked
function editTask() {
    // Redirects the user to the "edittask.html" page
    window.location.href = "edittask.html";
}

// Function that runs when "Task Overview" button is clicked
function viewTaskOverview() {
    // Redirects the user to the "taskoverview.html" page
    window.location.href = "taskoverview.html";
}

// Select buttons from the HTML
// NOTE: querySelector expects a CSS selector (like .class or #id)
// Right now these are written as plain text, so they will NOT work unless fixed
const createTeambtn = document.querySelector(".createTeam");
const editTeambtn = document.querySelector(".editTeam");
const viewTeamOverviewbtn = document.querySelector(".teamOverview");

// Add click event listeners to each button
// When a button is clicked, it runs the corresponding function
createTeambtn.addEventListener("click", createTeam);
editTeambtn.addEventListener("click", editTeam);
viewTeamOverviewbtn.addEventListener("click", viewTeamOverview);

// Function that runs when the "Create Team" button is clicked
function createTeam() {
    // Redirects the browser to the "createteam.html" page
    window.location.href = "createteam.html";
}

// Function that runs when the "Edit Team" button is clicked
function editTeam() {
    // Redirects the browser to the "editteam.html" page
    window.location.href = "editteam.html";
}

// Function that runs when the "Team Overview" button is clicked
function viewTeamOverview() {
    // Redirects the browser to the "teamoverview.html" page
    window.location.href = "teamoverview.html";
}


// ---------------- QUESTIONNAIRE SECTION ----------------


// Select questionnaire-related buttons from the HTML
// Again, these selectors are incorrect because they are not valid CSS selectors
const createQuestionnaireBtn = document.querySelector(".createQuestionnaire");
const editQuestionnaireBtn = document.querySelector(".editQuestionnaire");
const viewQuestionnaireAnswersBtn = document.querySelector(".viewQuestionnaireAnswers");

// Add click event listeners to questionnaire buttons
// Each button triggers a different function when clicked
createQuestionnaireBtn.addEventListener("click", createQuestionnaire);
editQuestionnaireBtn.addEventListener("click", editQuestionnaire);
viewQuestionnaireAnswersBtn.addEventListener("click", viewQuestionnaireAnswers);

// Function that runs when "Create Questionnaire" is clicked
function createQuestionnaire() {
    // Redirects to the create questionnaire page
    window.location.href = "createquestionnaire.html";
}

// Function that runs when "Edit Questionnaire" is clicked
function editQuestionnaire() {
    // Redirects to the edit questionnaire page
    window.location.href = "questionnaire.html";
}

// Function that runs when "View Questionnaire Answers" is clicked
function viewQuestionnaireAnswers() {
    // Redirects to the questionnaire answers page
    window.location.href = "questionnaireanswers.html";
}
