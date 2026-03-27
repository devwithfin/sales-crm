import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  })

  if (!adminRole) {
    console.log('Admin role not found')
    return
  }

  console.log('Admin role ID:', adminRole.id)

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId: adminRole.id },
    include: { permission: true },
  })

  console.log('\nPermissions assigned to admin role:')
  rolePermissions.forEach(rp => {
    console.log(' -', rp.permission.name)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())