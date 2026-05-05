// This file will take the input of algorithm.js and will take the percentage of each paratmeter and will calculate 
// the final score of compatibility of the user with each department and will take all scores of all employees and 
// will distribute them into the best matching departments to ensure employee satisfaction and productivity.

// Algorithm.js should provide the following data for each employee:
// {
//     "employeeId": 1,
//     "name": "Example 1",
//     "answers": {
//         "workingOutside": 4,
//         "customerInteraction": 4,
//         "physicalLabour": 2,
//     }
// }

// Function to calculate the compatibility score for each department
// The function will take an employeeID and the answer for each question in the questionnaire as a value from 0 to 1 representing the weight 
// of the employee's preferences and will return a score for each department based on how well it matches the employee's preferences.
// The function will start off by putting every employee in the department with the highest score and then will redistribute employees to other 
// departments based on their scores to ensure that each department has a balanced number of employees and that employees are placed in departments 
// where they are most likely to be satisfied and productive.
// An example of how the function will work is as follows:

// There will be parameters such as "Working outside", "Customer interaction", "Teamwork", "Independent work", etc. 
// The manager will assign a fitting answer for what the ideal employee for the department should have for each parameter, for example:
// - Operating rides: Working outside: 4, Customer interaction: 4, Teamwork: 2, Independent work: 4.
// - Food and beverage: Working outside: 2, Customer interaction: 4, Teamwork: 4, Independent work: 2.
// - Maintenance: Working outside: 4, Customer interaction: 1, Teamwork: 4, Independent work: 4.

// Based on the employees' answers to the questionnaire, the function will calculate a score for each department. 
// For example, if the employee answers a question about working outside with 4, the function will calculate the score for each 
// department based on how closely the employee's answer matches the ideal answer for that parameter in each department.

// This means that if the employee answers 4 for working outside, 4 for customer interaction, 2 for teamwork, 
// and 4 for independent work, the function will calculate the score for each department as follows:
// - Operating rides: (4/4) + (4/4) + (2/2) + (4/4) = 1 + 1 + 1 + 1 = 4/4 = 1
// - Food and beverage: (2/4) + (4/4) + (4/4) + (2/2) = 0.5 + 1 + 1 + 1 = 3.5/4 = 0.875
// - Maintenance: (4/4) + (1/4) + (4/4) + (4/4) = 1 + 0.25 + 1 + 1 = 3.25/4 = 0.8125

// This means that the employee has a compatibility score of:
//  100% for Operating rides, 87.5% for Food and beverage, and 81.25% for Maintenance.

// department_assign.js :
// After this the algorithm should place the employee in the department with the highest score, which in this case is Operating rides.
// Starting off we will place all employees in the department with the highest score and then we will redistribute employees to 
// other departments based on their scores to ensure that each department has a balanced number of employees and that employees are 
// placed in departments where they are most likely to be satisfied and productive.

// To start off we will hardcode the number of employees that each department can take, for example:
// - Operating rides: 20 employees
// - Food and beverage: 20 employees
// - Maintenance: 20 employees

// The algorithm will then place the employees in the department the highest matching score, and will not take the limit of employees 
// in each department into consideration. After all employees are assigned we will run a check to see if any department has more than 
// the limit of employees, if it does we will take the employees with the highest score for a department that needs more employees 
// and we will move them to that department, and we will repeat this process until all departments have a balanced number of employees 
// and that employees are placed in departments where they are most likely to be satisfied and productive.

// In total this should give us the maximum average compatibility score for all employees across all departments, 
// while ensuring that each department has a balanced number of employees and that employees are placed in departments where they are 
// most likely to be satisfied and productive.

const { calculateCompatibility } = require('./algorithm.js');

// Example of department and parameter data (REAL DATA SHOULD COME FROM THE DATABASE).
const departments = [
    // Parameters: Working outside, Customer interaction, Physical labour (REAL DATA SHOULD COME FROM THE DATABASE).
    { name: "Cleaning",    weight: [5, 2, 3], capacity: 2 },
    { name: "Restaurant",  weight: [2, 5, 4], capacity: 2 },
    { name: "Rides",       weight: [5, 1, 4], capacity: 4 },
    { name: "Maintenance", weight: [2, 4, 5], capacity: 2 },
    { name: "Minigames",   weight: [3, 4, 2], capacity: 2 },
    { name: "Security",    weight: [4, 2, 5], capacity: 2 },
    { name: "First Aid",   weight: [1, 5, 4], capacity: 2 },
    { name: "Merchandise", weight: [5, 3, 3], capacity: 2 },
    { name: "Ticketing",   weight: [2, 4, 4], capacity: 2 },
    { name: "Parking",     weight: [4, 2, 4], capacity: 2 },
    { name: "Cleaning",    weight: [3, 5, 3], capacity: 2 }
];

// Parameters that are used to calculate the compatibility score for each department (REAL DATA SHOULD COME FROM THE DATABASE).
const parameters = ["Working outside", "Customer interaction", "Physical labour"];

