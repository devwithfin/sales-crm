import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@crm.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'password123';

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`Seed skipped: user ${adminEmail} already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      fullName: 'Administrator',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log('Seeded admin account:', {
    email: user.email,
    password: adminPassword,
    role: adminRole.name,
  });
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
