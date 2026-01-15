import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return greeting message', () => {
      const result = 'Crew Directory API is running!';
      jest.spyOn(appService, 'getHello').mockImplementation(() => result);

      expect(appController.getHello()).toBe(result);
    });
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
