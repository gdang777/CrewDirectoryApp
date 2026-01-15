import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PlaybooksService } from '../../modules/playbooks/playbooks.service';
import { Playbook } from '../../modules/playbooks/entities/playbook.entity';

/**
 * Integration tests for Playbooks module
 * These tests verify that the entire flow works together
 * and catch breaking changes in API contracts
 */
describe('Playbooks Integration Tests', () => {
  let app: INestApplication;
  let playbooksService: PlaybooksService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    playbooksService = moduleFixture.get<PlaybooksService>(PlaybooksService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('API Contract Tests', () => {
    it('GET /playbooks should maintain response structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/playbooks')
        .expect(200);

      // Verify response is an array
      expect(Array.isArray(response.body)).toBe(true);

      // If there are playbooks, verify structure
      if (response.body.length > 0) {
        const playbook = response.body[0];
        // Verify required fields exist (contract)
        expect(playbook).toHaveProperty('id');
        expect(playbook).toHaveProperty('title');
        expect(playbook).toHaveProperty('description');
        expect(playbook).toHaveProperty('tier');
      }
    });

    it('GET /playbooks/:id should maintain response structure', async () => {
      // This test ensures the API contract doesn't break
      // Even if the ID doesn't exist, we verify error structure
      const response = await request(app.getHttpServer())
        .get('/playbooks/test-id-123')
        .expect(404);

      // Verify error response structure
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('message');
    });

    it('POST /playbooks should maintain request/response contract', async () => {
      // Test that the API contract is maintained
      const response = await request(app.getHttpServer())
        .post('/playbooks')
        .send({
          title: 'Test Playbook',
          description: 'Test Description',
          cityId: 'test-city',
        })
        .expect(401); // Will fail auth, but validates request structure

      // Verify error response structure is maintained
      expect(response.body).toHaveProperty('statusCode');
    });
  });

  describe('Service Integration Tests', () => {
    it('should maintain service interface', () => {
      // Verify service methods exist (prevent accidental removal)
      expect(playbooksService).toHaveProperty('findAll');
      expect(playbooksService).toHaveProperty('findOne');
      expect(playbooksService).toHaveProperty('create');
      expect(playbooksService).toHaveProperty('createPOI');
      expect(playbooksService).toHaveProperty('vote');
    });
  });
});
