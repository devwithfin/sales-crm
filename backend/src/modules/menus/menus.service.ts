import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuPageGeneratorService } from './menu-page-generator.service';

export interface MenuNode {
  id: string;
  name: string;
  level: number;
  order: number;
  icon: string | null;
  link: string | null;
  model: string | null;
  permission: string | null;
  children: MenuNode[];
}

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly menuPageGenerator: MenuPageGeneratorService,
  ) {}

  async getMenusForRole(roleId: string): Promise<MenuNode[]> {
    const roleWithPermissions = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleWithPermissions) {
      return [];
    }

    const allowedPermissions = new Set(
      roleWithPermissions.permissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    );

    const menus = await this.prisma.menu.findMany({
      orderBy: [
        { menuLevel: 'asc' },
        { menuOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    const menuMap = new Map<
      string,
      MenuNode & { parentId: string | null }
    >();
    const roots: MenuNode[] = [];

    menus.forEach((menu) => {
      menuMap.set(menu.id, {
        id: menu.id,
        name: menu.menuName,
        level: menu.menuLevel,
        order: menu.menuOrder,
        icon: menu.menuIcon ?? null,
        link: menu.menuLink ?? null,
        model: menu.modelName ?? null,
        permission: menu.permissionName ?? null,
        parentId: menu.parentId ?? null,
        children: [],
      });
    });

    menuMap.forEach((node) => {
      if (node.parentId) {
        const parent = menuMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortTree = (node: MenuNode) => {
      node.children.sort((a, b) => a.order - b.order);
      node.children.forEach(sortTree);
    };

    roots.sort((a, b) => a.order - b.order);
    roots.forEach(sortTree);

    const filterTree = (node: MenuNode): MenuNode | null => {
      const filteredChildren = node.children
        .map(filterTree)
        .filter((child): child is MenuNode => Boolean(child));

      const hasPermission =
        !node.permission || allowedPermissions.has(node.permission);

      if (filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      if (!hasPermission) {
        return null;
      }

      if (!node.permission) {
        return null;
      }

      return {
        ...node,
        children: [],
      };
    };

    return roots
      .map(filterTree)
      .filter((node): node is MenuNode => Boolean(node));
  }

  private normalizePermissionName(menuLink?: string | null): string | null {
    if (!menuLink) {
      return null;
    }

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

    return `${slug}-view`;
  }

  private normalizeModelName(modelName?: string | null): string | null {
    if (!modelName) {
      return null;
    }

    const slug = modelName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!slug) {
      return null;
    }

    return slug;
  }

  async createMenu(dto: CreateMenuDto) {
    if (!dto.menuName?.trim()) {
      throw new BadRequestException('Menu name is required');
    }

    if (typeof dto.menuOrder !== 'number' || Number.isNaN(dto.menuOrder)) {
      throw new BadRequestException('Menu order must be a number');
    }

    if (typeof dto.menuLevel !== 'number' || Number.isNaN(dto.menuLevel)) {
      throw new BadRequestException('Menu level must be a number');
    }

    if (dto.parentId) {
      const parent = await this.prisma.menu.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Parent menu not found');
      }
    }

    const permissionName =
      dto.permissionName ?? this.normalizePermissionName(dto.menuLink);
    const modelName = this.normalizeModelName(dto.modelName);

    if (dto.menuLink && !modelName) {
      throw new BadRequestException(
        'Model name is required when menu link is provided',
      );
    }

    const results = await this.prisma.$transaction(async (transaction) => {
      if (permissionName) {
        await transaction.permission.upsert({
          where: { name: permissionName },
          update: {},
          create: {
            name: permissionName,
          },
        });
      }

      const createdMenu = await transaction.menu.create({
        data: {
          menuName: dto.menuName.trim(),
          menuOrder: dto.menuOrder,
          menuLevel: dto.menuLevel,
          menuIcon: dto.menuIcon?.trim() || null,
          menuLink: dto.menuLink?.trim() || null,
          modelName,
          permissionName: permissionName ?? null,
          parentId: dto.parentId ?? null,
        },
      });

      return createdMenu;
    });

    void this.menuPageGenerator.regenerate();

    return results;
  }

  async deleteMenu(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const childMenus = await this.prisma.menu.count({
      where: { parentId: id },
    });

    if (childMenus > 0) {
      throw new BadRequestException(
        'Please remove child menus before deleting this menu',
      );
    }

    await this.prisma.$transaction(async (transaction) => {
      const permissionName = menu.permissionName ?? null;

      await transaction.menu.delete({
        where: { id },
      });

      if (permissionName) {
        const baseName = permissionName.replace(/-view$/, '');
        const relatedNames = [
          permissionName,
          baseName ? `${baseName}-create` : null,
          baseName ? `${baseName}-edit` : null,
          baseName ? `${baseName}-delete` : null,
        ].filter((name): name is string => Boolean(name));

        for (const currentName of relatedNames) {
          const permission = await transaction.permission.findUnique({
            where: { name: currentName },
          });

          if (!permission) {
            continue;
          }

          if (currentName === permissionName) {
            const otherMenus = await transaction.menu.count({
              where: { permissionName: currentName },
            });

            if (otherMenus > 0) {
              continue;
            }
          }

          await transaction.rolePermission.deleteMany({
            where: { permissionId: permission.id },
          });

          await transaction.permission.delete({
            where: { id: permission.id },
          });
        }
      }
    });

    void this.menuPageGenerator.regenerate();

    return { success: true };
  }
}
