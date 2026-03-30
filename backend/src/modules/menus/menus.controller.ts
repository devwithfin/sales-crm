import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenusService, MenuNode } from './menus.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { SafeUser } from '../users/users.service';
import { Request } from 'express';
import { CreateMenuDto } from './dto/create-menu.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  getMenus(@Req() req: Request & { user: SafeUser }): Promise<MenuNode[]> {
    return this.menusService.getMenusForRole(req.user.roleId);
  }

  @Get('all')
  @CheckPermissions('menus-view')
  getAllMenus(): Promise<MenuNode[]> {
    return this.menusService.getAllMenus();
  }

  @Post()
  @CheckPermissions('menus-create')
  createMenu(@Body() dto: CreateMenuDto) {
    return this.menusService.createMenu(dto);
  }

  @Delete(':id')
  @CheckPermissions('menus-delete')
  removeMenu(@Param('id') id: string) {
    return this.menusService.deleteMenu(id);
  }

  @Patch(':id')
  @CheckPermissions('menus-edit')
  updateMenu(@Param('id') id: string, @Body() dto: CreateMenuDto) {
    return this.menusService.updateMenu(id, dto);
  }

  @Get(':id')
  @CheckPermissions('menus-view')
  getMenu(@Param('id') id: string) {
    return this.menusService.getMenuById(id);
  }
}
