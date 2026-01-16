import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Product,
  Price,
  PriceHistory,
  AffiliateLink,
  QRScan,
} from './entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(AffiliateLink)
    private affiliateLinkRepository: Repository<AffiliateLink>,
    @InjectRepository(QRScan)
    private qrScanRepository: Repository<QRScan>
  ) {}

  async findAll(category?: string): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.prices', 'prices');

    if (category) {
      query.where('product.category = :category', { category });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['prices', 'affiliateLinks'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async comparePrices(
    productId: string,
    cityCode: string,
    homeBaseCode: string
  ): Promise<{ current: Price; homeBase: Price; deltaPercent: number }> {
    const currentPrice = await this.priceRepository.findOne({
      where: { productId, cityCode },
      order: { createdAt: 'DESC' },
    });

    const homeBasePrice = await this.priceRepository.findOne({
      where: { productId, cityCode: homeBaseCode },
      order: { createdAt: 'DESC' },
    });

    if (!currentPrice || !homeBasePrice) {
      throw new NotFoundException('Price data not available for comparison');
    }

    const deltaPercent =
      ((currentPrice.amount - homeBasePrice.amount) / homeBasePrice.amount) *
      100;

    return {
      current: currentPrice,
      homeBase: homeBasePrice,
      deltaPercent,
    };
  }

  async createAffiliateLink(
    productId: string,
    url: string,
    commissionPercent: number = 5
  ): Promise<AffiliateLink> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const link = this.affiliateLinkRepository.create({
      product,
      url,
      commissionPercent,
    });

    return this.affiliateLinkRepository.save(link);
  }

  async scanQR(
    qrCode: string,
    userId: string,
    cityCode: string
  ): Promise<QRScan> {
    const scan = this.qrScanRepository.create({
      qrCode,
      userId,
      cityCode,
      commissionAmount: 0.2, // $0.20 per scan
    });

    return this.qrScanRepository.save(scan);
  }

  async getProductsWithPriceDelta(
    cityCode: string,
    homeBaseCode: string,
    minDeltaPercent: number = 15
  ): Promise<{ product: Product; comparison: any }[]> {
    // This would typically be done with a more complex query
    // For now, simplified implementation
    const products = await this.findAll();
    const productsWithDelta = [];

    for (const product of products) {
      try {
        const comparison = await this.comparePrices(
          product.id,
          cityCode,
          homeBaseCode
        );
        if (Math.abs(comparison.deltaPercent) >= minDeltaPercent) {
          productsWithDelta.push({ product, comparison });
        }
      } catch (error) {
        // Skip products without price data
      }
    }

    return productsWithDelta;
  }

  async createProduct(data: {
    name: string;
    description: string;
    category: string;
    price: number;
    currency: string;
    cityCode: string;
  }): Promise<Product> {
    // Check if product exists by name (simplified check)
    let product = await this.productRepository.findOne({
      where: { name: data.name },
    });

    if (!product) {
      product = this.productRepository.create({
        name: data.name,
        description: data.description,
        category: data.category,
        sku: data.name.toUpperCase().replace(/\s+/g, '-').slice(0, 20), // Simple SKU generation
        metadata: {},
      });
      await this.productRepository.save(product);
    }

    // Add price entry
    const price = this.priceRepository.create({
      product,
      amount: data.price,
      currency: data.currency,
      cityCode: data.cityCode,
    });
    await this.priceRepository.save(price);

    return this.findOne(product.id);
  }
}
