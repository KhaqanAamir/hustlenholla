import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthBaseDto } from './dto/auth-base.dto';
import { CustomResponse } from 'src/types/types';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserOtpInterface } from './interfaces/user-otp.interface';
import { OTP_PURPOSE, Prisma } from '@prisma/client';
import { InviteUserDto } from './dto/invite-user.dtos';
import { SetPasswordDto } from './dto/set-password.dto';
import { UserGuard } from './guards/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';


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

    @Post('/invite-user')
    async inviteUser(
        @Body() body: InviteUserDto
    ) {
        return await this.authService.inviteUser(body)
    }

    @Get('/verify-invite-token/:token')
    async verifyInviteToken(
        @Param('token') token: string
    ) {
        if (token.length === 0) {
            return { error: false, msg: 'Please enter a valid token' }
        }

        return await this.authService.verifyInviteToken(token)
    }

    @Post('/set-password')
    async setPassword(
        @Body() body: SetPasswordDto
    ) {
        return await this.authService.setPassword(body)
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

    @Patch('/update-profile')
    @UseGuards(UserGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: join(__dirname, '..', '..', 'uploads'),
                filename: (req, file, callback) => {
                    const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`
                    callback(null, uniqueSuffix)
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false)
                }
                callback(null, true)
            },
            limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
        })
    )
    async updateProfile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UpdateProfileDto,
        @Req() req
    ) {
        if (!file)
            throw new BadRequestException('Please upload a an image for user')
        const imagePath = `/uploads/${file.filename}`
        return await this.authService.updateProfile(body, imagePath, req.user.id)
    }

    @UseGuards(UserGuard)
    @Get('/get-profile')
    async getProfile(
        @Req() req
    ) {
        return await this.authService.getProfile(req.user.id)
    }
}
