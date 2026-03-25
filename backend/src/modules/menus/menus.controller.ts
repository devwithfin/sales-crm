import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenusService, MenuNode } from './menus.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SafeUser } from '../users/users.service';
import { Request } from 'express';
import { CreateMenuDto } from './dto/create-menu.dto';

@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  getMenus(@Req() req: Request & { user: SafeUser }): Promise<MenuNode[]> {
    return this.menusService.getMenusForRole(req.user.roleId);
  }

  @Post()
  createMenu(@Body() dto: CreateMenuDto) {
    return this.menusService.createMenu(dto);
  }

  @Delete(':id')
  removeMenu(@Param('id') id: string) {
    return this.menusService.deleteMenu(id);
  }
}
