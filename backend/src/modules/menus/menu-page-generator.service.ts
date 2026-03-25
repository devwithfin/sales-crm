import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateMenuPages } from '../../utils/menu-page-generator';

@Injectable()
export class MenuPageGeneratorService {
  private readonly logger = new Logger(MenuPageGeneratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async regenerate() {
    try {
      await generateMenuPages(this.prisma);
    } catch (error) {
      this.logger.error('Failed to regenerate menu pages', error);
    }
  }
}
