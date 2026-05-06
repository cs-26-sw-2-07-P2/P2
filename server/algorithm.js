const prisma = require("./prismaClient");

async function getAlgorithmData() {
    const responses = await prisma.response.findMany({
        include: {
            employee: {
                include: {
                    user: true
                }
            },
            answers: true
        }
    });

    const jobs = await prisma.job.findMany({
        include: {
            parameters: {
                include: {
                    parameter: true
                }
            }
        }
    });

    return { responses, jobs };
}

async function Algorithm() {
    const { responses, jobs } = await getAlgorithmData();

    const results = calculateCompatibility(responses, jobs);

    distributeEmployees(results);
}

function calculateCompatibility(responses, jobs) {
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