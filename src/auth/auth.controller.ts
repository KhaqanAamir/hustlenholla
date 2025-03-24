import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthBaseDto } from './dto/auth-base.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {

    }

    @Post('/sign-up')
    async signUp(
        @Body() userSignUpDto: UserSignUpDto
    ) {
        const response = await this.authService.signUp(userSignUpDto)
        if (response.error) {
            throw new HttpException(response.msg, HttpStatus.BAD_REQUEST)
        }
        return response
    }

    @Post('/sign-in')
    async signInWithPassword(
        @Body() userSignInDto: AuthBaseDto
    ) {
        const response = await this.authService.signInWithPassword(userSignInDto)
        if (response.error)
            throw new HttpException(response.msg, HttpStatus.BAD_REQUEST)

        return response
    }
}
