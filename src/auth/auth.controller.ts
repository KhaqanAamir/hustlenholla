import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthBaseDto } from './dto/auth-base.dto';
import { CustomResponse } from 'src/types/types';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserOtpInterface } from './interfaces/user-otp.interface';
import { UserOtpEnum } from 'src/enums/user-otp.enum';

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
        @Body('email') email: string
    ): Promise<CustomResponse> {

        if (email.length === 0) {
            return { error: false, msg: 'Please enter a valid email address' }
        }
        const forgotPasswordOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString()

        const otpPayLoad: UserOtpInterface = {
            user_id: '',
            otp: forgotPasswordOtp,
            expires_at: expires_at,
            purpose: UserOtpEnum.FORGOT_PASSWORD,
            used: false
        }
        const response = await this.authService.forgotPassword(email, otpPayLoad)

        // if (response.error)
        //     throw new HttpException(response.msg, HttpStatus.BAD_REQUEST)

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
