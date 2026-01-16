import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../playbooks/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return existing user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should create new user if not exists', async () => {
      const mockNewUser = {
        id: '2',
        email: 'new@example.com',
        name: 'new',
        verifiedBadge: false,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockNewUser);
      mockUserRepository.save.mockResolvedValue(mockNewUser);

      const result = await service.validateUser('new@example.com');

      expect(result).toEqual(mockNewUser);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should update user with airlineId if provided', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        airlineId: null,
        verifiedBadge: false,
      };
      const updatedUser = {
        ...mockUser,
        airlineId: 'airline-1',
        verifiedBadge: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.validateUser(
        'test@example.com',
        'airline-1'
      );

      expect(result.airlineId).toBe('airline-1');
      expect(result.verifiedBadge).toBe(true);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token and user data', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        airlineId: 'airline-1',
        verifiedBadge: true,
        karmaScore: 10,
      };
      const mockToken = 'mock-jwt-token';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = service.login(mockUser as User);

      expect(result).toHaveProperty('access_token', mockToken);
      expect(result).toHaveProperty('user');
      expect((result as any).user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        airlineId: mockUser.airlineId,
        verifiedBadge: mockUser.verifiedBadge,
        karmaScore: mockUser.karmaScore,
      });
      expect(mockJwtService.sign).toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should return user for valid token', async () => {
      const mockToken = 'valid-token';
      const mockPayload = { sub: 'user-1', email: 'test@example.com' };
      const mockUser = { id: 'user-1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Note: This test needs adjustment as verifyToken expects the full token string
      // In a real scenario, you'd extract the token differently
      const result = await service.verifyToken(mockToken);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
