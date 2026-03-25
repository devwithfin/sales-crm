import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { generateMenuPages } from '../src/utils/menu-page-generator';

const prisma = new PrismaClient();

async function main() {
  await generateMenuPages(prisma);
  console.log('Updated generated menu pages');
}

main()
  .catch((error) => {
    console.error('Failed to generate menu pages', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
