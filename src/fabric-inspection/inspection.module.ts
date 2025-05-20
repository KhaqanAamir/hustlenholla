import { Module } from '@nestjs/common';
import { FabricInspectionController } from './inspection.controller';
import { FabricInspectionService } from './inspection.service';

@Module({
  controllers: [FabricInspectionController],
  providers: [FabricInspectionService]
})
export class FabricInspectionModule { }
