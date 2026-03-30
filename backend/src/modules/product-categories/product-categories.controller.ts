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
  import { ProductCategoriesService } from './product-categories.service';
  import { CreateProductCategoryDto } from './dto/create-product-category.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { PermissionsGuard } from '../auth/guards/permissions.guard';
  import { CheckPermissions } from '../auth/decorators/permissions.decorator';
  
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Controller('category-product')
  export class ProductCategoriesController {
    constructor(private readonly service: ProductCategoriesService) {}
  
    @Get()
    @CheckPermissions('category-product-view')
    findAll() {
      return this.service.findAll();
    }
  
    @Get(':id')
    @CheckPermissions('category-product-view')
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    @Post()
    @CheckPermissions('category-product-create')
    create(@Body() dto: CreateProductCategoryDto) {
      return this.service.create(dto);
    }
  
    @Patch(':id')
    @CheckPermissions('category-product-edit')
    update(@Param('id') id: string, @Body() dto: CreateProductCategoryDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    @CheckPermissions('category-product-delete')
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  
