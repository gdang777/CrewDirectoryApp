import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaybooksService } from './playbooks.service';
import { Playbook, City, POI, PlaybookEdit, Vote, User } from './entities';
import { NotFoundException } from '@nestjs/common';

describe('PlaybooksService', () => {
  let service: PlaybooksService;
  let playbookRepository: Repository<Playbook>;
  let cityRepository: Repository<City>;
  let poiRepository: Repository<POI>;
  let editRepository: Repository<PlaybookEdit>;
  let voteRepository: Repository<Vote>;
  let userRepository: Repository<User>;

  const mockPlaybookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn(),
  };

  const mockCityRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPOIRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockEditRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockVoteRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaybooksService,
        {
          provide: getRepositoryToken(Playbook),
          useValue: mockPlaybookRepository,
        },
        {
          provide: getRepositoryToken(City),
          useValue: mockCityRepository,
        },
        {
          provide: getRepositoryToken(POI),
          useValue: mockPOIRepository,
        },
        {
          provide: getRepositoryToken(PlaybookEdit),
          useValue: mockEditRepository,
        },
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<PlaybooksService>(PlaybooksService);
    playbookRepository = module.get<Repository<Playbook>>(
      getRepositoryToken(Playbook),
    );
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
    poiRepository = module.get<Repository<POI>>(getRepositoryToken(POI));
    editRepository = module.get<Repository<PlaybookEdit>>(
      getRepositoryToken(PlaybookEdit),
    );
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all playbooks', async () => {
      const mockPlaybooks = [
        { id: '1', title: 'Test Playbook', description: 'Test' },
      ];
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPlaybooks),
      };

      mockPlaybookRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(result).toEqual(mockPlaybooks);
      expect(mockPlaybookRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should filter by cityId when provided', async () => {
      const cityId = 'city-1';
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockPlaybookRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll(cityId);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'playbook.cityId = :cityId',
        { cityId },
      );
    });
  });

  describe('findOne', () => {
    it('should return a playbook by id', async () => {
      const mockPlaybook = {
        id: '1',
        title: 'Test Playbook',
        description: 'Test',
      };
      mockPlaybookRepository.findOne.mockResolvedValue(mockPlaybook);

      const result = await service.findOne('1');

      expect(result).toEqual(mockPlaybook);
      expect(mockPlaybookRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['city', 'pois', 'edits'],
      });
    });

    it('should throw NotFoundException when playbook not found', async () => {
      mockPlaybookRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new playbook', async () => {
      const createDto = {
        title: 'New Playbook',
        description: 'Description',
        cityId: 'city-1',
      };
      const mockCity = { id: 'city-1', name: 'Test City' };
      const mockPlaybook = { id: '1', ...createDto, city: mockCity };

      mockCityRepository.findOne.mockResolvedValue(mockCity);
      mockPlaybookRepository.create.mockReturnValue(mockPlaybook);
      mockPlaybookRepository.save.mockResolvedValue(mockPlaybook);

      const result = await service.create(createDto, 'user-1');

      expect(result).toEqual(mockPlaybook);
      expect(mockCityRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.cityId },
      });
      expect(mockPlaybookRepository.create).toHaveBeenCalled();
      expect(mockPlaybookRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when city not found', async () => {
      const createDto = {
        title: 'New Playbook',
        description: 'Description',
        cityId: 'non-existent',
      };

      mockCityRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
