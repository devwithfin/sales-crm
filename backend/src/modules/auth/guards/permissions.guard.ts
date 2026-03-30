import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no specific permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Safety check: is the user logged in?
    if (!user || (!user.roleId && !user.role)) {
       throw new ForbiddenException('User session or role not found');
    }

    // Role ID is needed to check permissions
    const roleId = user.roleId || user.role?.id;

    // Identify user permissions for their specific role
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
    });

    const userPermissionNames = rolePermissions.map((rp) => rp.permission.name.toLowerCase());

    // Check if the user has ALL required permissions for this route
    const hasAllPermissions = requiredPermissions.every((perm) =>
      userPermissionNames.includes(perm.toLowerCase()),
    );

    if (!hasAllPermissions) {
      const missing = requiredPermissions.filter(
        (p) => !userPermissionNames.includes(p.toLowerCase()),
      );
      throw new ForbiddenException(
        `Access denied. You are missing the following permissions: [${missing.join(', ')}]`,
      );
    }

    return true;
  }
}
