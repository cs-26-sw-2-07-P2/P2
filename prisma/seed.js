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
      return res.status(400).json({ error: "User already exists" });
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
  const amountofEmployees = 20;

  createEmployees(amountofEmployees);

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
      { name: "Cleaning", capacity: 20, amount: 0 },
      { name: "Ride Operator", capacity: 20, amount: 0 },
      { name: "Restaurant", capacity: 10, amount: 0 },
      { name: "Security", capacity: 10, amount: 0 },
      { name: "Maintenance", capacity: 5, amount: 0 },
      { name: "Sales", capacity: 10, amount: 0 },
      { name: "Ticket Scanner", capacity: 10, amount: 0 },
      { name: "Customer Service", capacity: 20, amount: 0 },
      { name: "Perfomer", capacity: 5, amount: 0 },
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
  await prisma.jobParameter.createMany({
    data: [

      // Cleaning
      {
        jobId: getJob("Cleaning").id,
        parameterId: getParameter("Indoor Work").id,
        weight: 5
      },
      {
        jobId: getJob("Cleaning").id,
        parameterId: getParameter("Teamwork").id,
        weight: 2
      },

      // Ride Operator
      {
        jobId: getJob("Ride Operator").id,
        parameterId: getParameter("Customer Service").id,
        weight: 5
      },
      {
        jobId: getJob("Ride Operator").id,
        parameterId: getParameter("Communication skills").id,
        weight: 4
      },

      // Restaurant
      {
        jobId: getJob("Restaurant").id,
        parameterId: getParameter("Teamwork").id,
        weight: 5
      },
      {
        jobId: getJob("Restaurant").id,
        parameterId: getParameter("Customer Service").id,
        weight: 4
      },

      // Security
      {
        jobId: getJob("Security").id,
        parameterId: getParameter("Problem Solving").id,
        weight: 5
      },

      // Maintenance
      {
        jobId: getJob("Maintenance").id,
        parameterId: getParameter("Technical Skills").id,
        weight: 5
      },

      // Performer
      {
        jobId: getJob("Perfomer").id,
        parameterId: getParameter("Entertainment").id,
        weight: 5
      }

    ],
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