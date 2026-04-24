const prisma = require("../server/prismaClient");

async function main() {
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
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });