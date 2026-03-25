import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const roles = await this.prisma.role.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      userCount: role._count.users,
    }));
  }

  async findById(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      id: role.id,
      name: role.name,
    };
  }

  async getRolePermissions(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const [permissions, assignedPermissions] = await Promise.all([
      this.prisma.permission.findMany({
        orderBy: { name: 'asc' },
      }),
      this.prisma.rolePermission.findMany({
        where: { roleId },
        select: { permissionId: true },
      }),
    ]);

    const assignedSet = new Set(
      assignedPermissions.map((permission) => permission.permissionId),
    );

    return permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      assigned: assignedSet.has(permission.id),
    }));
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const uniquePermissionIds = Array.from(new Set(permissionIds));

    const validPermissionIds = await this.prisma.permission.findMany({
      where: { id: { in: uniquePermissionIds } },
      select: { id: true },
    });

    await this.prisma.$transaction(async (transaction) => {
      await transaction.rolePermission.deleteMany({
        where: { roleId },
      });

      if (validPermissionIds.length === 0) {
        return;
      }

      await transaction.rolePermission.createMany({
        data: validPermissionIds.map((permission) => ({
          roleId,
          permissionId: permission.id,
        })),
        skipDuplicates: true,
      });
    });

    return { success: true };
  }

  async delete(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.name === 'admin') {
      throw new BadRequestException('Default admin role cannot be removed');
    }

    if (role._count.users > 0) {
      throw new BadRequestException(
        'Role is still assigned to existing users',
      );
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.rolePermission.deleteMany({
        where: { roleId },
      });

      await transaction.role.delete({
        where: { id: roleId },
      });
    });

    return { success: true };
  }
}
