const prisma = require("./prismaClient");

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

    /* The idea is for each employee their response to the questionnaire gets compare to the departments KEY here are the
    parameters that correspond to eachother from response to jobs meaning they can be compare the idea is an implemented
    math formula 1-(x_1-x_2) where x_1 > x_2 they are each the compared parameters... the weight are given from 1-5 but should
    be turned from 0-1 meaing 0, 0.25, 0.5, 0.75, 1 instead of 1, 2, 3, 4, 5 so the formula works as: 1-(0.25-0.25) = 1 meaning
    100% agree or 1-(0.5-0.25) = 0.75 meaning 75% agree then for all parameters compared from the response and each job a total
    compatibility score is calculated for example: cleaning: 89% customer service: 76% It: 40% and that gets made into a priority
    array for each employee. lasty it should return som result for the next function distributeEmployees(result) */

}

// Function to distribute employees into departments based on their compatibility scores and department capacities.
function distributeEmployees(result) {

    /* This function should distribute employees to jobs keep in mind capacity.. the idea is first i allow everyone to get
    their 1. priority then i check and sort the jobs/departments on Current amount / Capacity to filter... it should Look
    for the employees with the highest second priority and put them there until i have the highest average compatibility for
    all departments */

}

Algorithm();