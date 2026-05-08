const prisma = require("./prismaClient");

/*
ALGORITHM OVERVIEW:

This algorithm assigns employees to departments based on preference similarity.

Steps/parts:
1. Convert questionnaire answers into normalized preference vectors
2. Compute compatibility between each employee and each job
3. Rank jobs per employee (priority list 1st, 2nd 3rd etc.)
4. Assign each employee to their best match (initially)
5. Resolve capacity conflicts using a greedy reassignment strategy checking for optimalities
6. Calculate final system metrics (job averages, fill rates, total score)

NOTE:
This is a heuristic optimization algorithm (it does not guarante global optimum),
but designed to produce high-quality, explainable assignments efficiently through priority lists.
*/

// Algorithm that utilizes 3-steps to assign departments for employees
// The algorithm will be named = Priority-Based Compatibility Algorithm (PBCA)
async function PBC_Algorithm() {
    const { responses, jobs } = await getAlgorithmData(); // Fetches responses and jobs/departments directly from DB

    const compatibilityResults = calculateCompatibility(responses, jobs); // returns a list of priority lists of all employees that have answered a questionnaire.

    const assignments = distributeEmployees(compatibilityResults, jobs);

    console.log(assignments); // log job/department assignment and total compatiblity score aka systemScore.
}

