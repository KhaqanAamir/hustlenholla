import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomResponse } from '../types/types';
import { AuthBaseDto } from './dto/auth-base.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UserOtpInterface } from './interfaces/user-otp.interface';
import { OTP_PURPOSE, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma_service/prisma.service';
import { comparePassword, hashPassword } from '../utility/functions/bcrypts';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
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
            const signedInResponse = await this.prisma.getData('user', 'findFirst', { where: { email: email }, select: { id: true, password: true } })
            if (!signedInResponse.error && signedInResponse.data != null && await comparePassword(password, signedInResponse.data.password)) {
                const { password: _, ...payload } = signedInResponse.data
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
                return signedInResponse
            }
            signedInResponse.error = false
            signedInResponse.msg = 'Invalid email or password'
            signedInResponse.data = null
            signedInResponse.status = HttpStatus.UNAUTHORIZED
            return signedInResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async forgotPassword(email: string, otpPayLoad: UserOtpInterface): Promise<CustomResponse> {
        try {

            const transaction = await this.prisma.$transaction(async () => {
                const getUserResponse = await this.prisma.getData('user', 'findFirst', { where: { email: email }, select: { id: true, email: true } })

                if (getUserResponse.error || getUserResponse.data == null) {
                    return getUserResponse
                }

                otpPayLoad.user_id = getUserResponse.data.id

                const otpResponse = await this.prisma.postData('user_Otps', 'create', otpPayLoad)

                if (otpResponse.error || otpResponse.data == null)
                    return otpResponse

                await this.mailService.sendMail({
                    to: getUserResponse.data.email,
                    template: 'forgot-password',
                    subject: 'Forgot Password OTP',
                    context: {
                        forgotPasswordOtp: otpPayLoad.otp
                    }
                })

                return {
                    error: false,
                    msg: 'OTP sent to your email address',
                    data: getUserResponse.data.email,
                    status: HttpStatus.OK
                }
            })

            return transaction
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async verifyOtp(email: string, otp: string, purpose: OTP_PURPOSE): Promise<CustomResponse> {
        try {
            const getUserResponse = await this.prisma.getData('user', 'findFirst', { where: { email: email }, select: { id: true, email: true } })

            if (getUserResponse.error || getUserResponse.data == null) {
                return getUserResponse
            }

            const verifyOtpResponse = await this.prisma.getData('user_Otps', 'findFirst', {
                where: {
                    user_id: getUserResponse.data.id,
                    otp: otp,
                    purpose: purpose,
                    used: false
                }
            })

            if (verifyOtpResponse.error || !verifyOtpResponse.data)
                return verifyOtpResponse

            const updateOtpResponse = await this.prisma.updateData('user_Otps', 'update', {
                where: { id: verifyOtpResponse.data.id },
                data: { used: true }
            })

            if (updateOtpResponse.error || !updateOtpResponse.data)
                return updateOtpResponse

            return {
                error: false,
                msg: 'OTP verified successfully'
            }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<CustomResponse> {
        try {
            const user = await this.prisma.getData('user', 'findFirst', { where: { email: resetPasswordDto.email }, select: { id: true, email: true } })
            if (user.error || user.data == null) {
                return user
            }
            const hashedPassword = await hashPassword(resetPasswordDto.newPassword)
            const updatePasswordResponse = await this.prisma.updateData('user', 'update', {
                where: { id: user.data.id },
                data: { password: hashedPassword }
            })
            if (updatePasswordResponse.error || !updatePasswordResponse.data)
                return updatePasswordResponse

            return {
                error: false,
                msg: 'Password reset successfully',
                data: null,
                status: HttpStatus.OK
            }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}
