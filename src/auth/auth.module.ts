import { Module } from '@nestjs/common';
import { UserGuard } from './guards/auth.guard';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [],
  providers: [UserGuard, SupabaseStrategy, AuthService, SupabaseService],
  exports: [],
  controllers: [AuthController]
})
export class AuthModule { }