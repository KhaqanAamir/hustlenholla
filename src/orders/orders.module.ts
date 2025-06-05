import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { CuttingService } from 'src/work-flow/cutting/cutting.service';
import { WorkOrdersModule } from './work-orders/work-orders.module';

@Module({
  imports: [SupabaseModule, WorkOrdersModule],
  controllers: [OrdersController],
  providers: [OrdersService, CuttingService]
})
export class OrdersModule { }
