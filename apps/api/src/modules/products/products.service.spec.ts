import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product, Price, PriceHistory, AffiliateLink, QRScan } from './entities';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let priceRepository: Repository<Price>;

  const mockProductRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPriceRepository = {
    findOne: jest.fn(),
  };

  const mockPriceHistoryRepository = {};
  const mockAffiliateLinkRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockQRScanRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Price),
          useValue: mockPriceRepository,
        },
        {
          provide: getRepositoryToken(PriceHistory),
          useValue: mockPriceHistoryRepository,
        },
        {
          provide: getRepositoryToken(AffiliateLink),
          useValue: mockAffiliateLinkRepository,
        },
        {
          provide: getRepositoryToken(QRScan),
          useValue: mockQRScanRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    priceRepository = module.get<Repository<Price>>(getRepositoryToken(Price));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product' }];
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProducts),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
    });

    it('should filter by category when provided', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockProductRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll('chocolate');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'product.category = :category',
        { category: 'chocolate' },
      );
    });
  });

  describe('comparePrices', () => {
    it('should compare prices between cities', async () => {
      const currentPrice = {
        id: '1',
        amount: 100,
        currency: 'USD',
        cityCode: 'CPH',
      };
      const homeBasePrice = {
        id: '2',
        amount: 80,
        currency: 'USD',
        cityCode: 'JFK',
      };

      mockPriceRepository.findOne
        .mockResolvedValueOnce(currentPrice)
        .mockResolvedValueOnce(homeBasePrice);

      const result = await service.comparePrices('product-1', 'CPH', 'JFK');

      expect(result.current).toEqual(currentPrice);
      expect(result.homeBase).toEqual(homeBasePrice);
      expect(result.deltaPercent).toBe(25); // (100-80)/80 * 100
    });

    it('should throw NotFoundException when price data missing', async () => {
      mockPriceRepository.findOne.mockResolvedValue(null);

      await expect(
        service.comparePrices('product-1', 'CPH', 'JFK'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
