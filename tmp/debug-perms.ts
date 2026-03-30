import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPermissions() {
  try {
    const permissions = await prisma.permission.findMany({
        where: { name: { contains: 'product-category', mode: 'insensitive' } }
    });
    
    console.log('--- FOUND PERMISSIONS ---');
    console.log(JSON.stringify(permissions, null, 2));

    const roles = await prisma.role.findMany({
        include: {
            permissions: {
                include: {
                    permission: true
                }
            }
        }
    });

    console.log('\n--- ROLES & THEIR PERMISSIONS ---');
    roles.forEach(role => {
        const perms = role.permissions.map(rp => rp.permission.name);
        console.log(`Role [${role.name}]: ${perms.join(', ')}`);
    });

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPermissions();
