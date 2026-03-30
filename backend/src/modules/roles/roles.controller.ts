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
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @CheckPermissions('roles-view')
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @CheckPermissions('roles-create')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get(':id')
  @CheckPermissions('roles-view')
  findOne(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  @Patch(':id')
  @CheckPermissions('roles-edit')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Get(':id/permissions')
  @CheckPermissions('roles-view')
  getPermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(id);
  }

  @Patch(':id/permissions')
  @CheckPermissions('roles-edit')
  updatePermissions(
    @Param('id') id: string,
    @Body() body: UpdateRolePermissionsDto,
  ) {
    return this.rolesService.updateRolePermissions(
      id,
      body.permissionIds ?? [],
    );
  }

  @Delete(':id')
  @CheckPermissions('roles-delete')
  remove(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
