import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type UserWithRole = User & { role: Role };
export type SafeUser = Omit<UserWithRole, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        department: dto.department || null,
        status: dto.status || 'Active',
        role: {
          connect: { id: dto.roleId },
        },
      },
      include: {
        role: true,
      },
    });

    const safeUser = this.removePassword(user);

    if (!safeUser) {
      throw new Error('Failed to create user');
    }

    return safeUser;
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => this.removePassword(user)).filter(Boolean) as SafeUser[];
  }

  async findByEmail(email: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    return this.removePassword(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<SafeUser> {
    const updateData: any = { ...dto };

    if (dto.email) {
      updateData.email = dto.email.toLowerCase();
    }

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.roleId) {
      updateData.role = {
        connect: { id: dto.roleId },
      };
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    const safeUser = this.removePassword(user);
    if (!safeUser) {
      throw new Error('Failed to update user');
    }
    return safeUser;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  removePassword(user: any): SafeUser | null {
    if (!user) {
      return null;
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
