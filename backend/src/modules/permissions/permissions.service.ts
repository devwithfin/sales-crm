import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreatePermissionDto) {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('Permission name is required');
    }

    const existing = await this.prisma.permission.findUnique({
      where: { name },
    });

    if (existing) {
      throw new BadRequestException('Permission already exists');
    }

    return this.prisma.permission.create({
      data: { name },
    });
  }

  async delete(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const menuUsage = await this.prisma.menu.count({
      where: { permissionName: permission.name },
    });

    if (menuUsage > 0) {
      throw new BadRequestException(
        'Permission is still attached to one or more menus',
      );
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.rolePermission.deleteMany({
        where: { permissionId: id },
      });

      await transaction.permission.delete({
        where: { id },
      });
    });

    return { success: true };
  }
}
