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

// Algorithm that utilizes 3-steps to assign departments for employees
async function Algorithm() {
    const { responses, jobs } = await getAlgorithmData();

    const result = calculateCompatibility(responses, jobs);

    distributeEmployees(result);
}

// Function to calculate each employees compatibility with certain departments
function calculateCompatibility(responses, jobs) {
    


    return result;
}

// Function to distribute employees into departments based on their compatibility scores and department capacities.
function distributeEmployees() {


}