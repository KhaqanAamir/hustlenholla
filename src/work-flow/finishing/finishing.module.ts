import { Module } from '@nestjs/common';
import { FinishingController } from './finishing.controller';
import { FinishingService } from './finishing.service';

@Module({
  controllers: [FinishingController],
  providers: [FinishingService]
})
export class FinishingModule {}
