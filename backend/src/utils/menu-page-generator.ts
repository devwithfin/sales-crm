import type { Menu, PrismaClient } from '@prisma/client';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

type MenuRecord = Pick<Menu, 'menuName' | 'menuLink' | 'modelName'>;

export type MenuPageGeneratorOptions = {
  appSrcDir?: string;
};

function toPascalCase(value: string) {
  return value
    .split(/[-_\s/]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

async function fileExists(targetPath: string) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

function ensureLeadingSlash(link: string) {
  if (!link.startsWith('/')) {
    return `/${link}`;
  }
  return link;
}

function createComponentTemplate(menu: MenuRecord) {
  const componentName = `${toPascalCase(menu.modelName!)}Page`;

  return `import React from "react"

export default function ${componentName}() {
    return (
        <div className="p-10 space-y-4">
            <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">${ensureLeadingSlash(
                  menu.menuLink!,
                )}</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">${menu.menuName}</h1>
            </div>
            <p className="text-slate-500">This page was auto-generated. Replace this placeholder with real content.</p>
        </div>
    )
}
`;
}

function createRoutesTemplate(
  menus: MenuRecord[],
) {
  const entries = menus
    .map(
      (menu) => `  {
    path: "${ensureLeadingSlash(menu.menuLink!)}",
    Component: lazy(() => import("@/pages/generated/${menu.modelName}/index")),
  }`,
    )
    .join(',\n');

  return `/* eslint-disable */
import { lazy, type LazyExoticComponent } from "react"

type GeneratedRoute = {
    path: string
    Component: LazyExoticComponent<() => JSX.Element>
}

export const genMenuRoutes: GeneratedRoute[] = [
${entries}
]
`;
}

async function ensureStub(
  menu: MenuRecord,
  generatedDir: string,
) {
  const filePath = path.join(generatedDir, `${menu.modelName}.tsx`);

  await fs.mkdir(generatedDir, { recursive: true });

  const alreadyExists = await fileExists(filePath);
  if (alreadyExists) {
    return;
  }

  await fs.writeFile(filePath, createComponentTemplate(menu), 'utf8');
}

export async function generateMenuPages(
  prisma: PrismaClient,
  options?: MenuPageGeneratorOptions,
) {
  const appSrcDir =
    options?.appSrcDir ?? path.resolve(process.cwd(), '../app/src');
  const generatedPagesDir = path.join(appSrcDir, 'pages/generated');
  const routesFile = path.join(
    appSrcDir,
    'routes/GenMenuRoutes.tsx',
  );

  const menus = await prisma.menu.findMany({
    where: {
      menuLink: { not: null },
      modelName: { not: null },
    },
    orderBy: [
      { menuLevel: 'asc' },
      { menuOrder: 'asc' },
      { createdAt: 'asc' },
    ],
    select: {
      menuName: true,
      menuLink: true,
      modelName: true,
    },
  });

  const validMenus = menus.filter(
    (menu): menu is MenuRecord =>
      typeof menu.menuLink === 'string' &&
      typeof menu.modelName === 'string' &&
      menu.menuLink.length > 0 &&
      menu.modelName.length > 0,
  );

  if (validMenus.length === 0) {
    await fs.writeFile(
      routesFile,
      `/* eslint-disable */
import { lazy, type LazyExoticComponent } from "react"

type GeneratedRoute = {
    path: string
    Component: LazyExoticComponent<() => JSX.Element>
}

export const genMenuRoutes: GeneratedRoute[] = []
`,
      'utf8',
    );
    return;
  }

  await fs.mkdir(generatedPagesDir, { recursive: true });

  for (const menu of validMenus) {
    await ensureStub(menu, generatedPagesDir);
  }

  const routesContent = createRoutesTemplate(validMenus);
  await fs.writeFile(routesFile, routesContent, 'utf8');
}
