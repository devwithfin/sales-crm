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
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Get(':id/permissions')
  getPermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(id);
  }

  @Patch(':id/permissions')
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
  remove(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
