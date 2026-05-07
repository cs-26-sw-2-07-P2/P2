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

// Algorithm that utilizes 3-steps to assign departments for employees
async function Algorithm() {
    const { responses, jobs } = await getAlgorithmData();

    displayData(responses, jobs);

    const result = calculateCompatibility(responses, jobs);

    distributeEmployees(result);
}

// Function to calculate each employees compatibility with certain departments
function calculateCompatibility(responses, jobs) {

}

// Function to distribute employees into departments based on their compatibility scores and department capacities.
function distributeEmployees(result) {


}

Algorithm();