const prisma = require("../server/prismaClient");
const bcrypt = require("bcrypt");

async function createEmployees(amount) {
  for (let i = 0; i < amount; i++) {
    const password = "123";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let username = "";
    for (const char of chars) {
      username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return console.log("User already exists!");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user in DB
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "EMPLOYEE",
      },
    });

    // create role-specific profile
    await prisma.employee.create({ data: { userId: user.id } });
    }
}

async function main() {
  const amountofEmployees = 100;

  await createEmployees(amountofEmployees);

  // PARAMETERS
  await prisma.parameter.createMany({
    data: [
      { name: "Outdoor Work" },
      { name: "Indoor Work" },
      { name: "Teamwork" },
      { name: "Problem Solving" },
      { name: "Communication skills" },
      { name: "Technical Skills" },
      { name: "Entertainment" },
      { name: "Customer Service" }
    ],
    skipDuplicates: true
  });

  console.log("Seeded parameters");

  // JOBS
  await prisma.job.createMany({
    data: [
      { name: "Cleaning", capacity: 20 },
      { name: "Ride Operator", capacity: 20 },
      { name: "Restaurant", capacity: 10 },
      { name: "Security", capacity: 10 },
      { name: "Maintenance", capacity: 5 },
      { name: "Sales", capacity: 10 },
      { name: "Ticket Scanner", capacity: 10 },
      { name: "Customer Service", capacity: 20 },
      { name: "Perfomer", capacity: 5 },
    ],
    skipDuplicates: true
  });

  console.log("Seeded jobs");

  // FETCH DATA
  const parameters = await prisma.parameter.findMany();
  const jobs = await prisma.job.findMany();
  const employees = await prisma.employee.findMany(); // depends on how many exist

  const manager = await prisma.manager.findFirst(); // just needs one

  if (!manager) {
    throw new Error("No manager exists in database");
  }

  const getParameter = (name) =>
    parameters.find(p => p.name === name);

  const getJob = (name) =>
    jobs.find(j => j.name === name);

// JOB PARAMETERS
const jobWeights = {
  Cleaning: {
    "Outdoor Work": 2,
    "Indoor Work": 5,
    "Teamwork": 3,
    "Problem Solving": 1,
    "Communication skills": 2,
    "Technical Skills": 1,
    "Entertainment": 1,
    "Customer Service": 2
  },

  "Ride Operator": {
    "Outdoor Work": 3,
    "Indoor Work": 2,
    "Teamwork": 4,
    "Problem Solving": 3,
    "Communication skills": 5,
    "Technical Skills": 2,
    "Entertainment": 3,
    "Customer Service": 5
  },

  Restaurant: {
    "Outdoor Work": 1,
    "Indoor Work": 5,
    "Teamwork": 5,
    "Problem Solving": 3,
    "Communication skills": 4,
    "Technical Skills": 1,
    "Entertainment": 1,
    "Customer Service": 5
  },

  Security: {
    "Outdoor Work": 4,
    "Indoor Work": 2,
    "Teamwork": 3,
    "Problem Solving": 5,
    "Communication skills": 4,
    "Technical Skills": 2,
    "Entertainment": 1,
    "Customer Service": 3
  },

  Maintenance: {
    "Outdoor Work": 3,
    "Indoor Work": 3,
    "Teamwork": 2,
    "Problem Solving": 4,
    "Communication skills": 2,
    "Technical Skills": 5,
    "Entertainment": 1,
    "Customer Service": 1
  },

  Sales: {
    "Outdoor Work": 1,
    "Indoor Work": 5,
    "Teamwork": 4,
    "Problem Solving": 3,
    "Communication skills": 5,
    "Technical Skills": 2,
    "Entertainment": 3,
    "Customer Service": 5
  },

  "Ticket Scanner": {
    "Outdoor Work": 3,
    "Indoor Work": 2,
    "Teamwork": 3,
    "Problem Solving": 2,
    "Communication skills": 4,
    "Technical Skills": 1,
    "Entertainment": 2,
    "Customer Service": 5
  },

  "Customer Service": {
    "Outdoor Work": 1,
    "Indoor Work": 5,
    "Teamwork": 4,
    "Problem Solving": 4,
    "Communication skills": 5,
    "Technical Skills": 1,
    "Entertainment": 2,
    "Customer Service": 5
  },

  Perfomer: {
    "Outdoor Work": 2,
    "Indoor Work": 3,
    "Teamwork": 4,
    "Problem Solving": 2,
    "Communication skills": 5,
    "Technical Skills": 1,
    "Entertainment": 5,
    "Customer Service": 4
  }
};

const jobParameterData = [];

// Constructers to create jobs with parameters and their corresponding weight
for (const [jobName, weights] of Object.entries(jobWeights)) {
  const job = getJob(jobName);

  for (const [parameterName, weight] of Object.entries(weights)) {
    const parameter = getParameter(parameterName);

    jobParameterData.push({
      jobId: job.id,
      parameterId: parameter.id,
      weight
    });
  }
}

await prisma.jobParameter.createMany({
  data: jobParameterData,
  skipDuplicates: true
});

console.log("Seeded job parameters");

  // QUESTIONNAIRE
  const questionnaire = await prisma.questionnaire.upsert({
    where: {
      id: 1
    },
    update: {},
    create: {
      id: 1,
      title: "Job Matching Questionnaire",
      createdById: manager.id
    }
  });

  // QUESTIONS
  const existingQuestions = await prisma.question.count();

  if (existingQuestions === 0) {

    await prisma.question.createMany({
      data: [
        {
          text: "Do you enjoy working outdoors?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Outdoor Work").id
        },
        {
          text: "Do you enjoy indoor work?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Indoor Work").id
        },
        {
          text: "Do you enjoy teamwork?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Teamwork").id
        },
        {
          text: "Are you good at problem solving?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Problem Solving").id
        },
        {
          text: "Do you have good communication skills?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Communication skills").id
        },
        {
          text: "Do you enjoy technical tasks?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Technical Skills").id
        },
        {
          text: "Do you enjoy entertaining people?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Entertainment").id
        },
        {
          text: "Do you enjoy helping customers?",
          questionnaireId: questionnaire.id,
          parameterId: getParameter("Customer Service").id
        }
      ]
    });

    console.log("Seeded questions");
  }

  // RESPONSES + ANSWERS
  const questions = await prisma.question.findMany();

  for (const employee of employees) {

    const existingResponse = await prisma.response.findUnique({
      where: {
        employeeId: employee.id
      }
    });

    if (existingResponse) continue;

    const response = await prisma.response.create({
      data: {
        employeeId: employee.id
      }
    });

    // Make all Employees send random responses (Currently to use in Algorithm)
    await prisma.answer.createMany({
      data: questions.map(question => ({
        responseId: response.id,
        questionId: question.id,
        value: Math.floor(Math.random() * 5) + 1 // just add some random value for now
      }))
    });
  }

  console.log("Seeded responses and answers");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });