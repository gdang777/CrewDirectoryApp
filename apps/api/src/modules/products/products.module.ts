import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PriceScrapingService } from './price-scraping.service';
import * as entities from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
  controllers: [ProductsController],
  providers: [ProductsService, PriceScrapingService],
  exports: [ProductsService],
})
export class ProductsModule {}
