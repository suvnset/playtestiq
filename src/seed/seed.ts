import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.upsert({
    where: {
      apiKey: "demo_api_key",
    },
    update: {},
    create: {
      name: "Demo Platformer",
      apiKey: "demo_api_key",
    },
  });

  console.log("Seeded project:", project);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });