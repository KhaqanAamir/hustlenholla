import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CustomResponse } from 'src/types/types';
import { UserSignUpDto } from './dto/user-signup.dto';
import { AuthBaseDto } from './dto/auth-base.dto';

@Injectable()
export class AuthService {
    private db: SupabaseService

    constructor() {
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

            await this.db.postData('Users', {
                id: signedUpResponse.data.id,
                first_name: userSignUpDto.first_name,
                last_name: userSignUpDto.last_name,
                role: userSignUpDto.role,
                email: userSignUpDto.email,
                encrypted_password: userSignUpDto.password
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
}
