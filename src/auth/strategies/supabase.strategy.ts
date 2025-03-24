import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  private supabaseClient: SupabaseClient;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true
    })
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    )
  }

  async validate(req: Request): Promise<any> {
    console.log('on Validate function')
    const rawToken = req.headers['authorization'].split(' ')[1];
    const user = await this.supabaseClient.auth.getUser(rawToken);
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