async function getAlgorithmData() {
    const responses = await prisma.response.findMany({
        include: {
            employee: {
                include: {
                    user: true
                }
            },
            answers: {
                include: {
                    question: {
                        include: {
                            parameter: true
                        }
                    }
                }
            }
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

// Converts values from 1–5 scale into 0–1 range for compatibility calculation
// This ensures all parameters are comparable mathematically
function normalize(value) {
    return value / 5;
}

// For each employee, build a priority list of all jobs ranked by compatibility score
function calculateCompatibility(responses, jobs) {

    const results = [];

    for (const response of responses) {

        const employeeAnswers = {};

        // Create parameter lookup by normalizing value.
        for (const answer of response.answers) {

            const parameterName =
                answer.question.parameter.name;

            employeeAnswers[parameterName] =
                normalize(answer.value); // Convert 1–5 → 0–1 scale
        }

        const priorities = [];

        // Priority list this is done for each employee
        for (const job of jobs) {

            let totalSimilarity = 0;
            let parameterCount = 0;

            for (const jobParam of job.parameters) {

                const parameterName =
                    jobParam.parameter.name;

                const employeeValue =
                    employeeAnswers[parameterName];

                const departmentValue =
                    normalize(jobParam.weight);

                const similarity = 1 - Math.abs(employeeValue - departmentValue); // our formula for finding similarity

                totalSimilarity += similarity;

                parameterCount++;
            }

            const compatibility = totalSimilarity / parameterCount; // find actual compatibility from average of totalsimilarity score

            // Add the priority
            priorities.push({
                jobId: job.id,
                jobName: job.name,
                compatibility
            });
        }

        // Sort all priorities in order of most to least compatible
        priorities.sort(
            (a, b) =>
                b.compatibility - a.compatibility
        );

        // Finally we add the results of the current employee to the list of results
        results.push({
            employeeId: response.employee.id,
            username: response.employee.user.username,
            priorities
        });
    }

    return results; // lastly we return a list of priority lists of all employees that have answered a questionnaire.
}

function distributeEmployees(results, jobs) {

    const jobMap = {}; // simply a list of all jobs/departments

    // Initialize jobs
    for (const job of jobs) {
        jobMap[job.id] = {
            id: job.id,
            name: job.name,
            capacity: job.capacity,
            amount: 0,
            employees: []
        };
    }

    // Initial assignment based on priority 1
    for (const employee of results) {

        const best = employee.priorities[0];

        jobMap[best.jobId].employees.push({
            employee,
            compatibility: best.compatibility,
            priorityIndex: 0
        });
    }

    let overloaded = true;

    // Fix capacity violations for each job
    while (overloaded) {

        overloaded = false;

        for (const jobId in jobMap) {

            const job = jobMap[jobId];

            // Will remove a candidate(employee) until capacity is no longer overloaded
            while (job.employees.length > job.capacity) {

                overloaded = true;

                const candidates = job.employees.map(emp => {

                    const current = emp.compatibility;

                    // Find their next priority
                    const nextPriority =
                        emp.employee.priorities[
                            emp.priorityIndex + 1
                        ];

                    // If they have a next priority check its compatibility
                    const nextCompatibility =
                        nextPriority
                            ? nextPriority.compatibility
                            : 0;

                    // Very important -> we look at the loss it would take to move this employee out of this job
                    return {
                        ...emp,
                        loss: current - nextCompatibility
                    };
                });

                // We then sort all candidates by least to most loss of moving them
                candidates.sort((a, b) => a.loss - b.loss);

                const moveEmployee = candidates[0]; // Then we move the one that has the lowest compatibility loss

                // Now we actually move the employee filter checks every employee until they find candidates[0]
                job.employees = job.employees.filter(
                    e =>
                        e.employee.employeeId !==
                        moveEmployee.employee.employeeId
                );

                // Now we reassign the employee to a new job/department by indexing priority
                for (let i = moveEmployee.priorityIndex + 1; i < moveEmployee.employee.priorities.length; i++) {
                    const nextPriority = moveEmployee.employee.priorities[i];

                    const nextJob = jobMap[nextPriority.jobId];

                    // important we only assign them to a new job/department if there is actually space.
                    if (nextJob.employees.length < nextJob.capacity) {

                        // Finally we actually reassign the employee once we're sure they should and can be placed here.
                        nextJob.employees.push({
                            employee: moveEmployee.employee,
                            compatibility: nextPriority.compatibility,
                            priorityIndex: i
                        });

                        break;
                    }
                }
            }
        }
    }

    /*
    Final evaluation metrics:

    - job.amount → number of assigned employees
    - job.averageCompatibility → quality of assignment per department
    - job.fillRate → how full each department is
    - systemScore → overall assignment quality across all employees/jobs

    These metrics are used to evaluate how well the algorithm performed and will be displayed in the frontend dashboard for the manager.
    */
    let totalCompatibility = 0;
    let totalEmployees = 0;

    // Find compatibility scores for all jobs
    for (const jobId in jobMap) {

        const job = jobMap[jobId];

        job.amount = job.employees.length; // Amount of people in that specific job/department

        let jobTotal = 0;

        // Find total compatibility of all employees
        for (const e of job.employees) {
            jobTotal += e.compatibility;
        }

        // The average compatibility of one job from all employees
        job.averageCompatibility = job.amount > 0 ? jobTotal / job.amount : 0;

        // Capacity usage
        job.fillRate = job.capacity > 0 ? job.amount / job.capacity : 0;

        totalCompatibility += jobTotal;
        totalEmployees += job.amount;
    }

    const systemScore = totalEmployees > 0 ? totalCompatibility / totalEmployees : 0; // global satisfaction average for all employees

    return { jobMap, systemScore };
}

// Function to display data fetched from DB to get an overview
function displayData(responses, jobs) {
    console.log("\n========== RESPONSES ==========\n");

    responses.forEach((response) => {
        console.log(`Response ID: ${response.id}`);

        console.log(`Employee ID: ${response.employee.id}`);
        console.log(`Username: ${response.employee.user.username}`);

        console.log("Answers:");

        response.answers.forEach((answer) => {
            console.log(`  - Question ID: ${answer.questionId}`);
            console.log(`    Value: ${answer.value}`);
        });

        console.log("-----------------------------------");
    });

    console.log("\n========== JOBS ==========\n");

    jobs.forEach((job) => {
        console.log(`Job ID: ${job.id}`);
        console.log(`Name: ${job.name}`);
        console.log(`Capacity: ${job.capacity}`);
        console.log(`Current Amount: ${job.amount}`);

        console.log("Parameters:");

        job.parameters.forEach((param) => {
            console.log(`  - Parameter: ${param.parameter.name}`);
            console.log(`    Weight: ${param.weight}`);
        });

        console.log("-----------------------------------");
    });
}

PBC_Algorithm();

/*
===== Algorithm Description =====
The algorithm is a greedy heuristic for solving a constrained assignment problem. 
It first computes a compatibility matrix between employees and jobs using a normalized similarity function. 
Each employee then constructs a ranked preference list of jobs. 
The assignment phase initially assigns employees to their highest-ranked job, 
after which capacity violations are resolved through iterative reallocation based on minimal compatibility loss. 
Finally, system-wide performance metrics are computed to evaluate assignment quality.

Note: It is greedy since it locally evaluates per job and dosen't consider the whole picture (All jobs compared)

The time complexity becomes
O(E^2⋅J) because O(E⋅J⋅P+E⋅J⋅log(J))

E = Number of employees
J = Number of jobs (departments)
P = Number of parameters per job
*/