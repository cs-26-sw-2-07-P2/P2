function responseData() {
    const res = await fetch("/api/response");
    const data = await res.json();

    const answerMap = {};

    if (data.response) {
    data.response.answers.forEach(a => {
        answerMap[a.questionId] = a.value;
    });
    }

    const value = answerMap[item.id] || 1;
}

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

function calculateCompatibility(departments, parameters, employees) {
    const results = [];

    // Defining the maximum and minimum values for the parameters to calculate the maximum possible difference.
    const MAX_VALUE = 5;
    const MIN_VALUE = 1;
    const maxDifference = MAX_VALUE - MIN_VALUE;

    // For each department we go over every employee.
    for (let x = 0; x < departments.length; x++) {
        const currentDepartment = departments[x];

        // For each employee we calculate the compatibility with each department based on the parameters.
        for (let y = 0; y < employees.length; y++) {
            const currentEmployee = employees[y];
            let accuracyScore = [];

            // Calculate the difference for each parameter and store it in accuracyScore. The output of this loop has to be positive, so we have a few different cases to calculate the difference.
            for (let z = 0; z < parameters.length; z++) {
                // If the department's weight for this parameter is higher than the employee's answer, sumtract the employee's answer from the department's weight to get the difference.
                if (currentDepartment.weight[z] > currentEmployee.answers[z]) {
                    accuracyScore[z] = currentDepartment.weight[z] - currentEmployee.answers[z];
                } 
                // If the employee's answer is higher than the department's weight, subtract the department's weight from the employee's answer to get the difference.
                else if (currentDepartment.weight[z] < currentEmployee.answers[z]) {
                    accuracyScore[z] = currentEmployee.answers[z] - currentDepartment.weight[z];
                } 
                // If the values are equal, the difference is 0.
                else {
                    accuracyScore[z] = 0;
                }
            }

            // Calculate the accuracyScore total and average difference.
            let total = 0;
            for (let i = 0; i < accuracyScore.length; i++) {
                total += accuracyScore[i];
            }

            // Average difference, then calculate compatibility as a percentage.
            const averageDifference = total / accuracyScore.length;
            const compatibility = (1 - (averageDifference / maxDifference)) * 100;

            // Store the results for use in department_assign.js.
            results.push({
                employee: currentEmployee.name,
                department: currentDepartment.name,
                compatibility: compatibility
            });
        }
    }

    return results;
}

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