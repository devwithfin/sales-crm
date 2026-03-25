import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { MenuPageGeneratorService } from './menu-page-generator.service';

@Module({
  providers: [MenusService, MenuPageGeneratorService],
  controllers: [MenusController],
})
export class MenusModule {}