// Example of employee and parameter data (REAL DATA SHOULD COME FROM THE DATABASE).
const employees = [
    { name: "Emp. 1",  answers: [5, 2, 3] },
    { name: "Emp. 2",  answers: [2, 5, 4] },
    { name: "Emp. 3",  answers: [4, 3, 3] },
    { name: "Emp. 4",  answers: [5, 1, 4] },
    { name: "Emp. 5",  answers: [2, 4, 5] },
    { name: "Emp. 6",  answers: [3, 4, 2] },
    { name: "Emp. 7",  answers: [4, 2, 5] },
    { name: "Emp. 8",  answers: [1, 5, 4] },
    { name: "Emp. 9",  answers: [5, 3, 3] },
    { name: "Emp. 10", answers: [2, 4, 4] },
    { name: "Emp. 11", answers: [4, 2, 4] },
    { name: "Emp. 12", answers: [2, 3, 3] },
    { name: "Emp. 13", answers: [5, 1, 5] },
    { name: "Emp. 14", answers: [2, 4, 3] },
    { name: "Emp. 15", answers: [4, 3, 4] },
    { name: "Emp. 16", answers: [1, 5, 5] },
    { name: "Emp. 17", answers: [5, 2, 4] },
    { name: "Emp. 18", answers: [3, 4, 4] },
    { name: "Emp. 19", answers: [4, 3, 2] },
    { name: "Emp. 20", answers: [2, 5, 3] },
    { name: "Emp. 21", answers: [4, 2, 3] },
    { name: "Emp. 22", answers: [3, 4, 5] },
    { name: "Emp. 23", answers: [5, 1, 4] },
    { name: "Emp. 24", answers: [2, 4, 4] },
    { name: "Emp. 25", answers: [4, 3, 3] }
    
];

// Function to distribute employees into departments based on their compatibility scores and department capacities.
function distributeEmployees() {
    const scores = calculateCompatibility(departments, parameters, employees);

    // Initialize each department with an empty list and its chosen capacity (REAL DATA SHOULD COME FROM THE DATABASE).
    const distribution = {};
    for (let i = 0; i < departments.length; i++) {
        distribution[departments[i].name] = {
            employees: [],
            capacity: departments[i].capacity
        };
    }

    const sortedScores = [...scores].sort((a, b) => b.compatibility - a.compatibility);
    const assigned = new Set();

    // Distribution step 1:
    // Assign each employee to their most compatible department. 
    for (let i = 0; i < sortedScores.length; i++) {
        const entry = sortedScores[i];
        if (assigned.has(entry.employee)) continue;

        // Check if most compatible department has capacity, if it does assign the employee there.
        const dept = distribution[entry.department];
        if (dept.employees.length < dept.capacity) {
            dept.employees.push({
                name: entry.employee,
                score: entry.compatibility,
                fallback: false
            });
            assigned.add(entry.employee);
        }
    }

    // Distribution step 2:
    // If an employee couldn't be assigned to their top choice due to capacity, try their next best options.
    for (let i = 0; i < employees.length; i++) {
        const employeeName = employees[i].name;
        if (assigned.has(employeeName)) continue;

        // Get all scores for this employee, sorted by compatibility.
        const employeeScores = sortedScores.filter(s => s.employee === employeeName);

        // Try to assign the employee to the next best department based on their scores.
        for (let j = 0; j < employeeScores.length; j++) {
            const entry = employeeScores[j];
            const dept = distribution[entry.department];

            // If there's still capacity in next most compatible department, assign the employee there.
            if (dept.employees.length < dept.capacity) {
                dept.employees.push({
                    name: employeeName,
                    score: entry.compatibility,
                    fallback: true
                });
                assigned.add(employeeName);
                break;
            }
        }
    }

    // Assign any remaining employees to an unassigned list if they couldn't be placed in any department due to capacity limits.
    const unassigned = [];
    for (let i = 0; i < employees.length; i++) {
        if (!assigned.has(employees[i].name)) {
            unassigned.push(employees[i].name);
        }
    }

    // Calculate the average compatibility score for each department.
    const departmentAverages = {};
    let companyTotal = 0;
    let companyCount = 0;

    // Calculate average for each department and overall company average.
    for (const deptName in distribution) {
        const dept = distribution[deptName];
        let deptTotal = 0;

        for (const emp of dept.employees) {
            deptTotal += emp.score;
            companyTotal += emp.score;
            companyCount++;
        }

        // Average for this department (0 if no employees were assigned)
        departmentAverages[deptName] = dept.employees.length > 0
            ? deptTotal / dept.employees.length
            : 0;
    }

    // Average across all assigned employees
    const companyAverage = companyCount > 0 ? companyTotal / companyCount : 0;

    // Print distribution results
    console.log("");
    console.log("Fårup Sommerland employee distribution:");
    console.log("-----------------------------------");
    console.log("Number of departments: " + departments.length);
    console.log("Number of employees: " + employees.length);
    console.log("");
    for (const deptName in distribution) {
        const dept = distribution[deptName];
        console.log(`  ${deptName} (${dept.employees.length}/${dept.capacity}):`);
        for (const emp of dept.employees) {
            const tag = emp.fallback ? " [fallback]" : "";
            console.log(`    - ${emp.name} (${emp.score.toFixed(1)}%)${tag}`);
        }
        console.log(`    Average: ${departmentAverages[deptName].toFixed(1)}%`);
        console.log("");
    }
    console.log("-----------------------------------");

    console.log(`\nOverall company average: ${companyAverage.toFixed(1)}%`);
    console.log(`Total assigned employees: ${assigned.size}/${employees.length}`);
    if (unassigned.length > 0) {
        console.log("\nCould not be placed (no capacity left):");
        for (const name of unassigned) {
            console.log(`  - ${name}`);
        }
    }
    console.log("");    
    console.log("-----------------------------------");

}

// Export the function so you can use it in other files.
module.exports = { distributeEmployees };

distributeEmployees();