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
import { InviteUserDto } from './dto/invite-user.dtos';
import * as crypto from 'crypto';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly mailService: MailerService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }


    async signUp(userSignUpDto: Prisma.UserCreateInput): Promise<CustomResponse> {
        try {
            const existingUser = await this.prisma.getData('user', 'findUnique', { where: { email: userSignUpDto.email } })
            if (existingUser.data) {
                return { error: true, msg: 'User already exists', data: null, status: HttpStatus.BAD_REQUEST }
            }

            userSignUpDto.password = await hashPassword(userSignUpDto.password)
            const signedUpResponse = await this.prisma.postData(
                'user',
                'create',
                userSignUpDto
            )
            if (signedUpResponse.error || signedUpResponse.data == null)
                return signedUpResponse

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
            const signedInResponse = await this.prisma.getData('user', 'findUnique', { where: { email: email }, select: { id: true, password: true, role: true } })
            if (!signedInResponse.error && signedInResponse.data != null && await comparePassword(password, signedInResponse.data.password)) {
                const { password: _, ...payload } = signedInResponse.data
                const result = {
                    accessToken: this.jwtService.sign(payload),
                    expiresAt: new Date(
                        Date.now() + 1000 * parseInt(process.env.JWT_EXPIRATION_SEC),
                    ).getTime(),
                    role: signedInResponse.data.role,
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


    async inviteUser(body: InviteUserDto): Promise<CustomResponse> {
        try {
            const { email, role } = body;
            const now = new Date();
            const existingInvite = await this.prisma.getData('inviteLink', 'findFirst', { where: { email: email, used: false, expires_at: { gte: now } } })
            if (existingInvite.data)
                return { error: true, msg: 'Invite link already sent to this email', data: null, status: HttpStatus.BAD_REQUEST }

            const token = crypto.randomBytes(32).toString('hex')
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

            const createInviteResponse = await this.prisma.postData('inviteLink', 'create', {
                email: email,
                token: token,
                role: role,
                expires_at: expiresAt,
                used: false
            })

            if (createInviteResponse.error || !createInviteResponse.data)
                return createInviteResponse

            console.log(createInviteResponse)

            const inviteLink = `${process.env.FRONTEND_URL}/first_login/set-password?token=${token}`;
            await this.mailService.sendMail({
                to: email,
                template: 'invite-user',
                subject: 'Invite User',
                context: {
                    inviteLink: inviteLink,
                    role: role
                }
            })

            return {
                error: false,
                msg: 'Invite link sent successfully',
                data: null,
                status: HttpStatus.OK
            }

        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async verifyInviteToken(token: string): Promise<CustomResponse> {
        try {
            const now = new Date();
            const inviteLinkResponse = await this.prisma.getData('inviteLink', 'findUnique', { where: { token: token, used: false, expires_at: { gte: now } } })
            if (inviteLinkResponse.error || !inviteLinkResponse.data)
                return inviteLinkResponse

            return {
                error: false,
                msg: 'Token verified successfully',
                data: inviteLinkResponse.data,
                status: HttpStatus.OK
            }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async setPassword(body: SetPasswordDto): Promise<CustomResponse> {
        try {
            const now = new Date()
            const inviteLinkResponse = await this.prisma.getData('inviteLink', 'findUnique', { where: { token: body.token, used: false, expires_at: { gte: now } } })
            if (inviteLinkResponse.error || !inviteLinkResponse.data)
                return inviteLinkResponse

            const hasedPassword = await hashPassword(body.password)

            const createUserResponse = await this.prisma.postData('user', 'create', {
                email: inviteLinkResponse.data.email,
                password: hasedPassword,
                role: inviteLinkResponse.data.role
            })

            if (createUserResponse.error || !createUserResponse.data)
                return createUserResponse

            await this.prisma.updateData('inviteLink', 'update', {
                where: { id: inviteLinkResponse.data.id },
                data: { used: true }
            })

            return { error: false, msg: 'Password Set Successfully', data: createUserResponse.data, status: HttpStatus.OK }
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

    async updateProfile(body: UpdateProfileDto, imagepath: string, userId: number): Promise<CustomResponse> {
        try {
            const updateProfileResponse = await this.prisma.updateData('user', 'update', {
                where: { id: userId },
                data: {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    image: imagepath
                }
            })

            return updateProfileResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getProfile(userId: number): Promise<CustomResponse> {
        try {
            const getProfileResponse = await this.prisma.getData('user', 'findUnique', {
                where: { id: userId },
            })

            return getProfileResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getAllUsers(): Promise<CustomResponse> {
        try {
            const getAllUsersResponse = await this.prisma.getData('user', 'findMany')

            return getAllUsersResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async deleteUser(userId: number): Promise<CustomResponse> {
        try {
            const deleteUserResponse = await this.prisma.deleteData('user', 'delete', {
                where: { id: userId }
            })

            return deleteUserResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}
