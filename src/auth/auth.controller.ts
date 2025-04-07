import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthBaseDto } from './dto/auth-base.dto';
import { CustomResponse } from 'src/types/types';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

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

    @Post('/forgot-password')
    async forgotPassword(
        @Req() req,
        @Body('email') email: string
    ): Promise<CustomResponse> {

        if (email.length === 0) {
            return { error: false, msg: 'Please enter a valid email address' }
        }
        return
        const response = await this.authService.forgotPassword(req.user.id, email)
        if (response.error)
            throw new HttpException(response.msg, HttpStatus.BAD_REQUEST)

        return response
    }

    @Patch('/reset-password')
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto
    ) {
        const response = await this.authService.resetPassword(resetPasswordDto)
        if (response.error)
            throw new HttpException(response.msg, HttpStatus.BAD_REQUEST)

        return response
    }

}
