import { Module } from '@nestjs/common';
import { UserGuard } from './guards/auth.guard';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [],
  providers: [UserGuard, SupabaseStrategy, AuthService],
  exports: [],
  controllers: [AuthController]
})
export class AuthModule { }