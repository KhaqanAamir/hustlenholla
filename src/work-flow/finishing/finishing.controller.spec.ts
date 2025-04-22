import { Test, TestingModule } from '@nestjs/testing';
import { FinishingController } from './finishing.controller';

describe('FinishingController', () => {
  let controller: FinishingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinishingController],
    }).compile();

    controller = module.get<FinishingController>(FinishingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
