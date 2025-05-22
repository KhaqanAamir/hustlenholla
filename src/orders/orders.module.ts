import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { CuttingService } from 'src/work-flow/cutting/cutting.service';

@Module({
  imports: [SupabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService, CuttingService]
})
export class OrdersModule { }
