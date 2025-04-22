import { Module } from '@nestjs/common';
import { WashingController } from './washing.controller';
import { WashingService } from './washing.service';

@Module({
  controllers: [WashingController],
  providers: [WashingService]
})
export class WashingModule {}
