import { Module } from '@nestjs/common';
import { PackagingController } from './packaging.controller';
import { PackagingService } from './packaging.service';

@Module({
  controllers: [PackagingController],
  providers: [PackagingService]
})
export class PackagingModule {}
