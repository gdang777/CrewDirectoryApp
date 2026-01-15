import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  @Get('compare')
  async comparePrices(
    @Query('productId') productId: string,
    @Query('cityCode') cityCode: string,
    @Query('homeBaseCode') homeBaseCode: string,
  ) {
    return this.productsService.comparePrices(productId, cityCode, homeBaseCode);
  }

  @Get('price-delta')
  async getProductsWithPriceDelta(
    @Query('cityCode') cityCode: string,
    @Query('homeBaseCode') homeBaseCode: string,
    @Query('minDelta') minDelta?: string,
  ) {
    return this.productsService.getProductsWithPriceDelta(
      cityCode,
      homeBaseCode,
      minDelta ? parseFloat(minDelta) : 15,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post('affiliate-links')
  @UseGuards(JwtAuthGuard)
  async createAffiliateLink(
    @Body() body: { productId: string; url: string; commissionPercent?: number },
  ) {
    return this.productsService.createAffiliateLink(
      body.productId,
      body.url,
      body.commissionPercent,
    );
  }

  @Post('qr-scan')
  @UseGuards(JwtAuthGuard)
  async scanQR(
    @Body() body: { qrCode: string; cityCode: string },
    @Request() req: any,
  ) {
    return this.productsService.scanQR(body.qrCode, req.user.id, body.cityCode);
  }
}
