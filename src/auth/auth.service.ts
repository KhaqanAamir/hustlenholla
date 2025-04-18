import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CustomResponse } from 'src/types/types';
import { AuthBaseDto } from './dto/auth-base.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserOtpInterface } from './interfaces/user-otp.interface';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { comparePassword, hashPassword } from 'src/utility/functions/bcrypts';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly db: SupabaseService,
        private readonly mailService: MailerService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }


    async signUp(userSignUpDto: Prisma.UserCreateInput): Promise<CustomResponse> {
        try {
            userSignUpDto.password = await hashPassword(userSignUpDto.password)

            const signedUpResponse = await this.prisma.postData(
                'user',
                'create',
                userSignUpDto
            )
            const { password: _, ...payload } = signedUpResponse
            const result = {
                accessToken: this.jwtService.sign(payload),
                expiresAt: new Date(
                    Date.now() + 1000 * parseInt(process.env.JWT_EXPIRATION_SEC),
                ).getTime(),
                roles: signedUpResponse.data.role,
                email: signedUpResponse.data.email,
                id: signedUpResponse.data.id
            }
            signedUpResponse.data = result
            return signedUpResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async signIn(
        { email, password }: AuthBaseDto
    ): Promise<CustomResponse> {
        try {
            const signedInResponse = await this.prisma.getData('user', 'findFirst', { where: { email: email }, select: { password: true } })

            if (!signedInResponse.error && await comparePassword(password, signedInResponse.data.password)) {
                const { password: _, ...payload } = signedInResponse
                const result = {
                    accessToken: this.jwtService.sign(payload),
                    expiresAt: new Date(
                        Date.now() + 1000 * parseInt(process.env.JWT_EXPIRATION_SEC),
                    ).getTime(),
                    roles: signedInResponse.data.role,
                    email: signedInResponse.data.email,
                    id: signedInResponse.data.id
                }
                signedInResponse.data = result
            }
            return signedInResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    // async forgotPassword(email: string, otpPayLoad: UserOtpInterface): Promise<CustomResponse> {
    //     try {
    //         const user = await this.db.getUserByEmail(email)

    //         if (!user.data) {
    //             return user
    //         }

    //         otpPayLoad.user_id = user.data.id

    //         // const otpResponse = await this.db.postData('user_otps', otpPayLoad)

    //         // if (otpResponse.error) {
    //         //     return otpResponse
    //         // }

    //         this.mailService.sendMail({
    //             to: user.data.email,
    //             template: 'forgot-password',
    //             subject: 'Forgot Password OTP',
    //             context: {
    //                 forgotPasswordOtp: otpPayLoad.otp
    //             }
    //         })
    //     }
    //     catch (e) {
    //         return { error: true, msg: `Inernal server error occured, ${e}` }
    //     }
    // }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<CustomResponse> {
        try {
            const user = await this.db.getUser()
            if (user.data.password != resetPasswordDto.oldPassword)
                return { error: false, msg: 'Old Password is invalid' }

            const response = await this.db.resetPassword(resetPasswordDto.newPassword)
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}
