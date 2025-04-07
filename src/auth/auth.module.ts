import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { SupabaseStrategy } from './strategies/supabase.strategy';



@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy],
  exports: [SupabaseStrategy]
})
export class AuthModule { }
