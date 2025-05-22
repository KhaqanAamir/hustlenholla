import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthBaseDto } from './dto/auth-base.dto';
import { CustomResponse } from 'src/types/types';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserOtpInterface } from './interfaces/user-otp.interface';
import { OTP_PURPOSE, Prisma } from '@prisma/client';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/sign-up')
    async signUp(
        @Body() userSignUpDto: UserSignUpDto
    ) {
        return await this.authService.signUp(
            userSignUpDto as Prisma.UserCreateInput
        )
    }

    @Post('/sign-in')
    async signIn(
        @Body() userSignInDto: AuthBaseDto
    ) {
        return await this.authService.signIn(userSignInDto)
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
            purpose: OTP_PURPOSE.FORGOT_PASSWORD,
            used: false
        }
        return await this.authService.forgotPassword(email, otpPayLoad)
    }

    @Get('/verify-otp')
    async verifyOtp(
        @Body('email') email: string,
        @Body('otp') otp: string
    ) {
        if (email.length === 0 || otp.length === 0) {
            return { error: false, msg: 'Please enter a valid email address and OTP' }
        }

        return await this.authService.verifyOtp(email, otp, OTP_PURPOSE.FORGOT_PASSWORD)
    }

    @Patch('/reset-password')
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto
    ) {
        return await this.authService.resetPassword(resetPasswordDto)
    }
}
