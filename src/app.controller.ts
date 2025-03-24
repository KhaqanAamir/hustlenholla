import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserGuard } from './auth/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/protected')
  @UseGuards(UserGuard)
  async protected(@Req() req) {
    return {
      "message": "AuthGuard works 🎉",
      "authenticated_user": req.user
    };
  }
}
