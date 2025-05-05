import { HttpStatus, Injectable } from '@nestjs/common';
import { createClient, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, SupabaseClient, User } from '@supabase/supabase-js';
import { Database, TablesInsert } from 'src/types/supabase';
import { CustomResponse } from 'src/types/types';
import { pgToHttpErr } from '../types/utils';

@Injectable()
export class SupabaseService {
    private SupaBaseClient: SupabaseClient

    private SupabaseAdmin: SupabaseClient

    constructor() {
        this.SupaBaseClient = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY,
            {
                global: { headers: { Authorization: `Bearer` } }
            }
        )

        this.SupabaseAdmin = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY,
        )
    }
    public getSupabaseClient(): SupabaseClient {
        return this.SupaBaseClient
    }

    public async postData<T extends keyof Database['public']['Tables'], U extends string = 'id'>(
        tableName: T,
        dataToPost: TablesInsert<T> | TablesInsert<T>[],
        selectFields: U = 'id' as U
    ): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.from(tableName).insert(dataToPost).select(selectFields);
            if (error) {
                return { error: true, msg: error.message, data: null, status: error.code ? pgToHttpErr(error.code) : HttpStatus.BAD_REQUEST }
            }
            return {
                error: false,
                msg: `Data sucessfully posted to table ${tableName}`,
                data: data,
                status: HttpStatus.OK
            }
        }
        catch (e) {
            return { error: true, msg: `An server error occured while posting Data. ${e}` }
        }
    }

    public async signUp(
        dataToSignUp: SignUpWithPasswordCredentials
    ): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.auth.signUp(dataToSignUp);
            if (error) {
                return { error: true, msg: `Error Signing Up User. ${error.message}`, data: null }
            }
            return {
                error: false,
                msg: 'Signed Up Successfully',
                data: {
                    id: data.user.id,
                    accessToken: data.session.access_token,
                    refreshToken: data.session.refresh_token
                }
            }
        }
        catch (e) {
            return { error: true, msg: `Internal Server Error Occured. ${e}`, data: null }
        }
    }

    public async signInWithPassword(
        dataToSignIn: SignInWithPasswordCredentials
    ): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.auth.signInWithPassword(
                dataToSignIn
            )
            if (error)
                return { error: true, data: null, msg: `Error Signing In User. ${error.message}` }

            return {
                error: false,
                msg: 'User Signed In Successfully',
                data: {
                    accessToken: data.session.access_token,
                    refreshToken: data.session.refresh_token,
                    expires_at: data.session.expires_at
                        ? data.session.expires_at
                        : null,
                    expires_in: data.session.expires_in,
                    id: data.user.id,
                }
            }
        }
        catch (e) {
            return { error: true, msg: `Internal Server Error Occured. ${e}`, data: null }
        }
    }

    async resetPasswordForEmail(email: string): Promise<CustomResponse> {
        try {
            let { data, error } = await this.SupaBaseClient.auth.resetPasswordForEmail(email)
            if (error)
                return { error: true, msg: 'Unexpected error occured while sending email' }

            return { error: false, msg: 'Email sent Successfully' }
        }
        catch (e) {
            return { error: true, msg: `Unexpected error occurred, while fetching the user. ${e}` };
        }
    }

    async resetPassword(newPassword: string) {
        try {
            let { data, error } = await this.SupaBaseClient.auth.updateUser({
                password: newPassword
            })
        }
        catch (e) {
            return { error: true, msg: `Unexpected error occurred, while fetching the user. ${e}` };
        }
    }

    public async getUser(): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.auth.getUser()
            if (error)
                return { error: true, msg: 'Failed to get user', details: error };

            return {
                error: false, data: data.user, msg: 'User Fetched Successfully'
            }
        }
        catch (e) {
            return { error: true, msg: `Unexpected error occurred, while fetching the user. ${e}` };
        }
    }

    // public async getUserByEmail(email: string): Promise<CustomResponse> {
    //     try {
    //         const { data, error } = await this.SupabaseAdmin.auth.admin.listUsers();
    //         if (error)
    //             return { error: true, msg: 'Unable to get the list of users', details: error };

    //         const user = data.users.find(u => u.email === email)
    //         if (!user) {
    //             return { error: false, msg: 'User not founds' }
    //         }

    //         return {
    //             error: false, data: user, msg: 'User Fetched Successfully'
    //         }
    //     }
    //     catch (e) {
    //         return { error: true, msg: `Unexpected error occurred, while fetching the user. ${e}` };
    //     }
    // }
}
