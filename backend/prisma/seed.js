const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.article.create({
    data: {
      title: 'Test Article',
      category: 'blog',
      blocks: [
        { type: 'heading', content: 'Welcome to Ahab\'s Dream' },
        { type: 'paragraph', content: 'This is your first seeded article.' }
      ]
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
