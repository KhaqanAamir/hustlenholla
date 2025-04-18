import { Test, TestingModule } from '@nestjs/testing';
import { StitchingController } from './stitching.controller';

describe('StitchingController', () => {
  let controller: StitchingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StitchingController],
    }).compile();

    controller = module.get<StitchingController>(StitchingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
