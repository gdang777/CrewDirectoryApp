import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue({ access_token: 'token', user: {} }),
      validateUser: jest
        .fn()
        .mockResolvedValue({ id: '1', email: 'test@example.com' }),
      revokeVerificationBadge: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('devLogin', () => {
    it('should return a token for dev user', async () => {
      const body = { email: 'dev@example.com', airlineId: '123' };
      const result = await controller.devLogin(body);
      expect(result).toEqual({ access_token: 'token', user: {} });
      expect(authService.validateUser).toHaveBeenCalledWith(
        body.email,
        body.airlineId
      );
    });
  });
});
