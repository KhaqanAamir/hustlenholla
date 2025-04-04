import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, SupabaseService]
})
export class OrdersModule { }
