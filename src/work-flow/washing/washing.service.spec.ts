import { Test, TestingModule } from '@nestjs/testing';
import { WashingService } from './washing.service';

describe('WashingService', () => {
  let service: WashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WashingService],
    }).compile();

    service = module.get<WashingService>(WashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
