// In this file we calculate the compatibility between employees and departments based 
// on their answers and the department weights. The function takes in three parameters: 
// departments, parameters, and employees. 
// It returns an array of objects containing the employee name, department name, and compatibility percentage.
// The compatibility is calculated by finding the average difference between the employee's answers and the department's weights,
// and then converting that average difference into a percentage based on the maximum possible difference.

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
// Export the function to be used in department_assign.js.
module.exports = { calculateCompatibility };