import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SafeUser, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPermissions('users-create')
  create(@Body() dto: CreateUserDto): Promise<SafeUser> {
    return this.usersService.create(dto);
  }

  @Get()
  @CheckPermissions('users-view')
  findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPermissions('users-view')
  findOne(@Param('id') id: string): Promise<SafeUser | null> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @CheckPermissions('users-edit')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<SafeUser> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @CheckPermissions('users-delete')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
