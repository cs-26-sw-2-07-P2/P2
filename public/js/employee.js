'use strict'
//NOTICE-------------------------- THESE 2 VARIABLES SHOULD BE CHANGED IN REGARDS TO HOW MANY TASKS THERE ARE, 3 AND 7 ARE PLACEHOLDERS
let amountOfOngoingTasks = 3;
let amountOfCompletedTasks = 7;

let completedTasks;

//run code only after page load
document.addEventListener('DOMContentLoaded', function() {
    //for loop to generate completedtask boxes (divs)
    for (let i = 0; i < amountOfCompletedTasks; i++) {
        //create the div
        completedTasks = document.createElement("div");
        //insert the div
        document.getElementById("containerCompleted").appendChild(completedTasks);
        //choose class and text content
        completedTasks.className = "boxCompleted";
        completedTasks.textContent = "Completed task number ";
        completedTasks.textContent += (i);
    }
    //same loop but for ongoing tasks:
    for (let i = 0; i < amountOfOngoingTasks; i++) {
        completedTasks = document.createElement("div");
        document.getElementById("containerOngoing").appendChild(completedTasks);
        completedTasks.className = "boxOngoing";
        completedTasks.textContent = "Ongoing task number ";
        completedTasks.textContent += (i);
    }
});