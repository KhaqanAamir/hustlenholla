import { Test, TestingModule } from '@nestjs/testing';
import { StitchingService } from './stitching.service';

describe('StitchingService', () => {
  let service: StitchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StitchingService],
    }).compile();

    service = module.get<StitchingService>(StitchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
