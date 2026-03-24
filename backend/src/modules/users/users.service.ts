import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  findByEmail(email: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });
  }

  removePassword(user: UserWithRole | null): SafeUser | null {
    if (!user) {
      return null;
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  findById(id: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }
}
