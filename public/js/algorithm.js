'use strict'
//HUSK: 5=1, 4=0.75, 3=0.5, 2=0.25, 1=0.
let outdoorWork;
let customerInteraction;
let physicalLabour;
let departments;
let employees;
function createDepartments(){
    //midlertidigt data:
    departments = [                   //outdoor customers physical
        { name: "CLEANING",   weight: [0.75,       0,       0.5]},

        { name: "RESTAURANT", weight: [0,          0.75,   0.25]},
        
        { name: "STALLS",     weight: [0.5,        1,      0.25]}
    ];
}

function createEmployees(){
    employees = [                    //cleaning restaurant stalls 
    { name: "Noah",         answers: [0.75,     0.25,        1]},
    { name: "William",      answers: [0.50,     0.75,     0.25]},
    { name: "Tobias",       answers: [1,        0,        0.75]},
    { name: "Robin",        answers: [0.25,     1,        0.50]},
    { name: "Jeffinn",      answers: [0,        0.50,        1]},
    { name: "Oliver",       answers: [0.75,     0.25,     0.50]},
    { name: "John Software",answers: [0,        0.75,     0.25]}
    ];
}

let parameters = ["outdoorWork", "customerInteraction", "physicalLabour"];

createDepartments();
createEmployees();

let amountOfDepartments = departments.length
let amountOfParameters = parameters.length
let amountOfEmployees = employees.length
let accuracyScore = [];
let currentDepartment;
let currentEmployee;
let currentParameter;
let totalCompatability;
for(let x = 0; x < amountOfDepartments; x++){
    //choose department
    currentDepartment = departments[x]
    console.log("Department: "+currentDepartment.name)

    for(let y = 0; y < amountOfEmployees; y++){
    //choose employee
        currentEmployee = employees[y]
        console.log("Employee: "+currentEmployee.name);
        for(let z = 0; z < amountOfParameters; z++){
            //calculate employee compatibility with departments using parameters
            if(currentDepartment.weight[z] > currentEmployee.answers[z]){
                accuracyScore[z] = currentDepartment.weight[z]-currentEmployee.answers[z];
            }
            else if(currentDepartment.weight[z] < currentEmployee.answers[z]){
                accuracyScore[z] = currentEmployee.answers[z]-currentDepartment.weight[z];
            }
            else{
                accuracyScore[z] = 0;
            }
            if(z===0){console.log("Accuracies:")}
            console.log(parameters[z]+" "+accuracyScore[z])
        }
        totalCompatability = 0; 
        for(let i = 0; i < accuracyScore.length; i++){
            totalCompatability += accuracyScore[i];
        }
        totalCompatability = totalCompatability / accuracyScore.length;
        totalCompatability = (1-totalCompatability)*100;
        console.log("Compatability : "+totalCompatability+"%");
        console.log(" ");
        
    }
    console.log(" ")
}


