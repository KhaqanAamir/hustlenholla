import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(private readonly supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true
    })
  }

  async validate(req: Request): Promise<any> {
    console.log('on Validate function')
    const rawToken = req.headers['authorization'].split(' ')[1];
    const user = await this.supabaseService.getSupabaseClient().auth.getUser(rawToken);
    console.log(user);
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