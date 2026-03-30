import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.productCategory.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
            take: 5,
            orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!category) {
      throw new NotFoundException(`Product Category with ID ${id} not found`);
    }

    return category;
  }

  async create(dto: CreateProductCategoryDto) {
    const existing = await this.prisma.productCategory.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }

    return this.prisma.productCategory.create({
      data: {
        name: dto.name,
      },
    });
  }

  async update(id: string, dto: CreateProductCategoryDto) {
    const category = await this.findOne(id);

    const existingWithName = await this.prisma.productCategory.findFirst({
        where: { 
            name: dto.name,
            id: { not: id } 
        },
    });

    if (existingWithName) {
        throw new ConflictException(`Another category with name "${dto.name}" already exists`);
    }

    return this.prisma.productCategory.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.productCategory.findUnique({
        where: { id },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    if (!category) {
        throw new NotFoundException(`Category not found`);
    }

    if (category._count.products > 0) {
        throw new BadRequestException('Cannot delete category that still has products linked to it');
    }

    return this.prisma.productCategory.delete({
      where: { id },
    });
  }
}
