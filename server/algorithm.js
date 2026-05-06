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

    const profiles = profileEmployees(responses);

    const results = calculateCompatibility(responses, jobs);

    distributeEmployees(results);
}

function profileEmployees(responses) {

}

function calculateCompatibility(responses, jobs) {

    return results;
}

// Function to distribute employees into departments based on their compatibility scores and department capacities.
function distributeEmployees() {


}