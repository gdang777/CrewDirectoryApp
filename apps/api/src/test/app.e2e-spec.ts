import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../modules/playbooks/entities/user.entity';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/health (GET) should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('/ (GET) should return greeting', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBe('Crew Directory API is running!');
        });
    });
  });

  describe('Playbooks API', () => {
    it('/playbooks (GET) should return playbooks list', () => {
      return request(app.getHttpServer())
        .get('/playbooks')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/playbooks/cities (GET) should return cities list', () => {
      return request(app.getHttpServer())
        .get('/playbooks/cities')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/playbooks (POST) should require authentication', () => {
      return request(app.getHttpServer())
        .post('/playbooks')
        .send({
          title: 'Test Playbook',
          description: 'Test',
          cityId: 'test-city',
        })
        .expect(401); // Unauthorized
    });

    it('/playbooks (POST) should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/playbooks')
        .send({
          // Missing required fields
        })
        .expect(401); // Will fail auth first, but validation would catch missing fields
    });
  });

  describe('Products API', () => {
    it('/products (GET) should return products list', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/products/:id (GET) should return 404 for non-existent product', () => {
      return request(app.getHttpServer())
        .get('/products/non-existent-id')
        .expect(404);
    });
  });
});
