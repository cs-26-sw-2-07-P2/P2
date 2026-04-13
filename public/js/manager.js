let questionnaire = document.querySelector(".questionnaire");

questionnaire.addEventListener("click", createQuestionnaire);

< button onclick="createQuestionnaire()">Create Questionnaire</button>
function createQuestionnaire() {
    console.log("Button clicked");
};

document.getElementById("Create task").addEventListener("click", createTask);

function createTask() {
    window.location.href = "createtask.html";
}
