// prisma/seed.ts

import { prisma } from "@/lib/db/prisma";

async function main() {
  await prisma.project.create({
    data: {
      title: 'My First Project',
      slug: 'my-first-project',
      description: 'A description of my first project.',
      content: 'Detailed content of the project.',
      image: 'image-url',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
