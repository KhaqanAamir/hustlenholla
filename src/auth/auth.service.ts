import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CustomResponse } from 'src/types/types';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthBaseDto } from './dto/auth-base.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    private db: SupabaseService

    constructor(private readonly mailService: MailerService) {
        this.db = new SupabaseService();
    }


    async signUp(userSignUpDto: UserSignUpDto): Promise<CustomResponse> {
        try {
            const signedUpResponse = await this.db.signUp({
                email: userSignUpDto.email,
                password: userSignUpDto.password,
                options: {
                    data: {
                        first_name: userSignUpDto.first_name,
                        last_name: userSignUpDto.last_name,
                        role: userSignUpDto.role
                    }
                }
            })

            if (signedUpResponse.error)
                return { error: signedUpResponse.error, msg: signedUpResponse.msg, data: signedUpResponse.data }

            await this.db.postData('users', {
                id: signedUpResponse.data.id,
                first_name: userSignUpDto.first_name,
                last_name: userSignUpDto.last_name,
                role: userSignUpDto.role,
                email: userSignUpDto.email,
            })

            return { error: signedUpResponse.error, msg: signedUpResponse.msg, data: signedUpResponse.data }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async signInWithPassword(
        userSignInDto: AuthBaseDto
    ): Promise<CustomResponse> {
        try {
            const signedInResponse = await this.db.signInWithPassword(userSignInDto)
            if (signedInResponse.error)
                return { error: true, msg: signedInResponse.msg, data: signedInResponse.data }

            return {
                error: signedInResponse.error,
                data: signedInResponse.data,
                msg: signedInResponse.msg
            }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async forgotPassword(userId: string, email: string): Promise<CustomResponse> {
        try {
            const user = await this.db.getUser()
            if (user.data.email != email)
                return { error: false, msg: 'Please enter the correct email address' }

            const forgotPasswordOtp = Math.floor(100000 + Math.random() * 900000).toString();
            // const otpResponse = await this.db.postData('user_otps',)
            this.mailService.sendMail({
                to: user.data.email,
                template: 'forgot-password',
                subject: 'Forgot Password OTP',
                context: {
                    forgotPasswordOtp
                }
            })
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

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
