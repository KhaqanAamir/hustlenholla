import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { SupabaseClient } from '@supabase/supabase-js';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'auth') {
  private supabase: SupabaseClient;
  constructor(private readonly supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SUPABASE_JWT_SECRET,
      passReqToCallback: true
    });
    this.supabase = supabaseService.getSupabaseClient()
  }

  async validate(req: Request): Promise<any> {
    console.log('Inside Validate')
    const rawToken = req.headers['authorization'].split(' ')[1];
    console.log(rawToken)
    const user = await this.supabaseService.getSupabaseClient().auth.getUser(rawToken);
    console.log(user);
    delete user.data.user.identities;
    delete user.data.user.app_metadata;
    delete user.data.user.aud;
    delete user.data.user.role;
    delete user.data.user.is_anonymous;
    delete user.data.user.last_sign_in_at;
    delete user.data.user.email_confirmed_at;
    delete user.data.user.phone;
    delete user.data.user.user_metadata.email;
    if (user.error) {
      return false
    }
    const x = { ...user.data.user, token: rawToken };
    console.log(x)
    return { ...user.data.user, token: rawToken }
  }

  authenticate(req) {
    super.authenticate(req)
  }
}