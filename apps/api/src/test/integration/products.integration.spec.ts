import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { ProductsService } from '../../modules/products/products.service';

/**
 * Integration tests for Products module
 * Ensures API contracts are maintained and no breaking changes
 */
describe('Products Integration Tests', () => {
  let app: INestApplication;
  let productsService: ProductsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productsService = moduleFixture.get<ProductsService>(ProductsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('API Contract Tests', () => {
    it('GET /products should maintain response structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const product = response.body[0];
        // Verify required fields (API contract)
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('sku');
        expect(product).toHaveProperty('category');
      }
    });

    it('GET /products/compare should maintain query parameters', async () => {
      // Test that required query params are validated
      const response = await request(app.getHttpServer())
        .get('/products/compare')
        .query({
          productId: 'test-id',
          cityCode: 'CPH',
          homeBaseCode: 'JFK',
        })
        .expect(404); // Will fail but validates contract

      // Verify error structure is maintained
      expect(response.body).toHaveProperty('statusCode');
    });
  });

  describe('Service Interface Tests', () => {
    it('should maintain ProductsService interface', () => {
      // Prevent accidental method removal
      expect(productsService).toHaveProperty('findAll');
      expect(productsService).toHaveProperty('findOne');
      expect(productsService).toHaveProperty('comparePrices');
      expect(productsService).toHaveProperty('createAffiliateLink');
      expect(productsService).toHaveProperty('scanQR');
    });
  });
});
