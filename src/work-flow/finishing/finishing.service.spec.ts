import { Test, TestingModule } from '@nestjs/testing';
import { FinishingService } from './finishing.service';

describe('FinishingService', () => {
  let service: FinishingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinishingService],
    }).compile();

    service = module.get<FinishingService>(FinishingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
