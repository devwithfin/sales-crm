import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { generateMenuPages } from '../src/utils/menu-page-generator';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const adminPermissionNames = new Set<string>();

function normalizePermissionName(menuLink: string): string | null {
  const slugSource = menuLink
    .trim()
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\//g, '-');

  const slug = slugSource
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) {
    return null;
  }

  const [primary] = slug.split('-');

  if (!primary) {
    return null;
  }

  return `${primary}-view`;
}

async function ensurePermission(name: string, grantToAdmin = true) {
  const permission = await prisma.permission.upsert({
    where: { name },
    update: {},
    create: { name },
  });

  if (grantToAdmin) {
    adminPermissionNames.add(name);
  }

  return permission;
}

type MenuSeedInput = {
  menuName: string;
  menuOrder: number;
  menuLevel: number;
  menuIcon: string | null;
  menuLink: string | null;
  parentId: string | null;
  permissionName?: string | null;
  modelName?: string | null;
};

type MenuDefinition = {
  name: string;
  slug: string;
  order: number;
  icon?: string | null;
  link?: string | null;
  permission?: string | null;
  children?: MenuDefinition[];
};

async function upsertMenuWithPermission(
  where: Prisma.MenuWhereUniqueInput,
  data: MenuSeedInput,
) {
  const permissionName =
    data.permissionName !== undefined
      ? data.permissionName
      : data.menuLink !== null
        ? normalizePermissionName(data.menuLink)
        : null;

  if (permissionName) {
    await ensurePermission(permissionName);
  }

  return prisma.menu.upsert({
    where,
    update: {
      menuName: data.menuName,
      menuOrder: data.menuOrder,
      menuLevel: data.menuLevel,
      menuIcon: data.menuIcon,
      menuLink: data.menuLink,
      permissionName,
      parentId: data.parentId,
      modelName: data.modelName ?? null,
    },
    create: {
      menuName: data.menuName,
      menuOrder: data.menuOrder,
      menuLevel: data.menuLevel,
      menuIcon: data.menuIcon,
      menuLink: data.menuLink,
      permissionName,
      parentId: data.parentId,
      modelName: data.modelName ?? null,
    },
  });
}

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
    },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'm';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'password123';

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
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
  } else {
    console.log(`Admin user ${adminEmail} already exists, skipping user creation.`);
  }

  const menuDefinitions: MenuDefinition[] = [
    {
      name: 'General',
      slug: 'general',
      order: 1,
      permission: 'general-view',
      children: [
        {
          name: 'Dashboard',
          slug: 'dashboard',
          order: 1,
          icon: 'layout-dashboard',
          link: '/dashboard',
        },
        {
          name: 'Reports',
          slug: 'reports',
          order: 2,
          icon: 'bar-chart-3',
          link: '/reports',
        },
      ],
    },
    {
      name: 'Sales',
      slug: 'sales',
      order: 2,
      icon: 'shopping-cart',
      children: [
        {
          name: 'Leads',
          slug: 'leads',
          order: 1,
          icon: 'users',
          link: '/leads',
        },
        {
          name: 'Contacts',
          slug: 'contacts',
          order: 2,
          icon: 'user-round',
          link: '/contacts',
        },
        {
          name: 'Accounts',
          slug: 'accounts',
          order: 3,
          icon: 'building',
          link: '/accounts',
        },
        {
          name: 'Deals',
          slug: 'deals',
          order: 4,
          icon: 'briefcase',
          link: '/deals',
        },
        {
          name: 'Visits',
          slug: 'visits',
          order: 5,
          icon: 'map-pin',
          link: '/visits',
        },
      ],
    },
    {
      name: 'Transactions',
      slug: 'transactions',
      order: 3,
      icon: 'credit-card',
      children: [
        {
          name: 'Products',
          slug: 'products',
          order: 1,
          icon: 'box',
          link: '/products',
        },
        {
          name: 'Quotes',
          slug: 'quotes',
          order: 2,
          icon: 'file-text',
          link: '/quotes',
        },
        {
          name: 'Purchase Orders',
          slug: 'purchase-orders',
          order: 3,
          icon: 'scroll-text',
          link: '/purchase-orders',
        },
      ],
    },
    {
      name: 'Config',
      slug: 'config',
      order: 4,
      icon: 'shield-alert',
      permission: 'config-view',
      children: [
        {
          name: 'Menu',
          slug: 'menus',
          order: 1,
          icon: 'menu',
          link: '/menus',
          permission: 'menu-view',
        },
        {
          name: 'Permission',
          slug: 'permissions',
          order: 2,
          icon: 'shield',
          link: '/permissions',
          permission: 'permission-view',
        },
        {
          name: 'Roles',
          slug: 'roles',
          order: 3,
          icon: 'user-cog',
          link: '/roles',
          permission: 'role-view',
        },
        {
          name: 'Users',
          slug: 'users',
          order: 4,
          icon: 'user-plus',
          link: '/users',
        },
      ],
    },
  ];

  const menuSlugs = new Set<string>();

  async function seedMenuTree(
    definition: MenuDefinition,
    parentId: string | null,
    level: number,
  ) {
    const data: MenuSeedInput = {
      menuName: definition.name,
      menuOrder: definition.order,
      menuLevel: level,
      menuIcon: definition.icon ?? null,
      menuLink: definition.link ?? null,
      parentId,
      permissionName:
        definition.permission ??
        (definition.link ? `${definition.slug}-view` : null),
      modelName: definition.slug,
    };

    const menu = await upsertMenuWithPermission(
      { modelName: definition.slug },
      data,
    );

    if (definition.link) {
      menuSlugs.add(definition.slug);
    }

    if (definition.children?.length) {
      for (const child of definition.children) {
        await seedMenuTree(child, menu.id, level + 1);
      }
    }
  }

  for (const definition of menuDefinitions) {
    await seedMenuTree(definition, null, 1);
  }

  const basePermissions = [
    'menu-create',
    'menu-edit',
    'menu-delete',
    'permission-create',
    'permission-edit',
    'permission-delete',
    'role-edit',
    'role-create',
    'role-delete',
  ];

  for (const name of basePermissions) {
    await ensurePermission(name);
  }

  const actions = ['view', 'create', 'edit', 'delete'] as const;

  for (const slug of menuSlugs) {
    for (const action of actions) {
      await ensurePermission(`${slug}-${action}`);
    }
  }

  const permissionNames = Array.from(adminPermissionNames);

  if (permissionNames.length > 0) {
    const permissionsToGrant = await prisma.permission.findMany({
      where: {
        name: {
          in: permissionNames,
        },
      },
      select: {
        id: true,
      },
    });

    await prisma.rolePermission.deleteMany({
      where: { roleId: adminRole.id },
    });

    await prisma.rolePermission.createMany({
      data: permissionsToGrant.map((permission) => ({
        roleId: adminRole.id,
        permissionId: permission.id,
        createdAt: new Date(),
      })),
      skipDuplicates: true,
    });
  }

  await generateMenuPages(prisma);

  console.log('Seeded base menus and permissions');
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
