import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @CheckPermissions('permissions-view')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Post()
  @CheckPermissions('permissions-create')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Delete(':id')
  @CheckPermissions('permissions-delete')
  remove(@Param('id') id: string) {
    return this.permissionsService.delete(id);
  }
}
