import { Test, TestingModule } from '@nestjs/testing';
import { WashingController } from './washing.controller';

describe('WashingController', () => {
  let controller: WashingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WashingController],
    }).compile();

    controller = module.get<WashingController>(WashingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
